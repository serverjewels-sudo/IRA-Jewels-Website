import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, Key, AlertCircle, ArrowLeft } from 'lucide-react';
import { checkIsAdminEmail, supabase } from '../supabase';

interface AdminLoginProps {
  onLoginSuccess: (email: string) => void;
  onCancel: () => void;
}

export default function AdminLogin({ onLoginSuccess, onCancel }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);

    try {
      const emailTrimmed = email.toLowerCase().trim();

      // 1. Real Supabase Auth login
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: emailTrimmed,
        password: password,
      });

      if (authError) {
        setError('Invalid email or password');
        setIsAuthenticating(false);
        return;
      }

      // 2. Query Supabase database admin_users table for authorization status
      const isValidAdmin = await checkIsAdminEmail(emailTrimmed);

      if (isValidAdmin) {
        onLoginSuccess(emailTrimmed);
      } else {
        // Not in admin_users -> access denied
        setError('You are not authorized as admin');
        setIsAuthenticating(false);
        // Sign back out so they don't stay logged in as a normal customer in this context
        await supabase.auth.signOut();
      }
    } catch {
      setError('Invalid email or password');
      setIsAuthenticating(false);
    }
  };

  return (
    <div id="admin-login-screen" className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center p-4 select-none relative">
      {/* Absolute top return button */}
      <button
        onClick={onCancel}
        className="absolute top-6 left-6 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-2 duration-300 transition-all cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Return to Boutique</span>
      </button>

      <div className="w-full max-w-md bg-[#121212] border border-zinc-800 rounded-xs px-8 py-10 shadow-2xl relative overflow-hidden">
        {/* Sleek top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a6b5c] via-zinc-800 to-[#1a6b5c]" />
        
        {/* Brand logo at top */}
        <div className="text-center flex flex-col items-center justify-center select-none mb-8">
          <span className="font-serif text-2xl sm:text-3xl font-light tracking-[0.3em] text-white uppercase">
            LUXELOOM
          </span>
          <span className="text-[9px] tracking-[0.5em] uppercase text-[#1a6b5c] font-mono mt-1">
            Fine Jewels
          </span>
        </div>

        {/* Header Titles */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-serif text-xl font-light tracking-wide text-zinc-100 uppercase">
            Atelier Admin Portal
          </h2>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em]">
            Authorized Access Only
          </p>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-900/60 text-red-400 text-xs font-mono rounded-xs flex items-start space-x-3.5">
            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold">Security Access Refused</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Admin Email Input */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-semibold">
              Admin Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Mail size={14} />
              </span>
              <input
                id="admin-login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Admin Gmail"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#181818] border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] focus:border-[#1a6b5c] transition-all"
              />
            </div>
          </div>

          {/* Admin Password Input */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-semibold">
              Admin Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Key size={14} />
              </span>
              <input
                id="admin-login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your Password"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#181818] border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] focus:border-[#1a6b5c] transition-all"
              />
            </div>
          </div>

          {/* Submit Teal Button */}
          <button
            id="admin-login-submit"
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-[#1a6b5c] hover:bg-[#1a554a] disabled:bg-zinc-800 text-white font-medium text-xs uppercase tracking-[0.2em] py-4 rounded-xs transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            {isAuthenticating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Validating Security Clearance...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={15} />
                <span>Unlock Admin Vault</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
