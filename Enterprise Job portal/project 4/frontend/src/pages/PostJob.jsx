import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, List, FileText } from 'lucide-react';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'full-time',
    location: '',
    salary_range: '',
    requirements: '',
    company_id: 1 // Stub for now
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/jobs', formData);
      navigate('/recruiter');
    } catch (err) {
      console.error('Error posting job', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl shadow-xl"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Post a New Job</h1>
          <p className="text-gray-500">Reach thousands of qualified candidates</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Job Title</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Senior Product Designer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. San Francisco, Remote"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Salary Range</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={formData.salary_range}
                  onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. $120k - $150k"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Job Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Job Description</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows="4"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
                placeholder="Describe the role and responsibilities..."
              ></textarea>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Requirements (one per line)</label>
            <div className="relative">
              <List className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <textarea 
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                required
                rows="4"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
                placeholder="• 5+ years of React experience..."
              ></textarea>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg disabled:bg-gray-400"
          >
            {loading ? 'Posting...' : 'Post Job Listing'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default PostJob;
