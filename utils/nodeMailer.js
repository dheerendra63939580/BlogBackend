const nodemailer = require("nodemailer");
const authEmail = process.env.NODE_MAILER_AUTH_EMAIL;
const authPass = process.env.NODE_MAILER_AUTH_PASSWORD;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: authEmail,
        pass: authPass,
    }
});

const sendEmailVerificationToken = async (userEmail, verificationToken) => {
    console.log(authEmail, authPass)
    try {
        const mailOption = {
            from: `Blog <${authEmail}>`,
            to: userEmail,
            subject: "Verify Your Email Address",
            text: `Hello,
    
            Thank you for registering. Please verify your email by clicking the link below:
    
            http://localhost:3000/api/v1/user/verify-email/${verificationToken}
    
            If you did not request this, please ignore this email.
    
            Best regards,
            Blog`,
            html: `
            <p>Hello,</p>
            <p>Thank you for registering. Please verify your email by clicking the link below:</p>
            <p><a href="http://localhost:3000/api/v1/user/verify-email/${verificationToken}" target="_blank">Verify Email</a></p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>Blog</p>
            `
        }
        const info = await transporter.sendMail(mailOption);
        return {
            success: true,
            message: info?.messageId || "Mail send successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error?.message || "Failed to send email for verification"
        }
    }

}

module.exports = { sendEmailVerificationToken }