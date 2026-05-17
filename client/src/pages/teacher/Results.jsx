import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { Trophy, Send, Search, Loader2 } from 'lucide-react';

const TeacherResults = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    marks: '',
    totalMarks: 100,
    remarks: ''
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await API.get('/teacher/students');
        setStudents(data.students);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return alert('Select a student first');
    try {
      await API.post('/teacher/results', {
        studentId: selectedStudent._id,
        ...formData
      });
      alert('Result uploaded successfully');
      setSelectedStudent(null);
      setFormData({ subject: '', marks: '', totalMarks: 100, remarks: '' });
    } catch (error) {
      alert('Error uploading result');
    }
  };

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-slate-100">
      <Sidebar role="teacher" />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto flex gap-8">
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Result Management</h2>
              <p className="text-slate-500">Upload marks and grades for your class.</p>
            </div>

            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-50/30 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-sm">Select Student</h3>
                <div className="relative w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="Search..." className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs outline-none" />
                </div>
              </div>
              
              <div className="h-[500px] overflow-y-auto divide-y divide-slate-100">
                {loading ? (
                  <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
                ) : (
                  students.map((student) => (
                    <div 
                      key={student._id} 
                      onClick={() => setSelectedStudent(student)}
                      className={`p-4 flex items-center gap-4 cursor-pointer transition-all ${
                        selectedStudent?._id === student._id ? 'bg-blue-600/20 border-l-4 border-blue-500' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-orange-500 font-bold">
                        {student.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{student.user.name}</p>
                        <p className="text-xs text-slate-500">Roll: {student.admissionNumber}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="w-96">
            {selectedStudent ? (
              <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 sticky top-24 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold">Upload Marks</h3>
                  <p className="text-slate-500 text-sm">for {selectedStudent.user.name}</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-500">Subject</label>
                    <input 
                      type="text" 
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-500" 
                      placeholder="e.g. Physics"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-500">Obtained Marks</label>
                      <input 
                        type="number" 
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-500" 
                        value={formData.marks}
                        onChange={(e) => setFormData({...formData, marks: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-500">Total Marks</label>
                      <input 
                        type="number" 
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-500" 
                        value={formData.totalMarks}
                        onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-500">Remarks (Optional)</label>
                    <textarea 
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-500 h-24 resize-none" 
                      placeholder="Excellent performance..."
                      value={formData.remarks}
                      onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20">
                    <Send className="w-4 h-4" /> Submit Result
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 shadow-sm border-dashed rounded-2xl p-12 text-center h-[500px] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-slate-500 text-sm">Select a student from the list to start uploading marks.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherResults;
