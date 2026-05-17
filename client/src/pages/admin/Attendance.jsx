import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import API from '../../services/api';
import { CalendarCheck, Search, Filter, Loader2, ArrowUpRight } from 'lucide-react';

const Attendance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data } = await API.get('/admin/attendance');
        setLogs(data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const nameMatch = log.student?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      log.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'All' || log.status === statusFilter;
    return nameMatch && statusMatch;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Attendance Logs</h2>
          <p className="text-slate-500 text-sm">School-wide real-time tracking of student lecture and class attendance.</p>
        </div>

        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search by student or subject..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              >
                <option value="All">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Class</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Marked By</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{log.student?.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">{log.student?.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{log.student?.class || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{log.subject}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {log.date ? new Date(log.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{log.teacher?.user?.name || 'System'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          log.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10' :
                          log.status === 'Absent' ? 'bg-red-500/20 text-red-400 border border-red-500/10' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/10'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400 italic">
                      No attendance records found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Attendance;
