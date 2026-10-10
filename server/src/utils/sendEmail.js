import nodemailer from "nodemailer";

const isEmailConfigured = () =>
    Boolean(
        process.env.SMTP_HOST &&
            process.env.SMTP_USER &&
            process.env.SMTP_PASS
    );

const getTransporter = () =>
    nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

export const sendVerificationEmail = async (email, token) => {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const verifyUrl = `${clientUrl}/#/verify-email/${token}`;

    if (!isEmailConfigured()) {
        console.log("\n--- Email verification (SMTP not configured) ---");
        console.log(`To: ${email}`);
        console.log(`Verify: ${verifyUrl}`);
        console.log("------------------------------------------------\n");
        return;
    }

    const transporter = getTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
        from: `"Prep Ninja" <${from}>`,
        to: email,
        subject: "Verify your Prep Ninja account",
        html: `
            <h2>Welcome to Prep Ninja</h2>
            <p>Click the link below to verify your email address:</p>
            <a href="${verifyUrl}">${verifyUrl}</a>
            <p>This link expires in 24 hours.</p>
            <p>If you did not create an account, you can ignore this email.</p>
        `,
    });
};

export const sendPasswordResetEmail = async (email, token) => {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const resetUrl = `${clientUrl}/#/reset-password/${token}`;

    if (!isEmailConfigured()) {
        console.log("\n--- Password reset (SMTP not configured) ---");
        console.log(`To: ${email}`);
        console.log(`Reset: ${resetUrl}`);
        console.log("----------------------------------------------\n");
        return;
    }

    const transporter = getTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
        from: `"Prep Ninja" <${from}>`,
        to: email,
        subject: "Reset your Prep Ninja password",
        html: `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link expires in 24 hours.</p>
            <p>If you did not request this, you can ignore this email.</p>
        `,
    });
};
