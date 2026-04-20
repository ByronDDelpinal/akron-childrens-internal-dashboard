import { useState } from 'react';
import { Lock } from 'lucide-react';
import { ORG_NAME } from '../lib/constants';

export default function PasswordGate({ onLogin, isLoading, error }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      onLogin(password);
    }
  };

  return (
    <div className="min-h-svh flex flex-col bg-white">
      <div className="rainbow-bar-thick" />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-light mb-4">
              <Lock className="w-7 h-7 text-purple" />
            </div>
            <h1 className="font-display text-2xl text-purple font-bold">
              Board Portal
            </h1>
            <p className="text-med-gray text-sm mt-1">
              {ORG_NAME}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark mb-1.5">
                Access Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter board password"
                autoFocus
                className="w-full px-4 py-3 rounded-lg border border-border bg-light-gray
                           text-dark placeholder:text-med-gray
                           focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent
                           transition-all"
              />
            </div>

            {error && (
              <p className="text-red text-sm" role="alert">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full py-3 px-4 rounded-lg bg-teal text-white font-semibold text-sm
                         hover:bg-teal-dark active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all"
            >
              {isLoading ? 'Verifying...' : 'Enter Dashboard'}
            </button>
          </form>

          <p className="text-center text-xs text-med-gray mt-6">
            Contact the board secretary if you need access.
          </p>
        </div>
      </div>

      <div className="rainbow-bar" />
    </div>
  );
}
