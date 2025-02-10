import nodemailer from "nodemailer";
export const sendResetEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.NEXT_PUBLIC_API_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: `"TaskApp" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Your Password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 5 minutes.</p>`,
    });
};
