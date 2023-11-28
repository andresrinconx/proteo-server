import { messaging } from 'firebase-admin';

interface Message {
  title: string;
  body: string;
  token: string;
}

/**
 * Send push notification (one device).
 */
export const fcmSend = async (data: Message): Promise<void> => {
  const { title, body, token } = data;

  try {
    await messaging().send({ 
      token,
      notification: { 
        title, 
        body 
      }
    });
  } catch (error) {
    console.log(error);
  }
};