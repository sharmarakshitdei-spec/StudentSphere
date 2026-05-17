import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { Calendar, Check, X, Loader2, User } from 'lucide-react';

const TeacherLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const { data } = await API.get('/teacher/leaves');
      setLeaves(data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/teacher/leaves/${id}`, { status });
      fetchLeaves();
    } catch (error) {
      alert('Error updating leave status');
    }
  };

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-slate-100">
      <Sidebar role="teacher" />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Leave Applications</h2>
            <p className="text-slate-500">Review and manage student leave requests.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
            ) : leaves.length === 0 ? (
              <div className="col-span-full text-center p-12 text-slate-500 bg-white border border-slate-100 shadow-sm rounded-3xl border-dashed italic">No leave applications found.</div>
            ) : (
              leaves.map((leave) => (
                <div key={leave._id} className="bg-white border border-slate-100 shadow-sm p-6 rounded-3xl space-y-4 hover:border-slate-200 transition-all shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold">{leave.student.user.name}</p>
                        <p className="text-xs text-slate-500">Applied on {new Date(leave.appliedOn).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                      leave.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {leave.status}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-sm text-slate-600 italic">"{leave.reason}"</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> From: {new Date(leave.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> To: {new Date(leave.endDate).toLocaleDateString()}
                    </div>
                  </div>

                  {leave.status === 'Pending' && (
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-800 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-slate-800 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLeaves;
