import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Briefcase, Users, Building2, ArrowRight,
  CheckCircle, Sparkles, TrendingUp, Shield, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STATS = [
  { value: '10,000+', label: 'Active Jobs' },
  { value: '5,000+', label: 'Companies' },
  { value: '50,000+', label: 'Candidates' },
  { value: '98%', label: 'Satisfaction' },
];

const STEPS = [
  {
    step: '01',
    icon: <Search className="w-6 h-6 text-primary-600" />,
    title: 'Search & Discover',
    desc: 'Browse thousands of job opportunities filtered by your skills, location, and preferences.',
  },
  {
    step: '02',
    icon: <Briefcase className="w-6 h-6 text-primary-600" />,
    title: 'Apply Instantly',
    desc: 'One-click applications let you apply to multiple jobs quickly and track each one.',
  },
  {
    step: '03',
    icon: <CheckCircle className="w-6 h-6 text-primary-600" />,
    title: 'Get Hired',
    desc: 'Connect with recruiters, attend interviews, and land your dream role.',
  },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-indigo-900 text-white">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                AI-powered job matching
              </div>

              <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6">
                Find the job
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-indigo-300">
                  you deserve.
                </span>
              </h1>

              <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-xl">
                Connect with great companies, discover meaningful opportunities,
                and take the next step in your career — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-7 py-4 rounded-2xl font-black hover:bg-gray-50 transition-all shadow-xl"
                >
                  <Search className="w-5 h-5" />
                  Browse Jobs
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-7 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all"
                  >
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div>

              {/* Stats ticker */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14">
                {STATS.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-2xl font-black text-white">{s.value}</p>
                    <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-8 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg">Your Career, Simplified</h3>
                    <p className="text-white/50 text-sm">Everything you need to get hired</p>
                  </div>
                </div>

                {[
                  { icon: <Search className="w-4 h-4 text-primary-300" />, text: 'Search thousands of job opportunities' },
                  { icon: <Briefcase className="w-4 h-4 text-primary-300" />, text: 'Apply to jobs quickly and easily' },
                  { icon: <Clock className="w-4 h-4 text-primary-300" />, text: 'Track your application status live' },
                  { icon: <Users className="w-4 h-4 text-primary-300" />, text: 'Connect directly with recruiters' },
                  { icon: <Shield className="w-4 h-4 text-primary-300" />, text: 'Safe, verified job listings only' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="w-8 h-8 bg-primary-600/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-sm font-semibold text-white/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary-600 font-black text-xs uppercase tracking-widest">Simple Process</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">How it works</h2>
            <p className="text-gray-500 leading-relaxed">
              From searching to getting hired — we've made the process seamless in just three steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                whileHover={{ y: -6 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group"
              >
                <span className="absolute top-6 right-6 text-6xl font-black text-gray-50 select-none group-hover:text-primary-50 transition-colors">
                  {step.step}
                </span>
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary-600 font-black text-xs uppercase tracking-widest">Platform Features</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">A better way to find your next job</h2>
            <p className="text-gray-500 leading-relaxed">
              Tools built for both job seekers and recruiters to make every hiring interaction count.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-7 h-7 text-primary-600" />,
                bg: 'bg-primary-50',
                title: 'Find Jobs',
                desc: 'Search and explore job opportunities based on your skills, experience, and location.',
                link: '/jobs',
                linkLabel: 'Browse Jobs',
              },
              {
                icon: <Building2 className="w-7 h-7 text-indigo-600" />,
                bg: 'bg-indigo-50',
                title: 'Explore Companies',
                desc: 'Discover companies that match your values and career interests.',
                link: '/companies',
                linkLabel: 'View Companies',
              },
              {
                icon: <Users className="w-7 h-7 text-green-600" />,
                bg: 'bg-green-50',
                title: 'Connect & Apply',
                desc: 'Apply quickly, chat with recruiters, and manage your career from one dashboard.',
                link: user ? (user.role === 'seeker' ? '/seeker' : '/recruiter') : '/register',
                linkLabel: user ? 'Go to Dashboard' : 'Create Account',
              },
            ].map((feat) => (
              <motion.div
                key={feat.title}
                whileHover={{ y: -5 }}
                className="bg-gray-50 rounded-3xl p-8 border border-gray-100 group"
              >
                <div className={`w-14 h-14 ${feat.bg} rounded-2xl flex items-center justify-center mb-6`}>
                  {feat.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{feat.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6 text-sm">{feat.desc}</p>
                <Link
                  to={feat.link}
                  className="inline-flex items-center gap-2 text-primary-600 font-bold text-sm group-hover:gap-3 transition-all"
                >
                  {feat.linkLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Ready to find your next opportunity?
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of professionals who found their dream jobs through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-2xl font-black hover:bg-gray-50 transition-all shadow-xl"
              >
                <Search className="w-5 h-5" />
                Explore Jobs
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all"
                >
                  Sign Up Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;