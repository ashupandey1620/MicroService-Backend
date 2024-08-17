import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER as string;

const client = twilio(accountSid, authToken);

export async function sendSms(to: string, body: string): Promise<void> {
    try {
        await client.messages.create({
            body,
            from: twilioPhoneNumber,
            to,
        });
        console.log(`Message sent to ${to}`);
    } catch (error) {
        console.error(`Error sending SMS: ${error}`);
    }
}
