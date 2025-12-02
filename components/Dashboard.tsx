import React from 'react';
import { UserProfile, JobApplication, ApplicationStatus } from '../types';
import { Briefcase, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  applications: JobApplication[];
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, applications }) => {
  const stats = [
    { label: 'Applications', value: applications.length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Interviews', value: applications.filter(a => a.status === ApplicationStatus.INTERVIEWING).length, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Offers', value: applications.filter(a => a.status === ApplicationStatus.OFFER).length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Response Rate', value: '12%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Welcome back, {profile.name.split(' ')[0]}</h2>
        <p className="text-slate-500 mt-1">Here's what's happening with your job search today.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <h3 className="text-slate-600 font-medium">{stat.label}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {applications.slice(0, 3).map(app => (
              <div key={app.id} className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                 <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold mr-4">
                    {app.company[0]}
                 </div>
                 <div className="flex-1">
                   <h4 className="font-medium text-slate-900">{app.position}</h4>
                   <p className="text-sm text-slate-500">{app.company}</p>
                 </div>
                 <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">
                   {app.status}
                 </span>
              </div>
            ))}
            {applications.length === 0 && (
                <p className="text-slate-400 text-sm italic">No applications tracked yet.</p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-lg font-bold mb-2">Resume Strength</h3>
          <div className="flex items-end space-x-2 mb-4">
             <span className="text-4xl font-bold">85</span>
             <span className="text-indigo-200 mb-1">/ 100</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-6">
             <div className="bg-white h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-indigo-100 text-sm mb-4">
            Your resume is looking great! Consider adding more quantifiable results to your "Senior Developer" role to boost your score.
          </p>
          <button className="w-full py-2 bg-white text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-colors">
            Improve Resume
          </button>
        </div>
      </div>
    </div>
  );
};
