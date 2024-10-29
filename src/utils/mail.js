const nodemailer = require('nodemailer');
require('dotenv').config(); // To load environment variables from a .env file

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // SMTP server host
  port: process.env.SMTP_PORT || 587, // SMTP port (587 for secure, 25 for non-secure)
  secure: process.env.SMTP_SECURE === 'true', // True for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,      // Your SMTP username (e.g., email)
    pass: process.env.SMTP_PASSWORD,  // Your SMTP password
  },
});

/**
 * Send an email using SMTP
 * @param {String} to - Recipient email address
 * @param {String} subject - Email subject
 * @param {String} html - HTML body of the email (can be plain text or HTML content)
 */
async function sendMail(to, subject, html) {
  const mailOptions = {
    from: process.env.SMTP_USER, // Sender address (from .env or configured email)
    to,                          // List of receivers
    subject,                     // Subject line
    html,                        // HTML body content (use 'text' for plain text emails)
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    return { success: false, error };
  }
}

module.exports = { sendMail };
