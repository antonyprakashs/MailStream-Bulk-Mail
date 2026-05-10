const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const xlsx = require('xlsx');
const Email = require('../models/Email');

const router = express.Router();

// Set up multer for file upload (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Transport for real email sending via environment variables (e.g., Gmail)
let realTransporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  realTransporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email provider (e.g., 'gmail', 'hotmail')
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log('Real email transporter configured using environment variables.');
}

// Fallback to Mock Ethereal Account for testing if no real credentials are provided
let dynamicTransporter;
if (!realTransporter) {
  nodemailer.createTestAccount((err, account) => {
      if (err) {
          console.error('Failed to create a testing account. ' + err.message);
          return;
      }
      console.log('Ethereal Test account created for testing. Emails will not go to real inboxes.');
      console.log(`User: ${account.user}`);
      console.log(`Pass: ${account.pass}`);

      dynamicTransporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
              user: account.user,
              pass: account.pass
          }
      });
  });
}

// Helper function to validate email
const isValidEmail = (email) => {
  return typeof email === 'string' && email.trim() !== '' && email.includes('@');
};

// Send bulk emails
router.post('/send', upload.single('file'), async (req, res) => {
  const { subject, body } = req.body;
  let manualRecipients = [];

  // Parse manual recipients if provided
  if (req.body.recipients) {
    try {
      // It might come as a string if sent via FormData
      const parsed = JSON.parse(req.body.recipients);
      if (Array.isArray(parsed)) {
        manualRecipients = parsed;
      }
    } catch (e) {
      // If it's not JSON, maybe it's just a comma-separated string
      manualRecipients = req.body.recipients.split(',').map(e => e.trim()).filter(e => e !== '');
    }
  }

  let fileRecipients = [];

  // Process Excel file if provided
  if (req.file) {
    try {
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // read as array of arrays

      // Extract all valid emails from the first sheet
      for (const row of data) {
        for (const cell of row) {
          if (isValidEmail(cell)) {
            fileRecipients.push(cell.trim());
          }
        }
      }
    } catch (error) {
      console.error('Error processing Excel file:', error);
      return res.status(400).json({ message: 'Error parsing Excel file. Ensure it is a valid .xlsx or .xls format.' });
    }
  }

  // Combine and deduplicate recipients
  const allRecipients = [...new Set([...manualRecipients, ...fileRecipients])].filter(isValidEmail);

  if (!subject || !body || allRecipients.length === 0) {
    return res.status(400).json({ message: 'Please provide subject, body, and at least one valid recipient (via input or file).' });
  }

  const activeTransporter = realTransporter || dynamicTransporter;
  const senderEmail = process.env.EMAIL_USER || 'admin@bulkmail.local';

  try {
    // Send mail to the array of recipients
    const info = await activeTransporter.sendMail({
      from: `"Bulk Mail App" <${senderEmail}>`,
      to: allRecipients.join(', '), // Nodemailer allows comma separated list for 'to' or bcc
      subject: subject,
      text: body,
      html: `<p>${body}</p>`, 
    });

    console.log('Message sent: %s', info.messageId);
    
    // Only get preview URL if we're using Ethereal (dynamicTransporter)
    let previewUrl = null;
    if (!realTransporter) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Preview URL: %s', previewUrl);
    }

    // Save to database
    const newEmail = new Email({
      subject,
      body,
      recipients: allRecipients,
      status: 'Success'
    });

    await newEmail.save();

    res.status(200).json({
      message: 'Emails sent successfully',
      previewUrl: previewUrl,
      record: newEmail
    });

  } catch (error) {
    console.error('Error sending email:', error);

    // Save failed record
    const failedEmail = new Email({
      subject,
      body,
      recipients: allRecipients,
      status: 'Failed'
    });
    await failedEmail.save();

    res.status(500).json({ message: 'Failed to send emails', error: error.message });
  }
});

// Get email history
router.get('/history', async (req, res) => {
  try {
    const history = await Email.find().sort({ sentAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
});

module.exports = router;
