import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CodeGenerator from './pages/CodeGenerator.jsx';
import CodeExplanation from './pages/CodeExplanation.jsx';
import VoiceToCode from './pages/VoiceToCode.jsx';
import HandwrittenOCR from './pages/HandwrittenOCR.jsx';
import ProjectGenerator from './pages/ProjectGenerator.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';

import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected application shell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/code-generator" element={<CodeGenerator />} />
            <Route path="/code-explanation" element={<CodeExplanation />} />
            <Route path="/voice-to-code" element={<VoiceToCode />} />
            <Route path="/handwritten-ocr" element={<HandwrittenOCR />} />
            <Route path="/project-generator" element={<ProjectGenerator />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
