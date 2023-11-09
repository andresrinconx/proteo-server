import axios from 'axios';

/**
 * Send whatsApp message (one device).
 */
export const whatsAppSend = async (message: string, phone: string) => {
  // validations
  phone = phone.replace(/[() .,;-]/g, '');
  phone = phone.split('/')[0];
  phone = phone.replace(/[a-zA-Z]/g, '');

  if (phone.length === 11) {
    try {
      // send message
      await axios.request({
        method: 'POST',
        url: process.env.WHATSAPP_API_URL,
        data: {
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { body: message},
        },
        headers: { 
          'Content-Type': 'application/json' 
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
};