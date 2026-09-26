import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Globe, MapPin, Users, Calendar, Star, MessageSquare, Briefcase, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CompanyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      const res = await axios.get(`/api/companies/${id}`);
      setCompany(res.data);
    } catch (err) {
      console.error('Error fetching company', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to leave a review.');
    try {
      await axios.post('/api/companies/reviews', { company_id: id, ...newReview });
      setNewReview({ rating: 5, comment: '' });
      fetchCompany();
      alert('Review submitted!');
    } catch (err) {
      alert('Review failed.');
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-20 animate-pulse bg-gray-50 h-screen rounded-[40px]"></div>;
  if (!company) return <div className="text-center py-20 font-black text-gray-400">Company not found.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <Link to="/companies" className="inline-flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-emerald-600 transition-colors mb-12">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discovery</span>
      </Link>

      <div className="space-y-12">
        {/* Header Profile */}
        <div className="glass p-12 rounded-[60px] border border-white/20 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
            <div className="w-40 h-40 bg-white rounded-[40px] flex items-center justify-center text-emerald-600 font-black text-6xl shadow-2xl border-8 border-emerald-50 shrink-0">
               {company.name.charAt(0)}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-6">
               <div className="space-y-2">
                 <h1 className="text-4xl md:text-6xl font-black text-gray-800 tracking-tight">{company.name}</h1>
                 <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                    <div className="flex items-center text-sm font-bold text-gray-500 uppercase tracking-widest gap-2">
                       <MapPin className="w-4 h-4 text-emerald-500" />
                       {company.location}
                    </div>
                    <div className="flex items-center text-sm font-bold text-gray-500 uppercase tracking-widest gap-2">
                       <Globe className="w-4 h-4 text-emerald-500" />
                       <a href={company.website} target="_blank" rel="noreferrer" className="hover:text-emerald-600 underline">Website</a>
                    </div>
                    <div className="flex items-center text-sm font-bold text-gray-500 uppercase tracking-widest gap-2">
                       <Users className="w-4 h-4 text-emerald-500" />
                       {company.employee_count} Employees
                    </div>
                 </div>
               </div>

               <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-emerald-50 border border-emerald-100 px-6 py-2 rounded-2xl flex items-center gap-3">
                     <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                     <span className="text-xl font-black text-emerald-800">{company.avg_rating ? company.avg_rating.toFixed(1) : '0.0'}</span>
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">({company.review_count} Reviews)</span>
                  </div>
                  <div className="bg-primary-50 border border-primary-100 px-6 py-2 rounded-2xl flex items-center gap-3">
                     <Briefcase className="w-5 h-5 text-primary-500" />
                     <span className="text-xl font-black text-primary-800">{company.jobs?.length}</span>
                     <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Open Positions</span>
                  </div>
               </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
                {/* About & Culture */}
                <section className="space-y-8">
                   <div className="glass p-10 rounded-[50px] space-y-8 border border-white/20">
                      <div>
                        <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-4">About the Company</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">{company.description}</p>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-4">Our Culture</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">{company.culture || "We believe in innovation, transparency, and building products that make a difference. Our team is our greatest asset."}</p>
                      </div>
                   </div>
                </section>

                {/* Open Positions */}
                <section className="space-y-8">
                   <h3 className="text-3xl font-black text-gray-800 uppercase tracking-tighter flex items-center gap-3">
                      <Briefcase className="text-emerald-500" />
                      <span>Current Opportunities</span>
                   </h3>
                   <div className="space-y-4">
                      {company.jobs?.map((job, i) => (
                        <Link to={`/jobs/${job.id}`} key={job.id} className="block group">
                           <div className="glass p-8 rounded-[40px] border border-white/20 flex items-center justify-between group-hover:bg-white group-hover:shadow-2xl transition-all duration-500">
                              <div>
                                 <h4 className="text-xl font-black text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">{job.title}</h4>
                                 <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>{job.location}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                    <span>{job.type}</span>
                                 </div>
                              </div>
                              <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all" />
                           </div>
                        </Link>
                      ))}
                   </div>
                </section>
            </div>

            {/* Reviews Sidebar */}
            <div className="space-y-8">
                <section className="glass p-8 rounded-[50px] border border-white/20 space-y-8">
                   <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter flex items-center gap-3">
                      <Star className="text-yellow-500 fill-yellow-500" />
                      <span>Employee Reviews</span>
                   </h3>

                   {user && (
                     <form onSubmit={handleReviewSubmit} className="bg-white/50 p-6 rounded-[32px] space-y-4 border border-white">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate Experience</span>
                           <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} type="button" onClick={() => setNewReview({...newReview, rating: star})}>
                                   <Star className={`w-4 h-4 ${newReview.rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'}`} />
                                </button>
                              ))}
                           </div>
                        </div>
                        <textarea 
                           value={newReview.comment}
                           onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                           placeholder="Share your experience working here..."
                           rows="3"
                           className="w-full bg-white rounded-2xl p-4 text-sm font-bold border border-gray-100 focus:ring-2 focus:ring-emerald-500"
                        ></textarea>
                        <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all">Submit Review</button>
                     </form>
                   )}

                   <div className="space-y-6">
                      {company.reviews?.map((review, i) => (
                        <div key={review.id} className="space-y-3 pb-6 border-b border-gray-50 last:border-0">
                           <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-black text-[10px] text-gray-500">{review.user_name?.charAt(0)}</div>
                                 <span className="text-xs font-black text-gray-800">{review.user_name}</span>
                              </div>
                              <div className="flex items-center text-yellow-500 gap-0.5">
                                 <Star className="w-3 h-3 fill-yellow-500" />
                                 <span className="text-[10px] font-black">{review.rating.toFixed(1)}</span>
                              </div>
                           </div>
                           <p className="text-xs text-gray-500 font-medium leading-relaxed italic">"{review.comment}"</p>
                        </div>
                      ))}
                      {!company.reviews?.length && <p className="text-center text-gray-400 font-bold uppercase tracking-widest text-[10px] py-10">No reviews yet.</p>}
                   </div>
                </section>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyDetails;
