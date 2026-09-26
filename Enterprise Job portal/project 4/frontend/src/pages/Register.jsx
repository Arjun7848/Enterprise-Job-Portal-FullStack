import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Briefcase, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seeker'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl w-full max-w-xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-primary-600 w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500">Join the elite network of professionals and recruiters</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center space-x-2 mb-6 border border-red-100">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/50"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/50"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'seeker'})}
                className={`flex items-center justify-center space-x-2 p-4 rounded-xl border-2 transition-all ${formData.role === 'seeker' ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-gray-100 bg-gray-50 text-gray-500'}`}
              >
                <User className="w-5 h-5" />
                <span className="font-bold">Job Seeker</span>
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'recruiter'})}
                className={`flex items-center justify-center space-x-2 p-4 rounded-xl border-2 transition-all ${formData.role === 'recruiter' ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-gray-100 bg-gray-50 text-gray-500'}`}
              >
                <Briefcase className="w-5 h-5" />
                <span className="font-bold">Recruiter</span>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 active:scale-95"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Already have an account? {' '}
          <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
