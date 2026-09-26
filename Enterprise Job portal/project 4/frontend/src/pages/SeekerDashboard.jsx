import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Send, CheckCircle, Clock, Sparkles, MapPin,
  Briefcase, Plus, ChevronRight, Video, Search, User
} from 'lucide-react';
import { Link } from 'react-router-dom';

const statusConfig = {
  pending:     { label: 'Pending',     bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100' },
  shortlisted: { label: 'Shortlisted', bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-100' },
  rejected:    { label: 'Rejected',    bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-100' },
};

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [completion, setCompletion] = useState({ score: 0, nextSteps: [], video_resume_url: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, recsRes, compRes] = await Promise.all([
          axios.get('/api/applications/seeker'),
          axios.get('/api/recommendations'),
          axios.get('/api/profile/completion'),
        ]);
        setApplications(appsRes.data);
        setRecommendations(recsRes.data);
        setCompletion(compRes.data);
      } catch (err) {
        console.error('Error fetching data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const shortlisted = applications.filter(a => a.status === 'shortlisted').length;
  const pending = applications.filter(a => a.status === 'pending').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900">My Dashboard</h1>
            <p className="text-gray-500 font-medium mt-1">
              Welcome back, <span className="text-primary-600 font-bold">{user?.name}</span>
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 text-sm"
          >
            <Search className="w-4 h-4" />
            Find New Jobs
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">

          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-5">

            {/* Profile Card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-black text-2xl mx-auto mb-3">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <h3 className="font-black text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase mb-2">
                <span>Profile Power</span>
                <span className="text-primary-600">{completion.score}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completion.score}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-primary-600 h-full rounded-full"
                />
              </div>
              {completion.nextSteps?.length > 0 && (
                <div className="mt-4 space-y-2 text-left">
                  {completion.nextSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                      <Plus className="w-3 h-3 text-primary-400 flex-shrink-0" />
                      {step.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Application Summary</h3>
              {[
                { label: 'Total Applied', value: applications.length, color: 'text-gray-800' },
                { label: 'Shortlisted', value: shortlisted, color: 'text-green-600' },
                { label: 'Pending', value: pending, color: 'text-blue-600' },
                { label: 'Rejected', value: rejected, color: 'text-red-500' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-1">
                  <span className="text-sm font-semibold text-gray-600">{s.label}</span>
                  <span className={`text-lg font-black ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">

            {/* AI Smart Matches */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="bg-primary-600 p-1.5 rounded-lg">
                  <Sparkles className="text-white w-4 h-4" />
                </div>
                <h2 className="text-xl font-black text-gray-900">AI Smart Matches</h2>
                <span className="bg-primary-100 text-primary-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Beta</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.length > 0 ? (
                  recommendations.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-primary-100 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center font-black text-primary-600">
                          {job.company_name?.charAt(0)}
                        </div>
                        <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">
                          {job.match_score}% match
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1 text-sm">{job.title}</h3>
                      <p className="text-xs text-gray-500 mb-3">{job.company_name}</p>
                      <div className="flex gap-3 text-[10px] text-gray-400 font-bold uppercase mb-4">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.type}</span>
                      </div>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="block w-full text-center py-2 rounded-xl bg-gray-50 hover:bg-primary-600 hover:text-white transition-all font-bold text-xs text-gray-700"
                      >
                        View Job
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full bg-white border border-gray-100 rounded-2xl p-10 text-center">
                    <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-semibold text-sm">Update your skills to see personalized matches.</p>
                    <Link to="/jobs" className="inline-flex items-center gap-1 text-primary-600 font-bold text-sm mt-3">
                      Browse all jobs <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Applications */}
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                My Applications
              </h2>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 h-20 animate-pulse" />
                  ))}
                </div>
              ) : applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.map((app, i) => {
                    const sc = statusConfig[app.status] || statusConfig.pending;
                    return (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-500 text-sm flex-shrink-0">
                            {app.company_name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">{app.job_title}</h3>
                            <p className="text-xs text-gray-500">{app.company_name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 sm:text-right">
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Applied</p>
                            <p className="text-xs font-bold text-gray-600">{new Date(app.applied_at).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border ${sc.bg} ${sc.text} ${sc.border}`}>
                            {sc.label}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
                  <Send className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-semibold mb-4">You haven't applied to any jobs yet.</p>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-700 transition-all"
                  >
                    <Search className="w-4 h-4" /> Start Browsing
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;