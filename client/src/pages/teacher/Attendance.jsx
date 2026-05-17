import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { Check, X, Calendar, Search, Loader2 } from 'lucide-react';

const TeacherAttendance = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(null);
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get('/teacher/students');
        setStudents(data.students);
        if (data.teacher.subjects.length > 0) {
          setSubject(data.teacher.subjects[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMark = async (studentId, status) => {
    if (!subject) return alert('Please select a subject first');
    setMarking(studentId);
    try {
      await API.post('/teacher/attendance', {
        studentId,
        subject,
        status,
        date
      });
      // Visual feedback: remove from list or mark as done
      setStudents(prev => prev.filter(s => s._id !== studentId));
    } catch (error) {
      alert('Error marking attendance');
    } finally {
      setMarking(null);
    }
  };

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-slate-100">
      <Sidebar role="teacher" />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Mark Attendance</h2>
            <p className="text-slate-500">Record daily attendance for your students.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-100 shadow-sm p-6 rounded-2xl">
            <div className="space-y-2">
              <label className="text-sm text-slate-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Select Date
              </label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500">Select Subject</label>
              <input 
                type="text" 
                placeholder="e.g. Mathematics" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" 
              />
            </div>
          </div>

          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-50/30 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold">Students List ({students.length})</h3>
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Search..." className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs outline-none" />
              </div>
            </div>
            
            {loading ? (
              <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
            ) : students.length === 0 ? (
              <div className="p-12 text-center text-slate-400 italic">No students left to mark for today.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {students.map((student) => (
                  <div key={student._id} className="p-4 flex items-center justify-between hover:bg-slate-100/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-orange-500 font-bold">
                        {student.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{student.user.name}</p>
                        <p className="text-xs text-slate-500">Roll: {student.admissionNumber} | Class: {student.class}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {marking === student._id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                      ) : (
                        <>
                          <button 
                            onClick={() => handleMark(student._id, 'Present')}
                            className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-slate-800 p-2 rounded-xl transition-all border border-emerald-500/20"
                            title="Present"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleMark(student._id, 'Absent')}
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-slate-800 p-2 rounded-xl transition-all border border-red-500/20"
                            title="Absent"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
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

export default TeacherAttendance;
