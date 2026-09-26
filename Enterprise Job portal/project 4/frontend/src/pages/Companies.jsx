import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Star, Briefcase, Search, ArrowRight, Layout, Users } from 'lucide-react';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', industry: '' });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/companies', { params: filters });
      setCompanies(res.data);
    } catch (err) {
      console.error('Error fetching companies', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest border border-emerald-100"
        >
          <Building2 className="w-4 h-4" />
          <span>Top Employers 2026</span>
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-6xl font-black text-gray-800 tracking-tight"
        >
          Discover Great <span className="text-emerald-600">Workplaces</span>
        </motion.h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group pt-4">
          <div className="glass p-2 rounded-[32px] shadow-2xl flex items-center gap-2 border border-white/40">
            <div className="flex-1 flex items-center px-4 gap-3">
              <Search className="text-gray-400 w-6 h-6" />
              <input 
                type="text" 
                placeholder="Search companies by name..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full py-4 bg-transparent focus:outline-none font-bold text-gray-700"
              />
            </div>
            <button type="submit" className="bg-emerald-600 text-white px-10 py-4 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all">
              Search
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="glass h-80 animate-pulse rounded-[40px]"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.length > 0 ? companies.map((company, i) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[40px] border border-white/20 group hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-emerald-600 font-black text-3xl shadow-sm border border-gray-50 group-hover:scale-110 transition-transform duration-500">
                  {company.name.charAt(0)}
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center text-yellow-500 gap-1 mb-1">
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <span className="font-black text-sm">{company.avg_rating ? company.avg_rating.toFixed(1) : 'New'}</span>
                   </div>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee Rating</span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-800 mb-2 leading-tight group-hover:text-emerald-600 transition-colors">
                {company.name}
              </h3>
              
              <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 gap-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  {company.location}
                </div>
                <div className="flex items-center gap-1.5">
                   <Users className="w-3 h-3 text-emerald-500" />
                   {company.industry}
                </div>
              </div>

              <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-8 flex-1">
                {company.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center text-emerald-600 gap-1.5 font-black text-xs uppercase tracking-widest">
                  <Briefcase className="w-4 h-4" />
                  <span>{company.open_jobs} Openings</span>
                </div>
                <Link 
                  to={`/companies/${company.id}`}
                  className="bg-gray-900 text-white p-3 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
                >
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-20 text-center glass rounded-[40px]">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Layout className="text-gray-300 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-400 uppercase tracking-widest">No Companies Found</h3>
              <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-xs">Be the first to create an employer brand here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Companies;
