/**
 * Authentication & Account Switcher Modal
 * KuroList - Real Firebase Google Authentication & Demo Profile Switcher
 */

import React, { useState } from 'react';
import { X, Mail, Lock, User, Check, LogOut, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRENT_USER } from '../data/mockUsers';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    otherUsers,
    switchUser,
    updateCurrentUser,
    showToast,
    firebaseUser,
    signInWithGoogleAction,
    signInWithEmailAction,
    signUpWithEmailAction,
    resetPasswordAction,
    signOutAction,
    isFirebaseLoading
  } = useApp();

  const [mode, setMode] = useState<'switch' | 'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [showForgotPass, setShowForgotPass] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter both email and password.', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    const safeUsername = username.trim() || email.split('@')[0];
    const safeDisplayName = displayName.trim() || safeUsername;

    try {
      await signUpWithEmailAction(email, password, safeUsername, safeDisplayName);
    } catch {
      // Handled in context toast
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter both email and password.', 'error');
      return;
    }
    try {
      await signInWithEmailAction(email, password);
    } catch {
      // Handled in context toast
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      showToast('Please enter your email address first.', 'error');
      return;
    }
    try {
      await resetPasswordAction(email);
      setShowForgotPass(false);
    } catch {
      // Handled in context toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#181A26] border border-[#2A2F45] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A2F45]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              K
            </div>
            <h3 className="text-sm font-semibold text-white">
              {mode === 'switch' ? 'Demo Profiles' : mode === 'login' ? 'Sign In / Account' : 'Join KuroList'}
            </h3>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1F2335] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 p-2 bg-[#131520] border-b border-[#2A2F45] gap-1 text-xs font-medium">
          <button
            onClick={() => setMode('login')}
            className={`py-1.5 rounded-lg transition-colors ${
              mode === 'login' ? 'bg-[#181A26] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`py-1.5 rounded-lg transition-colors ${
              mode === 'signup' ? 'bg-[#181A26] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setMode('switch')}
            className={`py-1.5 rounded-lg transition-colors ${
              mode === 'switch' ? 'bg-[#181A26] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Demo Profiles
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {mode === 'login' && (
            <div className="space-y-4">
              {/* Google Sign In Button */}
              {firebaseUser ? (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={firebaseUser.photoURL || currentUser.avatar}
                      alt="Google User"
                      className="w-10 h-10 rounded-full object-cover border border-emerald-500/50"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {firebaseUser.displayName || 'Google Account'}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {firebaseUser.email}
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                      Cloud Sync Active
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setIsAuthModalOpen(false)}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Continue as {firebaseUser.displayName?.split(' ')[0] || 'User'}
                    </button>
                    <button
                      onClick={signOutAction}
                      className="px-3 py-2 bg-[#2A2F45]/50 hover:bg-[#2A2F45] text-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={signInWithGoogleAction}
                  disabled={isFirebaseLoading}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-[0.99] disabled:opacity-60"
                >
                  {isFirebaseLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Sign in with Google</span>
                </button>
              )}

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-[#2A2F45] w-full" />
                <span className="bg-[#181A26] px-2 text-[11px] text-slate-500 uppercase tracking-wider">
                  or email & password
                </span>
                <div className="border-t border-[#2A2F45] w-full" />
              </div>

              {!showForgotPass ? (
                <form onSubmit={handleLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-slate-400">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPass(true)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isFirebaseLoading}
                    className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isFirebaseLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Sign In</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-3 p-3 bg-[#131520] rounded-xl border border-[#2A2F45]">
                  <p className="text-xs text-slate-300">
                    Enter your email to receive a password reset link:
                  </p>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full bg-[#181A26] border border-[#2A2F45] focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPass(false)}
                      className="flex-1 py-2 bg-[#2A2F45]/50 hover:bg-[#2A2F45] text-slate-300 rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isFirebaseLoading}
                      onClick={handleResetPassword}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      {isFirebaseLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      Send Reset Email
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Username</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="otaku_pro"
                      className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl pl-8 pr-2 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Display Name</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Ren Amamiya"
                    className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Short Bio (Optional)</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Share your favorite anime or genres..."
                  className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl p-3 text-xs text-white outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isFirebaseLoading}
                className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isFirebaseLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Create Cloud Account</span>
              </button>
            </form>
          )}

          {mode === 'switch' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 mb-2">
                Instantly switch accounts to experience KuroList from different community perspectives:
              </p>

              {/* Main Ashok Rimal Profile */}
              <div
                onClick={() => {
                  switchUser(CURRENT_USER);
                  setIsAuthModalOpen(false);
                }}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  currentUser.id === CURRENT_USER.id
                    ? 'bg-indigo-950/20 border-indigo-500/60 ring-1 ring-indigo-500'
                    : 'bg-[#131520] border-[#2A2F45] hover:border-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={CURRENT_USER.avatar} alt="Ashok" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      {CURRENT_USER.displayName}
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-mono">
                        Admin
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">@{CURRENT_USER.username} · Lv.18 Sage</div>
                  </div>
                </div>
                {currentUser.id === CURRENT_USER.id && <Check className="w-4 h-4 text-indigo-400" />}
              </div>

              {/* Other demo profiles */}
              {otherUsers.map(user => {
                const isActive = currentUser.id === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      switchUser(user);
                      setIsAuthModalOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isActive
                        ? 'bg-indigo-950/20 border-indigo-500/60 ring-1 ring-indigo-500'
                        : 'bg-[#131520] border-[#2A2F45] hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.displayName} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-semibold text-white">{user.displayName}</div>
                        <div className="text-[11px] text-slate-400">@{user.username} · Lv.{user.level}</div>
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
