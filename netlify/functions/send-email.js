const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
        };
    }

    try {
        const { to, code, reference } = JSON.parse(event.body);

        // Create transporter using Bank Cramer SMTP
        const transporter = nodemailer.createTransport({
            host: 'bankcramer.com',
            port: 587,
            secure: false,
            auth: {
                user: 'info@bankcramer.com',
                pass: process.env.EMAIL_PASSWORD // Environment variable
            }
        });

        // Email content
        const mailOptions = {
            from: '"Bank Cramer" <info@bankcramer.com>',
            to: to,
            subject: 'Your Verification Code - Bank Cramer',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a2a6c; text-align: center;">Bank Cramer Verification</h2>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong>Reference Number:</strong> ${reference}</p>
                        <p style="margin: 10px 0;"><strong>Verification Code:</strong> 
                            <span style="font-size: 24px; color: #3498db; font-weight: bold;">${code}</span>
                        </p>
                    </div>
                    <p style="color: #7f8c8d; font-size: 14px;">
                        This code will expire in 15 minutes.<br>
                        If you didn't request this code, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="color: #7f8c8d; font-size: 12px; text-align: center;">
                        Best regards,<br>
                        <strong>Bank Cramer Team</strong><br>
                        info@bankcramer.com
                    </p>
                </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                message: 'Verification code sent successfully' 
            })
        };

    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'Failed to send email: ' + error.message 
            })
        };
    }
};
