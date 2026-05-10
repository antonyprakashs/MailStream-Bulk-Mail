import { Link, useLocation } from 'react-router-dom';
import { Send, Clock } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Send className="brand-icon" />
        <h1>MailStream</h1>
      </div>
      <div className="nav-links">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          <Send size={18} /> Compose
        </Link>
        <Link 
          to="/history" 
          className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
        >
          <Clock size={18} /> History
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
