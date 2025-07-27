import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Components
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import YouTubers from './pages/YouTubers';
import YouTuberDetail from './pages/YouTuberDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreatorLogin from './pages/CreatorLogin';
import CreatorDashboard from './pages/CreatorDashboard';
import CreatorInquiries from './pages/CreatorInquiries';
import CreatorInquiryDetail from './pages/CreatorInquiryDetail';

// Route Protection
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 flex flex-col">
          <Routes>
            {/* Creator routes without navbar/footer */}
            <Route path="/creator/login" element={<CreatorLogin />} />
            <Route path="/creator/dashboard" element={<CreatorDashboard />} />
            <Route path="/creator/inquiries" element={<CreatorInquiries />} />
            <Route path="/creator/inquiries/:id" element={<CreatorInquiryDetail />} />

            {/* Main site routes with navbar/footer */}
            <Route path="/*" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/youtubers" element={<YouTubers />} />
                    <Route path="/youtubers/:id" element={<YouTuberDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
