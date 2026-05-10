import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

const MailHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/mail/history');
      setHistory(response.data);
    } catch (err) {
      setError('Failed to load email history.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="glass-panel slide-up">
      <div className="panel-header">
        <h2>Email History</h2>
        <p>Review previously sent bulk campaigns.</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loader large"></div>
          <p>Loading history...</p>
        </div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <Clock size={48} className="empty-icon" />
          <p>No emails sent yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Recipients</th>
                <th>Date Sent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record._id}>
                  <td className="subject-cell">{record.subject}</td>
                  <td>
                    <div className="recipients-cell">
                      {record.recipients.length} recipient(s)
                      <span className="tooltip">{record.recipients.join(', ')}</span>
                    </div>
                  </td>
                  <td className="date-cell">{formatDate(record.sentAt)}</td>
                  <td>
                    <span className={`status-badge ${record.status.toLowerCase()}`}>
                      {record.status === 'Success' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MailHistory;
