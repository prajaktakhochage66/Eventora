const dotenv = require('dotenv');

dotenv.config();

// Helper function to send emails via Brevo's HTTP API
const sendEmailViaBrevo = async (toEmail, subject, htmlContent) => {
    const url = 'https://api.brevo.com/v3/smtp/email';
    const options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
            sender: { email: process.env.BREVO_SENDER_EMAIL, name: 'Eventora' },
            to: [{ email: toEmail }],
            subject: subject,
            htmlContent: htmlContent
        })
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.text();
        console.error('Brevo API Error:', errorData);
        throw new Error('Email sending failed at API level');
    }
};

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Hi ${userName}!</h2>
            <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
            <p>Thank you for choosing Eventora.</p>
        </div>
      `;
        await sendEmailViaBrevo(userEmail, `Booking Confirmed: ${eventTitle}`, html);
        console.log('Email sent successfully to', userEmail);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send booking confirmation email');
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title = type === 'account_verification' ? 'Verify your Eventora Account' : 'Eventora Booking Verification';
        const msg = type === 'account_verification'
            ? 'Please use the following OTP to verify your new Eventora account.'
            : 'Please use the following OTP to verify and confirm your event booking.';

        const html = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h2 style="color: #111;">${title}</h2>
                <p style="color: #555; font-size: 16px;">${msg}</p>
                <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                    ${otp}
                </div>
                <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
            </div>
        `;
        await sendEmailViaBrevo(userEmail, title, html);
        console.log(`OTP sent to ${userEmail} for ${type}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };