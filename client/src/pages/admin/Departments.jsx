import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import API from '../../services/api';
import { BookOpen, Users, UserSquare2, ArrowUpRight, Loader2 } from 'lucide-react';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await API.get('/admin/departments');
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

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
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Departments Management</h2>
          <p className="text-slate-500">Overview of all active departments, student enrolments, and faculty sizes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.length > 0 ? (
            departments.map((dept) => (
              <div key={dept.name} className="bg-white border border-slate-100 shadow-sm p-6 rounded-2xl hover:border-slate-200 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-2xl rounded-full group-hover:bg-blue-600/10 transition-all"></div>
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-blue-600/10 p-3 rounded-xl">
                    <BookOpen className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase bg-slate-50 px-2.5 py-1 rounded-full">Active</span>
                </div>
                <h3 className="text-slate-800 text-lg font-bold mb-4">{dept.name}</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100/50">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Users className="w-4 h-4" />
                      <span>Total Students</span>
                    </div>
                    <span className="text-slate-800 font-bold text-sm">{dept.students}</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <UserSquare2 className="w-4 h-4" />
                      <span>Faculty Size</span>
                    </div>
                    <span className="text-slate-800 font-bold text-sm">{dept.teachers}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100/80">
                  <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, ((dept.students + dept.teachers) / 20) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-right">Capacity Indicator</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white border border-slate-100 shadow-sm p-8 rounded-2xl text-center">
              <p className="text-slate-400 italic">No departments have been initialized or assigned yet.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Departments;
