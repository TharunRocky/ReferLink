import { messaging, getToken } from "@/lib/firebase/firebase";

export const useFcmToken = () => {
  const generateToken = async () => {
    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        alert("Permission denied for notifications");
        return null;
      }

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });

      console.log("FCM Token:", token);
      return token;
    } catch (error) {
      console.error("Error getting FCM token", error);
      return null;
    }
  };

  return { generateToken };
};