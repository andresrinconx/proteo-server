import axios from 'axios';

interface Message {
  title: string;
  body: string;
  phone: string;
}

/**
 * Send WhatsApp message (one device).
 */
export const whatsAppSend = async (data: Message): Promise<void> => {
  // let phone = data.phone;
  let phone = '04149769740';
  const message = `*(PRUEBA) ${data.title}.* 
${data.body}.`;
  
  phone = phone.replace(/[() .,;-]/g, '');
  phone = phone.split('/')[0];
  phone = phone.replace(/[a-zA-Z]/g, '');

  if (phone.length === 11) {
    try {
      await axios.request({
        method: 'POST',
        url: process.env.WHATSAPP_API_URL,
        data: {
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { body: message },
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