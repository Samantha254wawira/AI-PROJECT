import React, { useState } from 'react';
import { JobApplication, ApplicationStatus } from '../types';
import { Plus, MoreVertical, Calendar, Building } from 'lucide-react';

interface TrackerProps {
  applications: JobApplication[];
  onUpdateApplication: (app: JobApplication) => void;
  onAddApplication: (app: JobApplication) => void;
  onDeleteApplication: (id: string) => void;
}

const columns = [
  { id: ApplicationStatus.APPLIED, label: 'Applied', color: 'bg-blue-500' },
  { id: ApplicationStatus.INTERVIEWING, label: 'Interviewing', color: 'bg-yellow-500' },
  { id: ApplicationStatus.OFFER, label: 'Offer', color: 'bg-green-500' },
  { id: ApplicationStatus.REJECTED, label: 'Rejected', color: 'bg-red-500' },
];

export const ApplicationTracker: React.FC<TrackerProps> = ({ 
  applications, 
  onUpdateApplication, 
  onAddApplication,
  onDeleteApplication 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newApp, setNewApp] = useState({ company: '', position: '' });

  const handleAdd = () => {
    if (!newApp.company || !newApp.position) return;
    onAddApplication({
      id: Date.now().toString(),
      company: newApp.company,
      position: newApp.position,
      status: ApplicationStatus.APPLIED,
      dateApplied: new Date().toLocaleDateString(),
      notes: ''
    });
    setNewApp({ company: '', position: '' });
    setIsAdding(false);
  };

  const moveStatus = (app: JobApplication, direction: 'next' | 'prev') => {
    const statusOrder = [
      ApplicationStatus.APPLIED,
      ApplicationStatus.INTERVIEWING,
      ApplicationStatus.OFFER,
      ApplicationStatus.REJECTED
    ];
    const currentIndex = statusOrder.indexOf(app.status);
    let nextIndex = currentIndex;
    
    // Simple logic: Rejected is terminal, but allow moving around for demo
    if (direction === 'next') {
        nextIndex = Math.min(currentIndex + 1, statusOrder.length - 1);
    } 
    
    if (nextIndex !== currentIndex) {
      onUpdateApplication({ ...app, status: statusOrder[nextIndex] });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Application Tracker</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          <span>Add Application</span>
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-slate-200 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1">Company</label>
            <input 
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={newApp.company}
              onChange={e => setNewApp({...newApp, company: e.target.value})}
              placeholder="e.g. Netflix"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1">Position</label>
            <input 
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={newApp.position}
              onChange={e => setNewApp({...newApp, position: e.target.value})}
              placeholder="e.g. Senior Engineer"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Save</button>
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 min-w-[1000px] h-full pb-4">
          {columns.map(col => (
            <div key={col.id} className="flex-1 flex flex-col bg-slate-100 rounded-xl p-3 h-full">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-semibold text-slate-700">{col.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs text-white ${col.color}`}>
                  {applications.filter(a => a.status === col.id).length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin">
                {applications.filter(a => a.status === col.id).map(app => (
                  <div key={app.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800">{app.position}</h4>
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <div className="flex items-center text-slate-500 text-sm mb-3">
                      <Building size={14} className="mr-1.5" />
                      {app.company}
                    </div>
                    <div className="flex items-center justify-between mt-4 text-xs text-slate-400 border-t pt-3">
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {app.dateApplied}
                      </div>
                      
                      {/* Quick Actions for Demo */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         {col.id !== ApplicationStatus.REJECTED && col.id !== ApplicationStatus.OFFER && (
                           <button 
                             onClick={() => moveStatus(app, 'next')}
                             className="px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                           >
                             Move &rarr;
                           </button>
                         )}
                         <button 
                            onClick={() => onDeleteApplication(app.id)}
                            className="px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                         >
                           Del
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
