import { MongoClient } from 'mongodb';
import { hash, compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { subBusinessDays } from 'date-fns';
import { Dumbbell } from 'lucide-react';
import { postJobOpening, postJobRequest, deleteJobOpening, deleteJobRequest, postMessage} from '@/lib/firebase/firebaseClient';


const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

// Helper to get current user from session
async function getCurrentUser(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  const client = await connectToDatabase();
  const db = client.db(dbName);
  const user = await db.collection('users').findOne({ id: session.user.id });
  return user;
}

export async function POST(request, { params }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    const body = await request.json();
    const client = await connectToDatabase();
    const db = client.db(dbName);

    // REGISTER (Join Request)
    if (path === 'register') {
      const { fullName, email, password, linkedinProfile, company, bio } = body;
      
      if (!fullName || !email || !password || !techStack) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return Response.json({ error: 'User already exists' }, { status: 409 });
      }

      const hashedPassword = await hash(password, 12);
      const userId = uuidv4();
      
      const newUser = {
        id: userId,
        fullName,
        email,
        password: hashedPassword,
        linkedinProfile: linkedinProfile || '',
        company,
        bio: bio || '',
        role: 'USER',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      await db.collection('users').insertOne(newUser);

      // Create notification for admin
      await db.collection('notifications').insertOne({
        id: uuidv4(),
        userId: 'ADMIN',
        message: `New join request from ${fullName}`,
        type: 'JOIN_REQUEST',
        relatedId: userId,
        read: false,
        createdAt: new Date().toISOString(),
      });

      return Response.json({ 
        message: 'Join request submitted successfully',
        user: { id: userId, email, fullName, status: 'PENDING' }
      }, { status: 201 });
    }

    if(path === 'change-password'){
      const currentUser = await getCurrentUser(request);
      const {password} =body;
      const hashedPassword = await hash(password, 12);

        await db.collection('users').updateOne(
          {email: currentUser.email}, 
          {$set: {password: hashedPassword}});

      return Response.json({ message: 'Password Updated Successfully' }, { status: 201 });

    }


    if(path === 'messages'){

      try {
        const { room, username, message, timestamp } = body;

        const messageObj = {
          username,
          message,
          timestamp: timestamp ? new Date(timestamp) : new Date()
        };
        await postMessage(messageObj);
        const doc = {
          ...messageObj,
          timestamp: messageObj.timestamp.toISOString()
        };

        // await db.collection("messages").insertOne(doc);
        return Response.json(messageObj);
      } catch (error) {
        console.error(error);
        return new Response("Error creating message", { status: 500 });
      }
    }


    // JOB REQUESTS
    if (path === 'job-requests') {
      const currentUser = await getCurrentUser(request);
      if (!currentUser || currentUser.status !== 'APPROVED') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const { title, description, skills,location,experienceLevel } = body;

      const jobRequest = {
        id: uuidv4(),
        userId: currentUser.id,
        userFullName: currentUser.fullName,
        title,
        description,
        skills,
        location,
        experienceLevel,
        email: currentUser.email,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };

      await postJobRequest(jobRequest);
      


      // Notify all approved users about new job request
      const approvedUsers = await db.collection('users').find({ 
        status: 'APPROVED',
        id: { $ne: currentUser.id }
      }).toArray();

      const notifications = approvedUsers.map(user => ({
        id: uuidv4(),
        userId: user.id,
        message: `New job Request: ${title} from ${jobRequest.userFullName}`,
        type: 'JOB_REQUEST',
        relatedId: jobRequest.id,
        read: false,
        createdAt: new Date().toISOString(),
      }));

      if (notifications.length > 0) {
        await db.collection('notifications').insertMany(notifications);
      }

      return Response.json({ message: 'Job request posted', jobRequest }, { status: 201 });
    }

    // JOB OPENINGS
    if (path === 'job-openings') {
      const currentUser = await getCurrentUser(request);
      if (!currentUser || currentUser.status !== 'APPROVED') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { company, title, description, skills, location, jobType } = body;
      
      const jobOpening = {
        id: uuidv4(),
        userId: currentUser.id,
        userFullName: currentUser.fullName,
        userLinkedIn: currentUser.linkedinProfile,
        title:title,
        company: company,
        skills: skills,
        description: description,
        location: location,
        jobType: jobType,
        email: currentUser.email,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
      };

      await postJobOpening(jobOpening);
      

      // Notify all approved users about new job opening
      const approvedUsers = await db.collection('users').find({ 
        status: 'APPROVED',
        id: { $ne: currentUser.id }
      }).toArray();

      const notifications = approvedUsers.map(user => ({
        id: uuidv4(),
        userId: user.id,
        message: `New job opening: ${title} at ${company}`,
        type: 'JOB_OPENING',
        relatedId: jobOpening.id,
        read: false,
        createdAt: new Date().toISOString(),
      }));

      if (notifications.length > 0) {
        await db.collection('notifications').insertMany(notifications);
      }

      return Response.json({ message: 'Job opening posted', jobOpening }, { status: 201 });
    }


    // ADMIN: APPROVE USER
    if (path === 'admin/approve-user') {
      const currentUser = await getCurrentUser(request);
      if (!currentUser || currentUser.role !== 'ADMIN') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { userId } = body;
      await db.collection('users').updateOne(
        { id: userId },
        { $set: { status: 'APPROVED' } }
      );

      // Notify user
      await db.collection('notifications').insertOne({
        id: uuidv4(),
        userId,
        message: 'Your account has been approved! Welcome to the platform.',
        type: 'ACCOUNT_APPROVED',
        relatedId: userId,
        read: false,
        createdAt: new Date().toISOString(),
      });

      return Response.json({ message: 'User approved' }, { status: 200 });
    }

    // ADMIN: REJECT USER
    if (path === 'admin/reject-user') {
      const currentUser = await getCurrentUser(request);
      if (!currentUser || currentUser.role !== 'ADMIN') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { userId } = body;
      await db.collection('users').deleteOne({ id: userId });
      await db.collection('notifications').deleteMany({ userId });

      return Response.json({ message: 'User rejected' }, { status: 200 });
    }

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    const { searchParams } = new URL(request.url);
    const client = await connectToDatabase();
    const db = client.db(dbName);

    // GET USER PROFILE
    if (path === 'profile') {
      const currentUser = await getCurrentUser(request);
      if (!currentUser) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { password, ...userWithoutPassword } = currentUser;
      return Response.json(userWithoutPassword, { status: 200 });
    }

      //MARK INDIVIDUAL NOTIFICATION AS READ
    if(path === 'notifications/read'){
      const currentUser = await getCurrentUser(request);
      const notificationId = searchParams.get('id');
      const result = await db.collection('notifications').updateOne(
              {"id":notificationId, "userId": currentUser.id},
              {"$set": {"read": true}});
      return Response.json({"message": "Notification markes ad read"},{status:200});
    }

    //MARK ALL NOTIFICATIONS AS READ
    if(path === 'notifications/read-all'){
      const currentUser = await getCurrentUser(request);
      const result = await db.collection('notifications').updateMany(
            {"userId": currentUser.id},
            {"$set": {"read": true}}
        )
        return Response.json({"message": "All notifications marked as read"});
    }

    // GET NOTIFICATIONS
    if (path === 'notifications') {
      const currentUser = await getCurrentUser(request);
      if (!currentUser) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      let notifications;
        notifications = await db.collection('notifications')
          .find({ userId: currentUser.id })
          .sort({ createdAt: -1 })
          .limit(50)
          .toArray();
      // }

      return Response.json(notifications, { status: 200 });
    }

    // ADMIN: GET PENDING USERS
    if (path === 'admin/pending-users') {
      const currentUser = await getCurrentUser(request);
      if (!currentUser || currentUser.role !== 'ADMIN') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const pendingUsers = await db.collection('users')
        .find({ status: 'PENDING' }, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .toArray();

      return Response.json(pendingUsers, { status: 200 });
    }

    // ADMIN: GET ALL USERS
    if (path === 'admin/users') {
      const currentUser = await getCurrentUser(request);
      if (!currentUser || currentUser.role !== 'ADMIN') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const users = await db.collection('users')
        .find({}, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .toArray();

      return Response.json(users, { status: 200 });
    }

    // ADMIN: GET ANALYTICS
    if(path === 'admin/analytics'){
      const totalUsers = await db.collection('users').countDocuments({});
      const totalJobRequests = await db.collection('jobRequests').countDocuments({});
      const totalJobOpenings = await db.collection('jobOpenings').countDocuments({});

     // const users = await db.collection('users').find({},{projection :{'fullName':1,'email':1,'lastLoggedIn':1,'role':1}}).sort({lastLoggedIn:-1}).toArray();

      return Response.json({
        totalUsers,
        totalJobOpenings,
        totalJobRequests
      }, {status : 200});
      // return Response.json({"message":"Success"},{status:200})
    }

    // if(path === 'messages'){
    //     const room = searchParams.get("room");
    //   try {
    //     let messages = await db
    //       .collection("messages")
    //       .find({ room })
    //       .project({ _id: 0 })
    //       .limit(1000)
    //       .toArray();
    //     // Convert timestamp strings → Date instances
    //     messages = messages.map((msg) => {
    //       if (typeof msg.timestamp === "string") {
    //         msg.timestamp = new Date(msg.timestamp);
    //       }
    //       return msg;
    //     });

    //     // Sort by timestamp
    //     messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    //    // console.log(messages);

    //     return Response.json(messages);
    //   } catch (error) {
    //     console.error(error);
    //     return new Response("Failed to fetch messages", { status: 500 });
    //   }
    // }


    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    const body = await request.json();
    const client = await connectToDatabase();
    const db = client.db(dbName);

    // UPDATE PROFILE
    if (path === 'profile') {
      const currentUser = await getCurrentUser(request);
      if (!currentUser) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { fullName, linkedinProfile, techStack, bio } = body;
      const updates = {};
      if (fullName) updates.fullName = fullName;
      if (linkedinProfile !== undefined) updates.linkedinProfile = linkedinProfile;
      if (techStack) updates.techStack = techStack;
      if (bio !== undefined) updates.bio = bio;

      await db.collection('users').updateOne(
        { id: currentUser.id },
        { $set: updates }
      );

      return Response.json({ message: 'Profile updated' }, { status: 200 });
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    const { searchParams } = new URL(request.url);
    const client = await connectToDatabase();
    const db = client.db(dbName);

    //DELETE JOB REQUEST
    if(path === 'job-requests'){
      const currentUser = await getCurrentUser(request);
      if (!currentUser) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const job_id = searchParams.get("job_id");
      const status = await deleteJobRequest(job_id);
      if(status === "success")
      return Response.json({message: "Job reqeust post deleted"}, {status:200});
    else Response.json({"message" : "Failed to delete the Job"},{status:400});
    }

    //DELETE JOB OPENING
    if(path === 'job-openings'){
      const currentUser = await getCurrentUser(request);
      if (!currentUser) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const job_id = searchParams.get("job_id");
      const status = await deleteJobOpening(job_id);
      if(status === "success")
      return Response.json({message: "Job Opening post deleted"}, {status:200});
    else return Response.json({"message" : "Failed to delete the Job"},{status:400});
    }

    // ADMIN: DELETE USER
    if (path === 'admin/users') {
      const currentUser = await getCurrentUser(request);
      if (!currentUser) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const userId = searchParams.get('id');
      await db.collection('users').deleteOne({ id: userId });
      await db.collection('notifications').deleteMany({ userId });

      return Response.json({ message: 'User deleted' }, { status: 200 });
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

