import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import NotificationCenter from '../components/NotificationCenter';
import { 
  Users, 
  UserSquare2, 
  CalendarCheck, 
  Trophy, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Loader2,
  Settings,
  LogOut
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const data = [
  { name: 'Mon', attendance: 85 },
  { name: 'Tue', attendance: 88 },
  { name: 'Wed', attendance: 92 },
  { name: 'Thu', attendance: 90 },
  { name: 'Fri', attendance: 87 },
];

const performanceData = [
  { name: 'Jan', score: 65 },
  { name: 'Feb', score: 72 },
  { name: 'Mar', score: 68 },
  { name: 'Apr', score: 85 },
  { name: 'May', score: 90 },
];

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    avgAttendance: 0,
    attendanceData: [],
    performanceData: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Total Teachers', value: stats.totalTeachers, icon: UserSquare2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Avg Attendance', value: `${stats.avgAttendance}%`, icon: CalendarCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Active Events', value: '0', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500">Welcome back, here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <div key={card.name} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bg} p-3 rounded-xl`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">{card.name}</h3>
              <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-800">Attendance Analytics</h3>
            </div>
            <div className="h-64 flex items-center justify-center">
              {stats.attendanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500 italic">No attendance data available yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-800">Academic Performance</h3>
            </div>
            <div className="h-64 flex items-center justify-center">
              {stats.performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.performanceData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a6a3ab" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500 italic">No performance records available yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export const TeacherDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [leavesCount, setLeavesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [studentsRes, leavesRes] = await Promise.all([
          API.get('/teacher/students'),
          API.get('/teacher/leaves')
        ]);
        setProfile(studentsRes.data.teacher);
        setStudents(studentsRes.data.students || []);
        
        const pendingLeaves = (leavesRes.data || []).filter(l => l.status === 'Pending').length;
        setLeavesCount(pendingLeaves);
      } catch (error) {
        console.error('Error fetching teacher dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const filteredStudents = students.filter(s => 
    s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout role="teacher">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </AdminLayout>
    );
  }

  // Dashboard Stat Cards
  const cards = [
    { name: 'Total Assigned Students', value: students.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Pending Leave Requests', value: leavesCount, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Employee ID', value: profile?.employeeId || 'N/A', icon: UserSquare2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Department', value: profile?.department || 'N/A', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <AdminLayout role="teacher">
      <div className="space-y-8 p-1">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h2>
            <p className="text-slate-500 text-sm">Welcome back! Manage your assigned classes and student requests below.</p>
          </div>
          <div className="bg-white border border-slate-100 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Faculty Profile:</span>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800">Exp: {profile?.experience || 0} Years</p>
              <p className="text-[10px] text-slate-500">{profile?.qualification || 'Qualified Instructor'}</p>
            </div>
          </div>
        </header>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div key={card.name} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 group relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bg} p-3 rounded-xl`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">{card.name}</h3>
              <p className="text-xl font-bold text-slate-800 mt-1 truncate">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Subjects & Student Roster Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Roster (Left, larger col) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:shadow-orange-500/5 transition-all duration-300">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">Assigned Student Roster</h3>
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 pl-4 pr-10 py-2 rounded-xl text-xs outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Student Name</th>
                      <th className="px-6 py-4">Roll Number</th>
                      <th className="px-6 py-4">Class</th>
                      <th className="px-6 py-4">Enrolment Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((s) => (
                        <tr key={s._id} className="hover:bg-slate-50 transition-all">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-xs">
                                {s.user?.name?.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-800">{s.user?.name || 'N/A'}</p>
                                <p className="text-xs text-slate-500">{s.user?.email || ''}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{s.admissionNumber}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{s.class}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500 italic">
                          No assigned students found in your department.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Subjects and Links Panel (Right, smaller col) */}
          <div className="space-y-8">
            {/* Subjects Card */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:shadow-orange-500/5 transition-all duration-300">
              <h3 className="text-lg font-bold mb-4 text-slate-800">My Taught Subjects</h3>
              <div className="space-y-3">
                {profile?.subjects?.length > 0 ? (
                  profile.subjects.map((sub, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">{sub}</span>
                      <span className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/20 px-2 py-1 rounded">Active</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs italic text-slate-500">No subjects currently assigned to you.</p>
                )}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-3xl shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300 text-white">
              <h3 className="text-lg font-bold mb-2">Faculty Quick Tools</h3>
              <p className="text-orange-100 text-xs mb-6">Manage lecture records, grading systems, and study tracks.</p>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/teacher/attendance" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl text-center text-xs font-semibold transition-all">Mark Attendance</Link>
                <Link to="/teacher/results" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl text-center text-xs font-semibold transition-all">Upload Grades</Link>
                <Link to="/teacher/assignments" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl text-center text-xs font-semibold transition-all">Assignments</Link>
                <Link to="/teacher/leaves" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl text-center text-xs font-semibold transition-all">Leaves Center</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    class: '',
    admissionNumber: ''
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await API.get('/student/dashboard');
        setData(data);
        // Removed auto-popup for incomplete profile as it is now handled during signup
      } catch (error) {
        console.error('Error fetching student dashboard:', error);
        setData({
          student: { user: {} },
          attendanceRate: 0,
          recommendations: [],
          results: [],
          attendance: [],
          assignments: []
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put('/student/profile', profileForm);
      setShowProfileModal(false);
      window.location.reload(); // Refresh to get updated data
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating profile');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;

  return (
    <div className="bg-transparent min-h-screen text-slate-900 p-8">
      {/* Profile Completion Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Complete Your Profile</h2>
            <p className="text-slate-500 mb-6 text-sm">Please provide your details to access all features.</p>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-600 ml-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 ml-1">Class (e.g. 10th-A)</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                  value={profileForm.class}
                  onChange={(e) => setProfileForm({...profileForm, class: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 ml-1">Admission/Roll Number</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 text-slate-900"
                  value={profileForm.admissionNumber}
                  onChange={(e) => setProfileForm({...profileForm, admissionNumber: e.target.value})}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-lg shadow-orange-600/20"
              >
                Save & Continue
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">Hello, {data?.student?.user?.name || 'User'}! 👋</h1>
              <button 
                onClick={() => {
                  setProfileForm({
                    name: data?.student?.user?.name || '',
                    class: data?.student?.class || '',
                    admissionNumber: data?.student?.admissionNumber || ''
                  });
                  setShowProfileModal(true);
                }}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-blue-400 transition-all"
                title="Edit Profile"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-600">Class: {data?.student?.class || 'N/A'} | Roll No: {data?.student?.admissionNumber || 'N/A'}</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/student/leave" className="bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-sm font-medium transition-all">
              Apply Leave
            </Link>
            <button 
              onClick={() => {
                dispatch(logout());
                navigate('/login');
              }}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Attendance</p>
                <p className="text-lg font-bold text-slate-800">{data?.attendanceRate || 0}%</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Global Rank</p>
                <p className="text-lg font-bold text-slate-800">#14</p>
              </div>
            </div>
          </div>
        </header>

        {/* AI Recommendations */}
        {data?.recommendations?.length > 0 && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <TrendingUp className="w-24 h-24 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Smart Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.recommendations.map((rec, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-orange-200/50">
                  <p className="text-sm font-medium text-slate-800">{rec.message}</p>
                  <p className="text-xs text-slate-600 mt-1 capitalize">Focus Area: {rec.focus}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:shadow-orange-500/5 transition-all duration-300">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Recent Academic Results</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Marks</th>
                      <th className="px-6 py-4">Grade</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data?.results?.map((res) => (
                      <tr key={res._id} className="hover:bg-slate-50 transition-all">
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">{res.subject}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{res.marks}/{res.totalMarks}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            res.grade === 'A+' ? 'bg-emerald-500/10 text-emerald-600' :
                            res.grade === 'A' ? 'bg-blue-500/10 text-blue-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {res.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium ${res.marks >= 40 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {res.marks >= 40 ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:shadow-orange-500/5 transition-all duration-300">
              <h3 className="text-lg font-bold mb-6 text-slate-800">Attendance Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.attendance?.slice(-10) || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={(str) => str ? new Date(str).toLocaleDateString() : ''} stroke="#64748b" fontSize={10} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="status" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-lg font-bold mb-6 text-slate-800">Personal Profile</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 text-sm">Admission Date</span>
                  <span className="text-sm font-medium text-slate-700">{data?.student?.createdAt ? new Date(data.student.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 text-sm">Department</span>
                  <span className="text-sm font-medium text-slate-700">{data?.student?.department || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 text-sm">Gender</span>
                  <span className="text-sm font-medium text-slate-700">{data?.student?.gender || 'Not specified'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-3xl shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300 text-white">
              <h3 className="text-lg font-bold mb-2">Sports & Fitness</h3>
              <p className="text-orange-100 text-sm mb-6">Check your sports records and achievements.</p>
              <div className="space-y-3">
                {data?.student?.sportsRecord?.length > 0 ? (
                  data.student.sportsRecord.map((s, i) => (
                    <div key={i} className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                      <p className="text-xs font-bold uppercase tracking-wider text-orange-50">{s.event}</p>
                      <p className="text-sm font-medium">{s.achievement}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs italic text-orange-200">No records found. Join a sports team today!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
