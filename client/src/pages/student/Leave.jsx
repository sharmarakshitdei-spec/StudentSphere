import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Calendar, Send, Loader2, ArrowLeft, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    startDate: '',
    endDate: ''
  });

  const fetchData = async () => {
    try {
      const { data } = await API.get('/student/dashboard');
      setLeaves(data.leaves);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/student/leave', formData);
      alert('Leave application submitted!');
      setFormData({ reason: '', startDate: '', endDate: '' });
      fetchData();
    } catch (error) {
      alert('Error submitting leave');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/student" className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Leave Management</h1>
            <p className="text-slate-500">Apply for leave and track your requests.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-100 shadow-sm p-8 rounded-3xl shadow-2xl sticky top-8">
              <h3 className="text-xl font-bold mb-6">New Application</h3>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-500">Reason</label>
                  <textarea 
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 h-32 resize-none" 
                    placeholder="e.g. Medical reasons..."
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    required
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-500">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-500">End Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" 
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-slate-800 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Submit Application</>}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold">Your Requests</h3>
            {loading ? (
              <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
            ) : leaves.length === 0 ? (
              <div className="text-center p-12 bg-white border border-slate-100 shadow-sm border-dashed rounded-3xl italic text-slate-500">No applications found.</div>
            ) : (
              <div className="space-y-4">
                {leaves.map((leave) => (
                  <div key={leave._id} className="bg-white border border-slate-100 shadow-sm p-6 rounded-3xl flex items-center justify-between hover:border-slate-200 transition-all">
                    <div className="space-y-2">
                      <p className="font-medium">"{leave.reason}"</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${
                        leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                        leave.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {leave.status === 'Approved' ? <CheckCircle2 className="w-4 h-4" /> :
                         leave.status === 'Rejected' ? <XCircle className="w-4 h-4" /> :
                         <Clock className="w-4 h-4" />}
                        {leave.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLeave;
