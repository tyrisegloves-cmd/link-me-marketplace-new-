import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RippleButton } from '../components/RippleButton';
import type { PageType } from '../types';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
  onNavigate?: (page: PageType) => void;
}

export function AuthPage({ initialMode = 'signin', onNavigate }: AuthPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [userRole, setUserRole] = useState<'client' | 'provider'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Home Services & Repairs');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: 'client' | 'provider';
    avatar: string;
  } | null>(null);

  // Calculate password strength
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordStrength = calculatePasswordStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  // Handle Demo Fill
  const handleDemoSignIn = (role: 'client' | 'provider') => {
    if (role === 'client') {
      setEmail('sarah.jenkins@example.com');
      setPassword('Password123!');
      setUserRole('client');
    } else {
      setEmail('marcus.vance@example.com');
      setPassword('MasterPro2026!');
      setUserRole('provider');
    }
    setErrorMessage('');
  };

  // Submit Handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('Please agree to the Terms of Service & Privacy Policy.');
        return;
      }
    } else {
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const displayName = mode === 'signup' 
        ? fullName 
        : email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      
      const avatarUrl = userRole === 'client'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80';

      setCurrentUser({
        name: displayName,
        email,
        role: userRole,
        avatar: avatarUrl,
      });
    }, 900);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gradient-to-b from-slate-50 via-white to-slate-50/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* If logged in, show authenticated state card */}
        {currentUser ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/80 border border-slate-200 text-center"
          >
            <div className="mx-auto w-20 h-20 rounded-full ring-4 ring-blue-100 overflow-hidden mb-5 shadow-md">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-3">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Signed In Successfully
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome, {currentUser.name}!
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Account: <span className="font-semibold text-slate-800">{currentUser.email}</span> •{' '}
              <span className="capitalize font-semibold text-blue-600">
                {currentUser.role === 'provider' ? 'Service Professional' : 'Client Account'}
              </span>
            </p>

            <div className="mt-8 space-y-3">
              <RippleButton
                rippleColor="rgba(255,255,255,0.4)"
                onClick={() => onNavigate?.('marketplace')}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                Browse Marketplace & Book Services
              </RippleButton>

              <RippleButton
                rippleColor="rgba(59,130,246,0.15)"
                onClick={() => onNavigate?.('home')}
                className="w-full py-3 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
              >
                Return to Home Page
              </RippleButton>

              <button
                type="button"
                onClick={() => {
                  setCurrentUser(null);
                  setEmail('');
                  setPassword('');
                }}
                className="text-xs text-slate-400 hover:text-red-600 font-medium transition-colors pt-2 cursor-pointer"
              >
                Sign out of this session
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            
            {/* Left Column: Auth Form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/70 border border-slate-200/90"
            >
              {/* Header inside form */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {mode === 'signin' ? 'Welcome Back' : 'Create an Account'}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    {mode === 'signin'
                      ? 'Access your saved quotes, messages, and bookings'
                      : 'Connect with verified service pros or grow your business'}
                  </p>
                </div>
              </div>

              {/* Mode Toggle Tabs (Sign In vs Sign Up) */}
              <div className="mt-6 p-1.5 bg-slate-100/90 rounded-2xl flex relative">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Role Selection */}
              <div className="mt-5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  I want to:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserRole('client')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      userRole === 'client'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${userRole === 'client' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold">Hire Services</p>
                      <p className="text-[11px] text-slate-500">Find top professionals</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserRole('provider')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      userRole === 'provider'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${userRole === 'provider' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold">Offer Services</p>
                      <p className="text-[11px] text-slate-500">List as a verified pro</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs font-medium text-red-700">
                  <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                
                {/* Full name (Sign Up only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Henderson"
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>

                {/* Pro Category (Sign Up & Provider only) */}
                {mode === 'signup' && userRole === 'provider' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Trade / Service Specialty
                    </label>
                    <select
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 bg-white"
                    >
                      <option>Electrical & Lighting</option>
                      <option>Plumbing & Piping</option>
                      <option>HVAC & Climate Control</option>
                      <option>Carpentry & Woodwork</option>
                      <option>House Cleaning & Janitorial</option>
                      <option>Landscaping & Tree Service</option>
                      <option>Appliance Repair</option>
                      <option>Painting & Drywall</option>
                    </select>
                  </div>
                )}

                {/* Phone number (Sign Up only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                )}

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => alert('Password reset link sent to demo registered email!')}
                        className="text-xs font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator (Sign Up only) */}
                  {mode === 'signup' && password && (
                    <div className="mt-2">
                      <div className="flex gap-1.5 h-1.5 w-full">
                        {[0, 1, 2, 3].map((step) => (
                          <div
                            key={step}
                            className={`h-full flex-1 rounded-full transition-all ${
                              step < passwordStrength
                                ? strengthColors[passwordStrength - 1]
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500 font-medium">
                        Strength:{' '}
                        <span className="font-semibold text-slate-700">
                          {strengthLabels[passwordStrength - 1] || 'Too short'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password (Sign Up only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Checkboxes */}
                {mode === 'signin' ? (
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Keep me signed in for 30 days</span>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer">
                      I agree to the{' '}
                      <span className="text-blue-600 hover:underline">Terms of Service</span> and{' '}
                      <span className="text-blue-600 hover:underline">Privacy Policy</span>.
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <RippleButton
                    rippleColor="rgba(255,255,255,0.4)"
                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Please wait...</span>
                      </>
                    ) : (
                      <span>{mode === 'signin' ? 'Sign In to Link Me' : 'Create Free Account'}</span>
                    )}
                  </RippleButton>
                </div>
              </form>

              {/* Demo Logins helper pills */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Quick Demo Access (Click to autofill):
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('client')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-medium transition-colors border border-slate-200 cursor-pointer"
                  >
                    Demo Client (Sarah)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('provider')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-medium transition-colors border border-slate-200 cursor-pointer"
                  >
                    Demo Pro (Marcus)
                  </button>
                </div>
              </div>

              {/* Social Login Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('client')}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('provider')}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.09 1.73-.95 2.76 1.01.08 2.05-.51 2.67-1.26" />
                  </svg>
                  Apple
                </button>
              </div>
            </motion.div>

            {/* Right Column: Platform Trust & Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-5 space-y-6"
            >
              {/* Trust Box */}
              <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-8 text-white shadow-xl">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                  Why Join Link Me?
                </span>
                
                <h3 className="text-2xl font-bold tracking-tight">
                  The trusted local marketplace for high-quality service
                </h3>
                
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  Join thousands of verified homeowners, businesses, and skilled professionals who communicate, quote, and get work done safely.
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      title: '100% Background-Checked Pros',
                      desc: 'Every provider undergoes identity and license verification before taking jobs.',
                      icon: (
                        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      ),
                    },
                    {
                      title: 'Transparent Pricing & Free Quotes',
                      desc: 'Compare upfront hourly rates and get custom estimates without surprises.',
                      icon: (
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                    },
                    {
                      title: 'Direct Instant Messaging',
                      desc: 'Chat directly with your service provider, attach photos, and schedule visits.',
                      icon: (
                        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      ),
                    },
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-3.5 items-start">
                      <div className="p-2 rounded-xl bg-white/10 shrink-0 mt-0.5">
                        {feat.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                        <p className="text-[11.5px] text-slate-300 leading-snug mt-0.5">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Testimonial Quote */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-1 text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs italic text-slate-200 leading-relaxed">
                    "Signing up took less than two minutes, and I had three verified plumbers message me within half an hour. Best service experience I've had!"
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-slate-400">
                    — David K., Verified Homeowner in Seattle
                  </p>
                </div>
              </div>

              {/* Stats Card */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xl font-extrabold text-blue-600">15k+</p>
                    <p className="text-[11px] text-slate-500 font-medium">Verified Pros</p>
                  </div>
                  <div className="border-x border-slate-100">
                    <p className="text-xl font-extrabold text-indigo-600">98%</p>
                    <p className="text-[11px] text-slate-500 font-medium">5-Star Reviews</p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-emerald-600">20 min</p>
                    <p className="text-[11px] text-slate-500 font-medium">Avg Response</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
