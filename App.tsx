import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './components/pages/HomePage';
import PropertiesPage from './components/pages/PropertiesPage';
import PropertyDetailPage from './components/pages/PropertyDetailPage';
import LoginPage from './components/pages/LoginPage';
import DashboardPage from './components/pages/DashboardPage';
import AddPropertyPage from './components/pages/AddPropertyPage';
import SitemapPage from './components/pages/SitemapPage';
import ProjectsPage from './components/pages/ProjectsPage';
import ProjectPage from './components/pages/ProjectPage';
import LegacyPropertyRedirect from './components/pages/LegacyPropertyRedirect';

// Auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const MainLayout: React.FC = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-slate-100 via-white to-slate-100 text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-blue-100/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-40 bg-gradient-to-l from-indigo-100/60 to-transparent" />
      <Header />
      <main className="relative z-10 flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes with main layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectSlug" element={<ProjectPage />} />
            <Route path="/projects/:projectSlug/:type(buy|rent)" element={<ProjectPage />} />
            <Route path="/projects/:projectSlug/:type(buy|rent)/:roomSlugId" element={<PropertyDetailPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<LegacyPropertyRedirect />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-property"
              element={
                <ProtectedRoute>
                  <AddPropertyPage />
                </ProtectedRoute>
              }
            />
          </Route>
          
          {/* Standalone routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sitemap.xml" element={<SitemapPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;