import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Plus, Users, Briefcase, Calendar, Video,
  CheckCircle, XCircle, Clock, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_TABS = ['all', 'pending', 'shortlisted', 'rejected'];

const statusConfig = {
  pending:     { label: 'Pending',     bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100' },
  shortlisted: { label: 'Shortlisted', bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-100' },
  rejected:    { label: 'Rejected',    bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-100' },
};

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [schedulingData, setSchedulingData] = useState({
    scheduled_at: '',
    duration: 30,
    meeting_link: 'https://meet.google.com/abc-defg-hij',
  });

  const fetchData = useCallback(async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        axios.get('/api/jobs/mine'),
        axios.get('/api/applications/recruiter'),
      ]);
      setMyJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error('Error fetching recruiter data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusUpdate = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await axios.patch(`/api/applications/${appId}/status`, { status: newStatus });
      setApplications(prev =>
        prev.map(a => a.id === appId ? { ...a, status: newStatus } : a)
      );
    } catch (err) {
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/interviews', {
        application_id: selectedApp.id,
        job_id: selectedApp.job_id,
        seeker_id: selectedApp.seeker_id,
        ...schedulingData,
      });
      // Also shortlist after scheduling
      await handleStatusUpdate(selectedApp.id, 'shortlisted');
      setShowModal(false);
      alert('Interview scheduled successfully!');
    } catch {
      alert('Error scheduling interview.');
    }
  };

  const filteredApps = activeTab === 'all'
    ? applications
    : applications.filter(a => a.status === activeTab);

  const stats = [
    { label: 'Active Jobs',        value: myJobs.length,                                    color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'Total Applications', value: applications.length,                               color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Shortlisted',        value: applications.filter(a => a.status === 'shortlisted').length, color: 'text-green-600',  bg: 'bg-green-50' },
    { label: 'Pending Review',     value: applications.filter(a => a.status === 'pending').length,    color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schedule Interview Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-1">Schedule Interview</h2>
              <p className="text-sm text-gray-500 mb-6">
                Candidate: <span className="font-bold text-gray-700">{selectedApp?.seeker_name}</span>
              </p>
              <form onSubmit={handleSchedule} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={schedulingData.scheduled_at}
                    onChange={e => setSchedulingData({ ...schedulingData, scheduled_at: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Duration</label>
                  <select
                    value={schedulingData.duration}
                    onChange={e => setSchedulingData({ ...schedulingData, duration: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-white"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 text-gray-500 text-sm">
                  <Video className="w-4 h-4 flex-shrink-0" />
                  <span className="italic text-xs">Meeting link generated automatically</span>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-all border border-gray-200 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all text-sm"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Recruiter Dashboard</h1>
            <p className="text-gray-500 font-medium mt-1">
              Welcome, <span className="text-primary-600 font-bold">{user?.name}</span>
            </p>
          </div>
          <Link
            to="/recruiter/post-job"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 text-sm"
          >
            <Plus className="w-4 h-4" />
            Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <div key={i} className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm`}>
              <p className={`text-3xl font-black ${s.color} mb-1`}>{loading ? '—' : s.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">

          {/* Sidebar – My Job Postings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">My Job Postings</h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                </div>
              ) : myJobs.length > 0 ? (
                <div className="space-y-2">
                  {myJobs.map(job => (
                    <div key={job.id} className="p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      <p className="font-bold text-gray-800 text-sm truncate">{job.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-400">{job.company_name}</p>
                        <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                          {job.application_count ?? 0} apps
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 font-semibold">No jobs posted yet</p>
                  <Link to="/recruiter/post-job" className="text-xs text-primary-600 font-bold mt-2 inline-block">Post your first job →</Link>
                </div>
              )}
            </div>
          </div>

          {/* Main – Applications Inbox */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Tab bar */}
              <div className="flex items-center gap-1 p-4 border-b border-gray-100 overflow-x-auto">
                {STATUS_TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                    }`}
                  >
                    {tab}
                    {tab !== 'all' && (
                      <span className="ml-1.5 opacity-70">
                        ({applications.filter(a => a.status === tab).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Applications Table */}
              {loading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
                </div>
              ) : filteredApps.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {filteredApps.map((app) => {
                    const sc = statusConfig[app.status] || statusConfig.pending;
                    const isUpdating = updatingId === app.id;
                    return (
                      <motion.div
                        key={app.id}
                        layout
                        className="p-5 hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Candidate info */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-black text-sm flex-shrink-0">
                              {app.seeker_name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{app.seeker_name}</p>
                              <p className="text-xs text-gray-400">{app.seeker_email}</p>
                            </div>
                          </div>

                          {/* Job + date */}
                          <div className="flex-1 px-4 hidden sm:block">
                            <p className="text-sm font-semibold text-gray-700">{app.job_title}</p>
                            <p className="text-xs text-gray-400">{new Date(app.applied_at).toLocaleDateString()}</p>
                          </div>

                          {/* Status + Actions */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${sc.bg} ${sc.text} ${sc.border}`}>
                              {sc.label}
                            </span>

                            {app.status === 'pending' && (
                              <>
                                <button
                                  disabled={isUpdating}
                                  onClick={() => { setSelectedApp(app); setShowModal(true); }}
                                  className="flex items-center gap-1.5 bg-primary-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-primary-700 transition-all disabled:opacity-50"
                                >
                                  <Calendar className="w-3 h-3" />
                                  Schedule
                                </button>
                                <button
                                  disabled={isUpdating}
                                  onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                                  className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-green-700 transition-all disabled:opacity-50"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Shortlist
                                </button>
                                <button
                                  disabled={isUpdating}
                                  onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                  className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-all disabled:opacity-50"
                                >
                                  <XCircle className="w-3 h-3" />
                                  Reject
                                </button>
                              </>
                            )}

                            {app.status === 'shortlisted' && (
                              <Link
                                to="/interviews"
                                className="flex items-center gap-1.5 text-primary-600 font-bold text-xs hover:underline border border-primary-100 bg-primary-50 px-3 py-1.5 rounded-xl"
                              >
                                <Video className="w-3 h-3" />
                                View Meeting
                              </Link>
                            )}

                            {app.status === 'rejected' && (
                              <button
                                disabled={isUpdating}
                                onClick={() => handleStatusUpdate(app.id, 'pending')}
                                className="text-xs text-gray-400 hover:text-primary-600 font-bold transition-colors"
                              >
                                Undo
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Mobile: job title */}
                        <div className="sm:hidden mt-2 pl-13">
                          <p className="text-xs font-semibold text-gray-600">{app.job_title} · {new Date(app.applied_at).toLocaleDateString()}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-semibold">
                    {activeTab === 'all'
                      ? 'No applications received yet.'
                      : `No ${activeTab} applications.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
