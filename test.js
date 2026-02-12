// minimal-test.js
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');
require('dotenv').config();

async function minimalTest() {
    console.log('🚀 MINIMAL MAILERSEND TEST');
    console.log('==========================\n');
    
    // Hardcode the values to eliminate .env issues
    const MAILERSEND_API_KEY = process.env.MAILERSEND_API_KEY
    const SENDER_EMAIL = process.env.SENDER_EMAIL
    const RECIPIENT_EMAIL = 'etoyskir03@gmail.com';
    
    console.log('📋 Test Configuration:');
    console.log(`   API Key: ${MAILERSEND_API_KEY.substring(0, 15)}...`);
    console.log(`   Sender: ${SENDER_EMAIL}`);
    console.log(`   Recipient: ${RECIPIENT_EMAIL}`);
    console.log('');
    
    try {
        // Initialize MailerSend
        const mailersend = new MailerSend({
            apiKey: MAILERSEND_API_KEY
        });
        
        console.log('✅ MailerSend initialized');
        console.log('');
        
        // Create email parameters
        const sentFrom = new Sender(SENDER_EMAIL, 'Test App');
        const recipients = [new Recipient(RECIPIENT_EMAIL, 'Test User')];
        
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject('Test Email ' + new Date().toLocaleTimeString())
            .setHtml('<h1>Test</h1><p>This is a test email.</p>')
            .setText('This is a test email.');
        
        console.log('📧 Sending email...');
        console.log('');
        
        // Send email
        const response = await mailersend.email.send(emailParams);
        
        console.log('✅✅✅ EMAIL SENT SUCCESSFULLY! 🎉');
        console.log('Response:', JSON.stringify(response, null, 2));
        
    } catch (error) {
        console.log('❌❌❌ ERROR OCCURRED');
        console.log('=====================\n');
        
        // Log EVERYTHING about the error
        console.log('🔍 Full error object:');
        console.log('---------------------');
        console.log('Constructor name:', error.constructor.name);
        console.log('Is Error?', error instanceof Error);
        console.log('Has message?', 'message' in error);
        console.log('Has statusCode?', 'statusCode' in error);
        console.log('Has response?', 'response' in error);
        console.log('');
        
        console.log('📊 Error properties:');
        console.log('-------------------');
        for (const prop of Object.getOwnPropertyNames(error)) {
            try {
                console.log(`   ${prop}:`, error[prop]);
            } catch (e) {
                console.log(`   ${prop}: [Unable to stringify]`);
            }
        }
        console.log('');
        
        console.log('📋 Stringified error:');
        console.log('--------------------');
        try {
            console.log(JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        } catch (e) {
            console.log('Cannot stringify error:', e.message);
        }
        console.log('');
        
        // Check if it's a 422 error
        if (error.statusCode === 422 || error.response?.status === 422) {
            console.log('📌 This is a 422 error - API key and domain are working!');
            console.log('   The issue is with the email content or recipient.');
        }
        
        // Check the request that was sent
        if (error.config) {
            console.log('\n📤 Request that caused the error:');
            console.log('   URL:', error.config.url);
            console.log('   Method:', error.config.method);
            console.log('   Data:', error.config.data);
        }
    }
}

minimalTest();