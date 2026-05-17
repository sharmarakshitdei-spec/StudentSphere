import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { Users, Loader2, ArrowLeftRight } from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

const TeacherComparison = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [s1, setS1] = useState('');
  const [s2, setS2] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [comparing, setComparing] = useState(false);

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

  const handleCompare = async () => {
    if (!s1 || !s2) return alert('Select two students to compare');
    setComparing(true);
    try {
      const { data } = await API.post('/teacher/compare', { student1Id: s1, student2Id: s2 });
      setComparisonData(data);
    } catch (error) {
      alert('Error comparing students');
    } finally {
      setComparing(false);
    }
  };

  const prepareRadarData = () => {
    if (!comparisonData) return [];
    const subjects = [...new Set([...comparisonData.student1.results, ...comparisonData.student2.results].map(r => r.subject))];
    return subjects.map(sub => ({
      subject: sub,
      [comparisonData.student1.name]: comparisonData.student1.results.find(r => r.subject === sub)?.marks || 0,
      [comparisonData.student2.name]: comparisonData.student2.results.find(r => r.subject === sub)?.marks || 0,
      fullMark: 100
    }));
  };

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-slate-100">
      <Sidebar role="teacher" />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Student Comparison</h2>
            <p className="text-slate-500">Compare academic and attendance performance between two students.</p>
          </div>

          <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 shadow-xl">
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs text-slate-500 uppercase font-bold tracking-wider ml-1">Student 1</label>
              <select 
                value={s1} 
                onChange={(e) => setS1(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 appearance-none"
              >
                <option value="">Select Student</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.user.name}</option>)}
              </select>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-full text-slate-500 mt-6">
              <ArrowLeftRight className="w-6 h-6" />
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="text-xs text-slate-500 uppercase font-bold tracking-wider ml-1">Student 2</label>
              <select 
                value={s2} 
                onChange={(e) => setS2(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 appearance-none"
              >
                <option value="">Select Student</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.user.name}</option>)}
              </select>
            </div>

            <button 
              onClick={handleCompare}
              disabled={comparing}
              className="mt-6 px-8 py-3 bg-orange-600 hover:bg-orange-500 text-slate-800 font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50"
            >
              {comparing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Compare'}
            </button>
          </div>

          {comparisonData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-100 shadow-sm p-8 rounded-3xl h-[450px]">
                <h3 className="text-lg font-bold mb-8 text-center text-slate-600">Subject-wise Marks</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={prepareRadarData()}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name={comparisonData.student1.name} dataKey={comparisonData.student1.name} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Radar name={comparisonData.student2.name} dataKey={comparisonData.student2.name} stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border border-slate-100 shadow-sm p-8 rounded-3xl h-[450px]">
                <h3 className="text-lg font-bold mb-8 text-center text-slate-600">Overall Metrics</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Attendance %', [comparisonData.student1.name]: comparisonData.student1.attendanceRate, [comparisonData.student2.name]: comparisonData.student2.attendanceRate },
                    { name: 'Avg Marks', [comparisonData.student1.name]: comparisonData.student1.avgMarks, [comparisonData.student2.name]: comparisonData.student2.avgMarks },
                  ]}>
                    <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey={comparisonData.student1.name} fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey={comparisonData.student2.name} fill="#a855f7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherComparison;
