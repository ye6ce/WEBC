
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { adminVerify } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAdmin } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const isAuth = await adminVerify(email, pass);
    if (isAuth) {
      setAdmin(true);
      navigate('/admin');
    } else {
      setError('Invalid credentials or unauthorized access.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-12 shadow-xl">
        <div className="flex justify-center mb-8 text-gold-600">
          <Lock size={48} />
        </div>
        <h1 className="text-3xl serif text-center mb-2">Vault Access</h1>
        <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-10">K-SHOP Administrative Portal</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Identifier</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-black outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Key</label>
            <input 
              required
              type="password" 
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-black outline-none transition-all"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <button 
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-black text-white font-bold tracking-[0.2em] uppercase hover:bg-gray-900 transition-all transform hover:scale-[1.02]"
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER VAULT'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
