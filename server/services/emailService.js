import nodemailer from "nodemailer";

export async function sendJobApplicationNotification({ job, application }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_NOTIFICATION_EMAIL, ADMIN_EMAIL } = process.env;
  const recipientEmail = ADMIN_NOTIFICATION_EMAIL || ADMIN_EMAIL;

  if (!SMTP_HOST || !SMTP_USER || !recipientEmail) {
    console.log(
      `[emailService] SMTP settings not fully configured (SMTP_HOST: ${SMTP_HOST || "none"}). ` +
      `Skipping actual email dispatch for application from "${application.name}" (${application.email}) for job "${job.title}".`
    );
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || "587", 10),
      secure: parseInt(SMTP_PORT || "587", 10) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Emmbros Careers" <${SMTP_USER}>`,
      to: recipientEmail,
      subject: `[New Job Application] ${application.name} applied for "${job.title}"`,
      text: `New job application received!\n\n` +
        `Position: ${job.title} (${job.department})\n` +
        `Applicant Name: ${application.name}\n` +
        `Email: ${application.email}\n` +
        `Phone: ${application.phone}\n` +
        `Cover Note: ${application.coverNote || "N/A"}\n` +
        `Resume URL: ${application.resume?.url || "N/A"}\n\n` +
        `View application in Admin Panel: /admin/jobs/${job._id}/applications`,
      html: `
        <h2>New Job Application Received</h2>
        <p><strong>Position:</strong> ${job.title} (${job.department})</p>
        <p><strong>Applicant Name:</strong> ${application.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${application.email}">${application.email}</a></p>
        <p><strong>Phone:</strong> ${application.phone}</p>
        <p><strong>Cover Note:</strong> ${application.coverNote ? application.coverNote.replace(/\n/g, "<br>") : "<em>None provided</em>"}</p>
        <p><strong>Resume:</strong> <a href="${application.resume?.url}" target="_blank">View Resume (${application.resume?.filename})</a></p>
        <hr/>
        <p><small>Sent automatically from Emmbros Careers Platform.</small></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[emailService] Application notification email sent to ${recipientEmail}: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`[emailService] Failed to send application email notification:`, err.message);
    return false;
  }
}
