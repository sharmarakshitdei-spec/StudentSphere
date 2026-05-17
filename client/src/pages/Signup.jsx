import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { register, reset } from '../redux/slices/authSlice';
import { UserPlus, Mail, Lock, User, ShieldCheck, Loader2, GraduationCap, BookOpen } from 'lucide-react';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') || 'student';

  const roleConfig = {
    student: { label: 'Student Portal', icon: GraduationCap, color: 'text-orange-600', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
    teacher: { label: 'Teacher Portal', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
    admin: { label: 'Admin Portal', icon: ShieldCheck, color: 'text-violet-600', bg: 'bg-violet-500/20', border: 'border-violet-500/30' },
  };
  const currentRole = roleConfig[roleFromUrl] || roleConfig['student'];
  const RoleIcon = currentRole.icon;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: roleFromUrl,
    studentClass: '',
    admissionNumber: '',
  });

  const { name, email, password, role, studentClass, admissionNumber } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-slate-200 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${currentRole.bg} mb-4 border ${currentRole.border}`}>
            <RoleIcon className={`w-8 h-8 ${currentRole.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">{currentRole.label}</h1>
          <p className="text-slate-500 text-sm">Create your account</p>
        </div>

        <Link to="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-6 transition-colors">
          ← Change Role
        </Link>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                className="w-full bg-white border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-slate-400"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                className="w-full bg-white border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-slate-400"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                className="w-full bg-white border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-slate-400"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Select Role</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <select
                name="role"
                value={role}
                onChange={onChange}
                className="w-full bg-white border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {role === 'student' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Class (e.g. 10th-A)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    name="studentClass"
                    value={studentClass}
                    onChange={onChange}
                    className="w-full bg-white border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-slate-400"
                    placeholder="10th-A"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Admission/Roll Number</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    name="admissionNumber"
                    value={admissionNumber}
                    onChange={onChange}
                    className="w-full bg-white border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-slate-400"
                    placeholder="ADM123456"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-600/20 flex items-center justify-center transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-slate-500">
          <p>
            Already have an account?{' '}
            <Link to={`/login?role=${roleFromUrl}`} className="text-orange-600 hover:text-orange-500 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
