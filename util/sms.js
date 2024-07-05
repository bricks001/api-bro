import axios from 'axios';

// Brevo SMS API URL
const apiUrl = 'https://api.brevo.com/v3/transactionalSMS/sms';

// Your API Key
const apiKey = 'null';

// Function to send SMS
export async function sendSms(to, from, text, tag, type, callback) {
  const data = {
    sender: from,
    recipient: to,
    content: text,
    type: type,
    tag: tag,
    callbackUrl: callback,
  };

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });
    console.log('SMS Sent Successfully:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error sending SMS:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Example usage
// sendSms(
//   '33XXXXXXXXXX',      // Recipient phone number
//   'ObjLoad',           // Sender name or number (alphanumeric, max 11 chars)
//   'Your message here', // SMS content (up to 160 characters per SMS)
//   'YourTag',           // Optional tag for your SMS
//   'transactional',     // Type of SMS: 'transactional' or 'marketing'
//   'http://callbackurl.com/' // Optional callback URL
// );
