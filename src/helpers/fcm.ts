import { getMessaging } from 'firebase-admin/messaging';

// Send push notification (one device)
export const fcmSend = async (data: { title: string, body: string, token: string }) => {
  const { title, body, token } = data;

  try {
    await getMessaging().send({ notification: { title, body }, token });
  } catch (error) {
    console.log(error);
  }
};