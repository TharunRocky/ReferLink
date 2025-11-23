const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'job_referral_platform';

async function seed() {
  console.log('🌱 Starting MongoDB seed...\n');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db(dbName);
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('jobOpenings').deleteMany({});
    await db.collection('jobRequests').deleteMany({});
    await db.collection('referralRequests').deleteMany({});
    await db.collection('notifications').deleteMany({});
    console.log('✅ Cleared existing data\n');
    
    // Hash password for all users (password: admin123)
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Create Admin User
    console.log('👑 Creating Admin User...');
    const adminId = uuidv4();
    await db.collection('users').insertOne({
      id: adminId,
      fullName: 'Admin User',
      email: 'admin@referlink.com',
      password: hashedPassword,
      linkedinProfile: '',
      techStack: 'Platform Administrator',
      bio: 'System administrator managing the ReferLink platform',
      role: 'ADMIN',
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
    });
    console.log('✅ Admin created: admin@referlink.com / admin123\n');
    
    // Create Approved Users
    console.log('👥 Creating Approved Users...');
    const approvedUsers = [
      {
        id: uuidv4(),
        fullName: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: hashedPassword,
        linkedinProfile: 'https://linkedin.com/in/sarahjohnson',
        techStack: 'Full Stack Developer - React, Node.js, MongoDB',
        bio: 'Senior full-stack developer with 5+ years of experience. Passionate about building scalable applications.',
        role: 'USER',
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        fullName: 'Michael Chen',
        email: 'michael@example.com',
        password: hashedPassword,
        linkedinProfile: 'https://linkedin.com/in/michaelchen',
        techStack: 'Frontend Developer - React, TypeScript, Next.js',
        bio: 'Frontend specialist focused on creating beautiful and performant user interfaces.',
        role: 'USER',
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        fullName: 'Emily Davis',
        email: 'emily@example.com',
        password: hashedPassword,
        linkedinProfile: 'https://linkedin.com/in/emilydavis',
        techStack: 'Backend Developer - Python, Django, PostgreSQL',
        bio: 'Backend engineer with expertise in API design and database optimization.',
        role: 'USER',
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        fullName: 'David Wilson',
        email: 'david@example.com',
        password: hashedPassword,
        linkedinProfile: 'https://linkedin.com/in/davidwilson',
        techStack: 'DevOps Engineer - AWS, Docker, Kubernetes',
        bio: 'DevOps professional specializing in cloud infrastructure and CI/CD pipelines.',
        role: 'USER',
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
      },
    ];
    
    await db.collection('users').insertMany(approvedUsers);
    console.log(`✅ Created ${approvedUsers.length} approved users\n`);
    
    // Create Pending Users (waiting for approval)
    console.log('⏳ Creating Pending Users...');
    const pendingUsers = [
      {
        id: uuidv4(),
        fullName: 'John Smith',
        email: 'john@example.com',
        password: hashedPassword,
        linkedinProfile: 'https://linkedin.com/in/johnsmith',
        techStack: 'Software Engineer - Java, Spring Boot',
        bio: 'Looking to connect with other professionals in the tech industry.',
        role: 'USER',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        fullName: 'Lisa Anderson',
        email: 'lisa@example.com',
        password: hashedPassword,
        linkedinProfile: 'https://linkedin.com/in/lisaanderson',
        techStack: 'Data Scientist - Python, Machine Learning',
        bio: 'Data scientist interested in AI and machine learning opportunities.',
        role: 'USER',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
    ];
    
    await db.collection('users').insertMany(pendingUsers);
    console.log(`✅ Created ${pendingUsers.length} pending users\n`);
    
    // Create notifications for admin about pending users
    const pendingNotifications = pendingUsers.map(user => ({
      id: uuidv4(),
      userId: 'ADMIN',
      message: `New join request from ${user.fullName}`,
      type: 'JOIN_REQUEST',
      relatedId: user.id,
      read: false,
      createdAt: new Date().toISOString(),
    }));
    
    await db.collection('notifications').insertMany(pendingNotifications);
    
    // Create Job Openings
    console.log('💼 Creating Job Openings...');
    const jobOpenings = [
      {
        id: uuidv4(),
        userId: approvedUsers[0].id,
        userFullName: approvedUsers[0].fullName,
        userLinkedIn: approvedUsers[0].linkedinProfile,
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        techStack: 'React, Node.js, TypeScript, AWS',
        description: 'We are looking for an experienced full-stack developer to join our growing team. You will work on building scalable web applications using modern technologies.',
        location: 'Remote',
        experienceLevel: 'SENIOR',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        userId: approvedUsers[1].id,
        userFullName: approvedUsers[1].fullName,
        userLinkedIn: approvedUsers[1].linkedinProfile,
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        techStack: 'React, Next.js, Tailwind CSS',
        description: 'Join our startup as a frontend developer. Build beautiful and responsive user interfaces for our SaaS platform.',
        location: 'San Francisco, CA',
        experienceLevel: 'MID',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        userId: approvedUsers[2].id,
        userFullName: approvedUsers[2].fullName,
        userLinkedIn: approvedUsers[2].linkedinProfile,
        title: 'Backend Engineer',
        company: 'DataFlow Solutions',
        techStack: 'Python, Django, PostgreSQL, Redis',
        description: 'We need a backend engineer to help us scale our data processing pipeline. Experience with distributed systems is a plus.',
        location: 'New York, NY',
        experienceLevel: 'SENIOR',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        userId: approvedUsers[3].id,
        userFullName: approvedUsers[3].fullName,
        userLinkedIn: approvedUsers[3].linkedinProfile,
        title: 'DevOps Engineer',
        company: 'CloudNative Corp',
        techStack: 'AWS, Kubernetes, Terraform, CI/CD',
        description: 'Looking for a DevOps engineer to manage our cloud infrastructure and implement best practices for deployment.',
        location: 'Remote',
        experienceLevel: 'MID',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
      },
    ];
    
    await db.collection('jobOpenings').insertMany(jobOpenings);
    console.log(`✅ Created ${jobOpenings.length} job openings\n`);
    
    // Create Job Requests
    console.log('🔍 Creating Job Requests...');
    const jobRequests = [
      {
        id: uuidv4(),
        userId: approvedUsers[0].id,
        userFullName: approvedUsers[0].fullName,
        title: 'Tech Lead Position',
        company: 'Google',
        techStack: 'System Design, Leadership, Microservices',
        description: 'Looking for tech lead opportunities at top tech companies. 8+ years of experience.',
        urgency: 'NORMAL',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        userId: approvedUsers[1].id,
        userFullName: approvedUsers[1].fullName,
        title: 'Senior Frontend Developer',
        company: 'Meta',
        techStack: 'React, GraphQL, Performance Optimization',
        description: 'Seeking senior frontend roles at FAANG companies. Strong React and performance expertise.',
        urgency: 'HIGH',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
    ];
    
    await db.collection('jobRequests').insertMany(jobRequests);
    console.log(`✅ Created ${jobRequests.length} job requests\n`);
    
    // Create some notifications for users
    console.log('🔔 Creating Notifications...');
    const notifications = [
      {
        id: uuidv4(),
        userId: approvedUsers[0].id,
        message: `New job opening: ${jobOpenings[1].title} at ${jobOpenings[1].company}`,
        type: 'JOB_OPENING',
        relatedId: jobOpenings[1].id,
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        userId: approvedUsers[1].id,
        message: `New job opening: ${jobOpenings[0].title} at ${jobOpenings[0].company}`,
        type: 'JOB_OPENING',
        relatedId: jobOpenings[0].id,
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        userId: approvedUsers[2].id,
        message: `New job opening: ${jobOpenings[3].title} at ${jobOpenings[3].company}`,
        type: 'JOB_OPENING',
        relatedId: jobOpenings[3].id,
        read: true,
        createdAt: new Date().toISOString(),
      },
    ];
    
    await db.collection('notifications').insertMany(notifications);
    console.log(`✅ Created ${notifications.length} notifications\n`);
    
    // Print Summary
    console.log('════════════════════════════════════════════════════════');
    console.log('🎉 Seed completed successfully!\n');
    console.log('📊 DATABASE SUMMARY:');
    console.log(`   Database: ${dbName}`);
    console.log(`   Users: ${approvedUsers.length + pendingUsers.length + 1}`);
    console.log(`   Job Openings: ${jobOpenings.length}`);
    console.log(`   Job Requests: ${jobRequests.length}`);
    console.log(`   Notifications: ${notifications.length + pendingNotifications.length}\n`);
    
    console.log('👤 TEST ACCOUNTS (password for all: admin123):');
    console.log('════════════════════════════════════════════════════════');
    console.log('\n🔑 ADMIN ACCOUNT:');
    console.log('   Email: admin@referlink.com');
    console.log('   Role: Admin');
    console.log('   Status: Approved');
    console.log('   Features: Approve/reject users, view all data\n');
    
    console.log('✅ APPROVED USERS:');
    approvedUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email}`);
      console.log(`      Name: ${user.fullName}`);
      console.log(`      Stack: ${user.techStack}`);
    });
    
    console.log('\n⏳ PENDING USERS (waiting for approval):');
    pendingUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email}`);
      console.log(`      Name: ${user.fullName}`);
      console.log(`      Stack: ${user.techStack}`);
    });
    
    console.log('\n════════════════════════════════════════════════════════');
    console.log('🚀 READY TO TEST!');
    console.log('════════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔒 Connection closed\n');
    process.exit(0);
  }
}

// Run the seed function
seed();
