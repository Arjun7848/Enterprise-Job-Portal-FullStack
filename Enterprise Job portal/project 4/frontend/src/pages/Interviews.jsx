import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Video, User, CheckCircle, XCircle } from 'lucide-react';

const Interviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const endpoint = user.role === 'seeker' ? '/api/interviews/seeker' : '/api/interviews/recruiter';
      const res = await axios.get(endpoint);
      setInterviews(res.data);
    } catch (err) {
      console.error('Error fetching interviews', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(`/api/interviews/${id}`, { status });
      fetchInterviews();
    } catch (err) {
      console.error('Error updating interview', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Interview Console</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Manage your meeting schedule</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => <div key={i} className="glass h-32 animate-pulse rounded-3xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {interviews.length > 0 ? interviews.map((interview, i) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-3xl border border-white/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-6">
                <div className="bg-primary-100 p-4 rounded-2xl shadow-sm text-primary-600">
                  <Calendar className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-800">{interview.job_title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-sm font-bold text-gray-500">
                      <User className="w-4 h-4 mr-2 text-primary-400" />
                      {user.role === 'seeker' ? interview.recruiter_name : interview.seeker_name}
                    </div>
                    <div className="flex items-center text-sm font-bold text-gray-500">
                      <Clock className="w-4 h-4 mr-2 text-primary-400" />
                      {new Date(interview.scheduled_at).toLocaleString()} ({interview.duration}m)
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4">
                {interview.meeting_link && (
                  <a 
                    href={interview.meeting_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all"
                  >
                    <Video className="w-5 h-5" />
                    <span>Join Meeting</span>
                  </a>
                )}
                
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
                    interview.status === 'scheduled' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    interview.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                    'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {interview.status}
                  </span>
                  
                  {user.role === 'recruiter' && interview.status === 'scheduled' && (
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => handleUpdateStatus(interview.id, 'completed')} className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                        <CheckCircle className="w-6 h-6" />
                      </button>
                      <button onClick={() => handleUpdateStatus(interview.id, 'cancelled')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="glass p-12 text-center rounded-3xl">
              <p className="text-gray-400 font-bold">No interviews scheduled yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Interviews;
