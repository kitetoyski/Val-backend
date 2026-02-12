// server.js
const express = require('express');
const cors = require('cors');
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Your working configuration from the test
const MAILERSEND_API_KEY = process.env.MAILERSEND_API_KEY
const VERIFIED_SENDER = process.env.SENDER_EMAIL
const SENDER_NAME = 'Kirsten Eules Ramos';

const mailersend = new MailerSend({
    apiKey: MAILERSEND_API_KEY
});

// Send email endpoint
app.post('/api/send-email', async (req, res) => {
    try {
        const { to, subject, message, name } = req.body;
        
        if (!to || !subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: to, subject, message'
            });
        }

        console.log('📧 Sending email...');
        console.log('From:', VERIFIED_SENDER);
        console.log('To:', to);
        console.log('Subject:', subject);

        const sentFrom = new Sender(VERIFIED_SENDER, SENDER_NAME);
        const recipients = [new Recipient(to, name || 'Recipient')];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject(subject)
            .setHtml(`
        <div style="font-family: 'Arial', sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background: #fff0f3; border-radius: 30px; text-align: center; border: 3px solid #ffb6c1;">
            
            <!-- Hearts -->
            <div style="font-size: 50px; margin-bottom: 10px;">
                ❤️ 🌹 ❤️
            </div>
            
            <!-- Main Message -->
            <h1 style="color: #d43f4a; font-size: 48px; margin: 20px 0; font-weight: bold; text-shadow: 2px 2px 0 #ffe4e1;">
                Happy Valentine's Day!
            </h1>
            
            <!-- Sweet Message -->
            <div style="background: white; padding: 30px; border-radius: 100px 100px 100px 0; margin: 30px 0; box-shadow: 0 5px 15px rgba(212,63,74,0.2);">
                <p style="font-size: 36px; color: #d43f4a; margin: 0 0 15px 0;">
                    🥂
                </p>
                <p style="font-size: 32px; color: #2c3e50; margin: 10px 0; font-weight: bold;">
                    See you tomorrow ❤️
                </p>
                <p style="font-size: 24px; color: #e67e22; margin: 15px 0 0 0;">
                    ✨
                </p>
            </div>
            
            <!-- Simple Details -->
            <div style="background: rgba(255,255,255,0.5); padding: 20px; border-radius: 20px; margin: 20px 0;">
                <p style="font-size: 22px; color: #555; margin: 10px 0;">
                     February 13 • 10:30 PM
                </p>
                <p style="font-size: 22px; color: #555; margin: 10px 0;">
                    📍 Ruby Wong's Godown
                </p>
            </div>
            
            <!-- Footer -->
            <div style="margin-top: 30px;">
                <div style="font-size: 40px; margin-bottom: 10px;">
                    💕 💕 💕
                </div>
                <p style="color: #d43f4a; font-size: 24px; margin: 20px 0 0 0; font-style: italic;">
                    I love you!
                </p>
                <p style="color: #e67e22; font-size: 18px; margin: 10px 0;">
                    Can't wait to see you! 🌹
                </p>
            </div>
            
        </div>
    `)
    .setText('Happy Valentine\'s Day! See you tomorrow at La Belle Table at 7pm. xoxo ❤️');

        const response = await mailersend.email.send(emailParams);
        
        console.log('✅ Email sent successfully!');
        res.status(200).json({
            success: true,
            message: 'Email sent successfully!'
        });

    } catch (error) {
        console.error('❌ Error sending email:', error.body?.message || error.message);
        res.status(500).json({
            success: false,
            error: error.body?.message || 'Failed to send email'
        });
    }
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        sender: VERIFIED_SENDER
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Sender email: ${VERIFIED_SENDER}`);
    console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
});