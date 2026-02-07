import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Detail } from './pages/Detail';
import { AdminPanel } from './pages/Admin';
import { Auth } from './pages/Auth';

// Scroll to top on route change, but respect POP (back button) scroll restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  React.useEffect(() => {
    if (navType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-gaming-neon selection:text-black flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Home />} />
            <Route path="/account/:id" element={<Detail />} />
            <Route path="/admin/*" element={<AdminPanel />} />
            <Route path="/login" element={<Auth />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;