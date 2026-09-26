import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Briefcase, DollarSign, Calendar,
  ShieldCheck, ArrowLeft, Send, BarChart2, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error('Error fetching job', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setApplying(true);
    try {
      await axios.post('/api/applications', { job_id: id });
      setApplied(true);
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to submit application. Please try again.';
      alert(message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Job not found</h2>
          <p className="text-gray-500 mb-6">The job you are looking for does not exist.</p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  // Sidebar content depends on role
  const isSeeker = !user || user.role === 'seeker';
  const isRecruiter = user?.role === 'recruiter';
  const isMyJob = isRecruiter && job.recruiter_id === user?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-10"
    >
      <div className="max-w-7xl mx-auto px-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-primary-600 font-semibold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Jobs
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Job Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">{job.title}</h1>
                    <p className="text-base font-bold text-primary-600">{job.company_name || job.company}</p>
                  </div>
                </div>
                <span className="inline-block bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest self-start">
                  {job.type || job.job_type || 'Full Time'}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                {[
                  { icon: <MapPin className="w-4 h-4 text-gray-400" />, label: 'Location', value: job.location || 'Remote' },
                  { icon: <DollarSign className="w-4 h-4 text-gray-400" />, label: 'Salary', value: job.salary_range || job.salary || 'Competitive' },
                  { icon: <Briefcase className="w-4 h-4 text-gray-400" />, label: 'Experience', value: job.experience || 'Not specified' },
                  { icon: <Calendar className="w-4 h-4 text-gray-400" />, label: 'Posted', value: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-700">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-5">Job Description</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                {job.description || 'No description provided.'}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-5">Requirements</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                {job.requirements || 'No specific requirements provided.'}
              </div>
            </div>

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 mb-5">Benefits</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{job.benefits}</div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* SEEKER: Apply Panel */}
            {isSeeker && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-5">Apply for this position</h3>

                {applied ? (
                  <div className="text-center py-4">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Send className="w-7 h-7 text-green-600" />
                    </div>
                    <p className="font-bold text-green-700 mb-1">Application Submitted!</p>
                    <p className="text-sm text-gray-400">You'll be notified about your status.</p>
                    <Link to="/seeker" className="text-primary-600 font-bold text-sm mt-3 inline-block hover:underline">
                      Track in Dashboard →
                    </Link>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-200 mb-3"
                    >
                      <Send className="w-4 h-4" />
                      {applying ? 'Submitting…' : 'Apply Now'}
                    </button>
                    {!user && (
                      <p className="text-center text-xs text-gray-400 font-medium">
                        <Link to="/login" className="text-primary-600 font-bold hover:underline">Login</Link> to apply for this job
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* RECRUITER: Job Stats Panel */}
            {isRecruiter && isMyJob && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-primary-500" />
                  Job Insights
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-600">Total Applicants</span>
                    <span className="font-black text-gray-900">{job.application_count ?? '—'}</span>
                  </div>
                  <Link
                    to="/recruiter"
                    className="flex items-center justify-between p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors group"
                  >
                    <span className="text-sm font-bold text-primary-700">View All Applications</span>
                    <Users className="w-4 h-4 text-primary-500 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}

            {/* RECRUITER: informational notice (not their job) */}
            {isRecruiter && !isMyJob && (
              <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
                <p className="text-sm font-semibold text-amber-700 text-center">
                  This job was posted by another recruiter. Only job seekers can apply.
                </p>
              </div>
            )}

            {/* Job Safety — always shown */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                <h3 className="font-black text-gray-900">Job Safety</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Never share sensitive personal or financial information with an employer during the application process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobDetails;