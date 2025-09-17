
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Listings', to: '/properties' },
];

const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-600/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 11.25 12 4l9 7.25M6 9v11h12V9" />
              </svg>
            </span>
            <div>
              <span className="block text-xl font-semibold tracking-tight text-slate-900">Estato</span>
              <span className="block text-xs font-medium uppercase tracking-[0.3em] text-slate-500">Real Estate</span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 shadow-sm shadow-slate-200/60 backdrop-blur sm:flex">
              {NAV_ITEMS.map(({ label, to }) => {
                const isHome = to === '/';
                const isActive = isHome ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/40'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              {user && (
                <Link
                  to="/dashboard"
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    pathname.startsWith('/dashboard') || pathname.startsWith('/add-property')
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/40'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2 sm:hidden">
              {NAV_ITEMS.map(({ label, to }) => {
                const isHome = to === '/';
                const isActive = isHome ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600 shadow-sm ${
                      isActive ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-blue-500/40' : ''
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              {user && (
                <Link
                  to="/dashboard"
                  className={`rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600 shadow-sm ${
                    pathname.startsWith('/dashboard') || pathname.startsWith('/add-property')
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-blue-500/40'
                      : ''
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <span>Logout</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-4 w-4 opacity-80"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m18 9 3 3m0 0-3 3m3-3H9.75" />
                </svg>
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5"
              >
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
