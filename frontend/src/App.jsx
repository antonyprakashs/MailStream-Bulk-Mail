import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MailComposer from './components/MailComposer';
import MailHistory from './components/MailHistory';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MailComposer />} />
            <Route path="/history" element={<MailHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
