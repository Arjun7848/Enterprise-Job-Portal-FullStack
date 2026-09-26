import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Users, Briefcase, FileText, Trash2, Shield, TrendingUp, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0, recruiters: 0 });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, jobsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/jobs')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setJobs(jobsRes.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`/api/admin/jobs/${id}`);
      setJobs(jobs.filter(j => j.id !== id));
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center space-x-4">
          <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-200">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-800 tracking-tight">Admin Terminal</h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">System Governance & Analytics</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-12 bg-gray-100 p-1.5 rounded-2xl w-fit">
        {['overview', 'users', 'jobs'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-white text-gray-800 shadow-md' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => <div key={i} className="glass h-32 rounded-3xl"></div>)}
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: stats.users, icon: <Users className="text-blue-500" /> },
                  { label: 'Recruiters', value: stats.recruiters, icon: <Shield className="text-purple-500" /> },
                  { label: 'Active Jobs', value: stats.jobs, icon: <Briefcase className="text-green-500" /> },
                  { label: 'Applications', value: stats.applications, icon: <FileText className="text-orange-500" /> },
                ].map((stat, i) => (
                  <div key={i} className="glass p-8 rounded-3xl border border-white/20 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm">{stat.icon}</div>
                      <span className="text-4xl font-black text-gray-800">{stat.value}</span>
                    </div>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl">
                  <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center space-x-2">
                    <TrendingUp className="text-primary-600" />
                    <span>System Health</span>
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Server Load', value: '12%', color: 'bg-green-500' },
                      { label: 'DB Uptime', value: '99.9%', color: 'bg-blue-500' },
                      { label: 'Storage Usage', value: '4%', color: 'bg-purple-500' },
                    ].map((stat, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold text-gray-600">
                          <span>{stat.label}</span>
                          <span>{stat.value}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className={`${stat.color} h-2 rounded-full`} style={{ width: stat.value }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="glass p-8 rounded-3xl flex flex-col justify-center items-center text-center space-y-4">
                  <div className="bg-orange-100 p-4 rounded-full">
                    <AlertCircle className="text-orange-600 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-gray-800">Platform Moderation</h3>
                  <p className="text-gray-500 text-sm">You have 0 pending flags and 0 reported users today. The system is operating within normal parameters.</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-white/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                          user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' :
                          user.role === 'recruiter' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                          'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        {user.role !== 'admin' && (
                          <button onClick={() => handleDeleteUser(user.id)} className="text-red-400 hover:text-red-600 p-2 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'jobs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Job Title</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Recruiter</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Posted</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobs.map(job => (
                    <tr key={job.id} className="hover:bg-white/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800">{job.title}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{job.location} • {job.type}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">{job.recruiter_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(job.posted_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteJob(job.id)} className="text-red-400 hover:text-red-600 p-2 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
