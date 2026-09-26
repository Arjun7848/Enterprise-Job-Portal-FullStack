import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Search, MapPin, Briefcase, Filter, Mic, MicOff, TrendingUp, X, ChevronRight, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: 'all',
    minSalary: ''
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/jobs', { params: filters });
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters.type]); // Fetch automatically when type changes

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFilters({ ...filters, search: transcript });
      // Small delay to let user see the transcript before searching
      setTimeout(() => fetchJobs(), 500);
    };
    recognition.start();
  };

  const trending = ['Remote React Developer', 'Product Designer', 'Data Scientist', 'Marketing Intern'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header & Main Search */}
      <div className="text-center mb-16 space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-gray-800 tracking-tight"
        >
          Explore <span className="gradient-text">Opportunities</span>
        </motion.h1>
        
        <div className="max-w-4xl mx-auto relative group">
          <form onSubmit={handleSearch} className="glass p-2 rounded-[32px] shadow-2xl flex items-center gap-2 border border-white/40">
            <div className="flex-1 flex items-center px-4 gap-3">
              <Search className="text-gray-400 w-6 h-6" />
              <input 
                type="text" 
                placeholder="Job title, keywords, or company..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full py-4 bg-transparent focus:outline-none font-bold text-gray-700"
              />
            </div>
            
            <div className="hidden md:flex items-center px-4 border-l border-gray-100 gap-3">
              <MapPin className="text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-32 bg-transparent focus:outline-none font-bold text-gray-700"
              />
            </div>

            <button 
              type="button" 
              onClick={handleVoiceSearch}
              className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {isListening ? <MicOff /> : <Mic />}
            </button>

            <button type="submit" className="bg-primary-600 text-white px-10 py-4 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all">
              Find Jobs
            </button>
          </form>

          {/* Trending Searches */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Trending:
            </span>
            {trending.map((t, i) => (
              <button 
                key={i} 
                onClick={() => { setFilters({...filters, search: t}); }}
                className="text-xs font-bold text-gray-500 hover:text-primary-600 transition-colors bg-white/50 px-3 py-1 rounded-full border border-white"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Advanced Filters Sidebar */}
        <div className="w-full lg:w-72 space-y-8 shrink-0">
          <div>
            <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary-600" />
              <span>Refine Search</span>
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Job Type</p>
                <div className="space-y-2">
                  {['all', 'full-time', 'part-time', 'contract', 'internship'].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="jobType"
                        checked={filters.type === type}
                        onChange={() => setFilters({...filters, type})}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className={`text-sm font-bold capitalize transition-colors ${filters.type === type ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                        {type.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Salary Range (Min)</p>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="e.g. 50k"
                    value={filters.minSalary}
                    onChange={(e) => setFilters({...filters, minSalary: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-gray-100 focus:ring-2 focus:ring-primary-500 font-bold text-sm"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <button 
                  onClick={() => setFilters({ search: '', location: '', type: 'all', minSalary: '' })}
                  className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-800 tracking-tight">
              {jobs.length} Results Found
            </h2>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <span>Sort by:</span>
              <select className="bg-transparent border-none focus:ring-0 text-primary-600 font-black uppercase tracking-widest cursor-pointer">
                <option>Newest First</option>
                <option>Salary High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="glass h-72 animate-pulse rounded-[40px]"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.length > 0 ? jobs.map((job, i) => (
                <motion.div 
                  key={job.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="glass p-8 rounded-[40px] border border-white/20 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-primary-600 font-black text-2xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                      {job.company_name?.charAt(0) || 'J'}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                      {job.type}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-gray-800 mb-2 leading-tight group-hover:text-primary-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-500 font-bold text-sm mb-6 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {job.company_name}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mb-8">
                      <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-xl">
                        <MapPin className="w-3 h-3 mr-1 text-primary-500" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-xl">
                        <DollarSign className="w-3 h-3 mr-1 text-primary-500" />
                        {job.salary_range}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {new Date(job.posted_at).toLocaleDateString()}
                    </span>
                    <Link 
                      to={`/jobs/${job.id}`} 
                      className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl active:scale-95"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )) : (
                <div className="col-span-full py-20 text-center glass rounded-[40px]">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-gray-300 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-400 uppercase tracking-widest">No Jobs Found</h3>
                  <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-xs">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListings;

