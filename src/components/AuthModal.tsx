/**
 * Authentication & Account Switcher Modal
 * Fast demo login, registration onboarding flow, and account management
 */

import React, { useState } from 'react';
import { X, UserCheck, Sparkles, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
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
    showToast
  } = useApp();

  const [mode, setMode] = useState<'switch' | 'login' | 'signup'>('switch');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  if (!isAuthModalOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !displayName.trim()) return;

    updateCurrentUser({
      username: username.toLowerCase().replace(/\s+/g, '_'),
      displayName: displayName.trim(),
      email: email.trim() || `${username.toLowerCase()}@kurolist.app`,
      bio: bio.trim() || 'New member of the KuroList anime community.'
    });

    setIsAuthModalOpen(false);
    showToast(`Welcome to KuroList, ${displayName}!`);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Signed in successfully!');
    setIsAuthModalOpen(false);
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
              {mode === 'switch' ? 'Account Switcher' : mode === 'login' ? 'Sign In' : 'Join KuroList'}
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
            onClick={() => setMode('switch')}
            className={`py-1.5 rounded-lg transition-colors ${
              mode === 'switch' ? 'bg-[#181A26] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Demo Profiles
          </button>
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
        </div>

        {/* Body */}
        <div className="p-5">
          {mode === 'switch' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 mb-2">
                Instantly switch accounts to experience KuroList from different community perspectives:
              </p>

              {/* Main User */}
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

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
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
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-colors"
              >
                Sign In
              </button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="otaku_explorer"
                    className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
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

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell the community about your favorite genres..."
                  className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl p-3 text-xs text-white outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-colors"
              >
                Complete Onboarding
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
