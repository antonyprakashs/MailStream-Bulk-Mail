import { useState } from 'react';
import axios from 'axios';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';

const MailComposer = () => {
  const [formData, setFormData] = useState({
    subject: '',
    body: '',
    recipients: '',
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // Parse recipients into an array
    const recipientList = formData.recipients
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email !== '');

    if (recipientList.length === 0 && !file) {
      setStatus({ type: 'error', message: 'Please enter at least one valid email address or upload an Excel file.' });
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('subject', formData.subject);
      submitData.append('body', formData.body);
      submitData.append('recipients', JSON.stringify(recipientList));
      if (file) {
        submitData.append('file', file);
      }

      const response = await axios.post('http://localhost:5000/api/mail/send', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus({ type: 'success', message: response.data.message });
      setFormData({ subject: '', body: '', recipients: '' });
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('file');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'An error occurred while sending emails.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel fade-in">
      <div className="panel-header">
        <h2>Compose Mail</h2>
        <p>Send bulk emails effortlessly to your audience.</p>
      </div>

      {status.message && (
        <div className={`status-toast ${status.type}`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="compose-form">
        <div className="form-group">
          <label htmlFor="recipients">Recipients (comma separated or leave blank if uploading file)</label>
          <textarea
            id="recipients"
            name="recipients"
            value={formData.recipients}
            onChange={handleChange}
            placeholder="john@example.com, jane@example.com"
            rows="2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">Upload Excel File with Recipients (Optional)</label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter email subject"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="body">Email Body</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            placeholder="Type your message here..."
            required
            rows="8"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <span className="loader"></span>
          ) : (
            <>
              <Send size={18} /> Send Mail
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default MailComposer;
