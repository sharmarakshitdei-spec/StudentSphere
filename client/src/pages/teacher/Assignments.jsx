import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { BookOpen, Send, Calendar, Loader2 } from 'lucide-react';

const TeacherAssignments = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    description: '',
    deadline: '',
    studentClass: ''
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/teacher/assignments', formData);
      alert('Assignment uploaded successfully');
      setFormData({ subject: '', title: '', description: '', deadline: '', studentClass: '' });
    } catch (error) {
      alert('Error uploading assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-slate-100">
      <Sidebar role="teacher" />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Post New Assignment</h2>
            <p className="text-slate-500">Create a new task for your students to complete.</p>
          </div>

          <div className="bg-white border border-slate-100 shadow-sm p-8 rounded-3xl shadow-2xl">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-slate-500">Subject</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" 
                    placeholder="e.g. History"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-500">Target Class</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" 
                    placeholder="e.g. 10th Grade"
                    value={formData.studentClass}
                    onChange={(e) => setFormData({...formData, studentClass: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-500">Assignment Title</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" 
                  placeholder="e.g. World War II Essay"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-500">Description / Instructions</label>
                <textarea 
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 h-32 resize-none" 
                  placeholder="Provide detailed instructions for the assignment..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Submission Deadline
                </label>
                <input 
                  type="date" 
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" 
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-500 text-slate-800 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-600/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Post Assignment</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignments;
