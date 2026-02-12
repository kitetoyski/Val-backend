// api/send-email.js
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { to, subject, message, name } = req.body;
        
        const mailersend = new MailerSend({
            apiKey: process.env.MAILERSEND_API_KEY
        });

        const sentFrom = new Sender(
            process.env.VERIFIED_SENDER_EMAIL,
            process.env.VERIFIED_SENDER_NAME || 'My App'
        );
        
        const recipients = [new Recipient(to, name || 'Recipient')];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject(subject)
            .setHtml(`
                <div style="font-family: 'Garamond', 'Georgia', serif; max-width: 550px; margin: 0 auto; padding: 45px; background: #fffcf9; border-radius: 20px; border: 1px solid #e2d0c5;">
                    <div style="text-align: center;">
                        <div style="width: 80px; height: 80px; background: #fef3f0; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 45px; color: #a65e5e;">🌹</span>
                        </div>
                        <h1 style="color: #4d3b3b; font-size: 30px; margin: 0; font-weight: 400; letter-spacing: 3px;">Valentine's Day</h1>
                        <p style="color: #a65e5e; font-size: 20px; margin: 10px 0 0; font-style: italic;">February the fourteenth</p>
                    </div>
                    
                    <div style="margin: 40px 0 35px; text-align: center;">
                        <div style="background: linear-gradient(to right, #fcf5f3, #ffffff, #fcf5f3); padding: 30px 20px;">
                            <p style="font-size: 34px; color: #6b3a3a; margin: 0; font-family: 'Georgia', serif; font-style: italic;">
                                Happy Valentine's Day
                            </p>
                            <p style="font-size: 28px; color: #8b5a5a; margin: 15px 0 0; font-family: 'Georgia', serif; border-top: 1px solid #eedad5; border-bottom: 1px solid #eedad5; padding: 15px 0; display: inline-block;">
                                see you tomorrow
                            </p>
                        </div>
                    </div>
                    
                    <div style="background: #fbf1ef; padding: 25px; border-radius: 8px; margin: 30px 0;">
                        <p style="margin: 0; color: #6b4e4e; font-size: 18px; text-align: center; font-style: italic;">
                            "A table for two has been reserved in your name."
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin: 35px 0 20px;">
                        <p style="color: #6b3a3a; font-size: 17px; margin: 8px 0; letter-spacing: 2px;">
                            ✦ SEVEN O'CLOCK ✦
                        </p>
                        <p style="color: #8b5a5a; font-size: 19px; margin: 15px 0; font-family: 'Georgia', serif;">
                            La Belle Table
                        </p>
                        <p style="color: #9b7a7a; font-size: 15px; margin: 5px 0;">
                            the corner table • candles lit
                        </p>
                    </div>
                    
                    <div style="margin-top: 45px; padding-top: 25px; border-top: 1px solid #eedad5; text-align: center;">
                        <p style="color: #6b3a3a; font-size: 19px; margin: 0 0 5px; font-style: italic;">
                            With love and anticipation,
                        </p>
                        <p style="color: #8b5a5a; font-size: 18px; margin: 10px 0 0;">
                            ❤️
                        </p>
                    </div>
                </div>
            `)
            .setText(`Happy Valentine's Day. See you tomorrow at La Belle Table, seven o'clock. A table for two awaits. With love, ❤️`);

        await mailersend.email.send(emailParams);
        
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.body?.message || error.message 
        });
    }
}