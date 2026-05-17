import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

const roles = [
  {
    id: 'student',
    label: 'Student',
    icon: GraduationCap,
    description: 'View your results, attendance, assignments and leave status.',
    gradient: 'from-orange-400 to-amber-500',
    glow: 'shadow-orange-500/20',
    hoverGlow: 'hover:shadow-orange-500/40',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    activeBorder: 'border-orange-500',
    iconColor: 'text-orange-600',
    tag: 'For Students',
  },
  {
    id: 'teacher',
    label: 'Teacher',
    icon: BookOpen,
    description: 'Manage attendance, upload results, assignments, and approve leaves.',
    gradient: 'from-emerald-400 to-teal-500',
    glow: 'shadow-emerald-500/20',
    hoverGlow: 'hover:shadow-emerald-500/40',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    activeBorder: 'border-emerald-500',
    iconColor: 'text-emerald-600',
    tag: 'For Faculty',
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: ShieldCheck,
    description: 'Full control — manage students, teachers, departments and attendance.',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/20',
    hoverGlow: 'hover:shadow-violet-500/40',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    activeBorder: 'border-violet-500',
    iconColor: 'text-violet-600',
    tag: 'For Management',
  },
];

const Landing = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = (action) => {
    if (!selectedRole) return;
    navigate(`/${action}?role=${selectedRole}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-transparent p-6 relative overflow-hidden">
      {/* Ambient Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-orange-400/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-violet-400/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-emerald-400/8 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          StudentSphere ERP
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-4 leading-tight">
          Welcome Back! 👋
        </h1>
        <p className="text-slate-500 text-lg max-w-md mx-auto">
          Select your role to get started. Each portal is tailored for your specific needs.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl relative z-10 mb-10">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`group relative p-7 rounded-3xl border-2 text-left transition-all duration-300 bg-white
                ${isSelected
                  ? `${role.activeBorder} shadow-2xl ${role.glow} -translate-y-2`
                  : `border-slate-200 hover:-translate-y-1 hover:shadow-xl ${role.hoverGlow} hover:${role.border}`
                }
              `}
            >
              {/* Active Indicator */}
              {isSelected && (
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full bg-gradient-to-br ${role.gradient} shadow-lg`} />
              )}

              <div className={`inline-flex p-3 rounded-2xl ${role.bg} mb-5`}>
                <Icon className={`w-7 h-7 ${role.iconColor}`} />
              </div>

              <span className={`text-xs font-bold uppercase tracking-widest ${role.iconColor} mb-2 block`}>
                {role.tag}
              </span>
              <h3 className="text-xl font-black text-slate-900 mb-2">{role.label}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{role.description}</p>
            </button>
          );
        })}
      </div>

      {/* CTA Buttons */}
      <div className={`flex flex-col sm:flex-row gap-4 relative z-10 transition-all duration-300 ${selectedRole ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none translate-y-2'}`}>
        <button
          onClick={() => handleContinue('login')}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 transition-all duration-200 hover:-translate-y-0.5"
        >
          Sign In
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleContinue('signup')}
          className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-bold px-8 py-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          Create Account
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {selectedRole && (
        <p className="mt-4 text-sm text-slate-400 relative z-10">
          Continuing as <span className="font-bold text-slate-600 capitalize">{selectedRole}</span>
        </p>
      )}
    </div>
  );
};

export default Landing;
