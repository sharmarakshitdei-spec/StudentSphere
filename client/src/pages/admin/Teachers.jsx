import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import API from '../../services/api';
import { UserPlus, Search, Filter, MoreVertical, Plus, X } from 'lucide-react';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    employeeId: '',
    department: '',
  });

  const fetchTeachers = async () => {
    try {
      const { data } = await API.get('/admin/teachers');
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/teachers', formData);
      setIsModalOpen(false);
      fetchTeachers();
      setFormData({
        name: '',
        email: '',
        password: 'password123',
        employeeId: '',
        department: '',
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding teacher');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Teacher Management</h2>
            <p className="text-slate-500 text-sm">Manage all faculty members and departments.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-500 text-slate-800 px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-orange-600/20"
          >
            <Plus className="w-5 h-5" /> Add Teacher
          </button>
        </div>

        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search faculty..." 
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-800 transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Teacher Name</th>
                  <th className="px-6 py-4">Employee ID</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-xs">
                          {teacher.user?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{teacher.user?.name}</p>
                          <p className="text-xs text-slate-500">{teacher.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{teacher.employeeId}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{teacher.department}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-700 rounded-lg transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 shadow-sm w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add New Teacher</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-500">Full Name</label>
                  <input name="name" onChange={onChange} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-500">Email Address</label>
                  <input type="email" name="email" onChange={onChange} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-500">Employee ID</label>
                  <input name="employeeId" onChange={onChange} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-500">Department</label>
                  <input name="department" onChange={onChange} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" required />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all">Cancel</button>
                <button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-500 text-slate-800 px-4 py-2 rounded-xl transition-all shadow-lg shadow-orange-600/20">Add Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Teachers;
