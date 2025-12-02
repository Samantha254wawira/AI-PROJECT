import React, { useState } from 'react';
import { JobListing, UserProfile } from '../types';
import { MOCK_JOBS } from '../services/mockData';
import { analyzeJobFit } from '../services/geminiService';
import { MapPin, Building2, DollarSign, Sparkles, Briefcase, CheckCircle2 } from 'lucide-react';

interface JobSearchProps {
  userProfile: UserProfile;
}

export const JobSearch: React.FC<JobSearchProps> = ({ userProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const filteredJobs = MOCK_JOBS.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAnalyzeFit = async (job: JobListing) => {
    setAnalyzing(true);
    setAnalysis(null);
    const resumeText = `
      Summary: ${userProfile.summary}
      Skills: ${userProfile.skills.join(', ')}
      Experience: ${userProfile.experience.map(e => `${e.role} at ${e.company}: ${e.description}`).join('\n')}
    `;
    const result = await analyzeJobFit(resumeText, job.description);
    setAnalysis(result);
    setAnalyzing(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Job Opportunities</h2>
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search jobs, companies, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Briefcase size={18} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 h-[calc(100vh-140px)]">
        {/* Job List */}
        <div className="w-1/3 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
          {filteredJobs.map(job => (
            <div 
              key={job.id}
              onClick={() => { setSelectedJob(job); setAnalysis(null); }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedJob?.id === job.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'}`}
            >
              <h3 className="font-bold text-slate-800">{job.title}</h3>
              <p className="text-slate-600 text-sm mb-2">{job.company}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="flex items-center"><MapPin size={12} className="mr-1"/> {job.location}</span>
                <span className="flex items-center"><DollarSign size={12} className="mr-1"/> {job.salary}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {job.requiredSkills.slice(0, 3).map(skill => (
                  <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px]">{skill}</span>
                ))}
              </div>
            </div>
          ))}
          {filteredJobs.length === 0 && (
            <div className="text-center py-10 text-slate-500">No jobs found matching your search.</div>
          )}
        </div>

        {/* Job Detail */}
        <div className="w-2/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {selectedJob ? (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedJob.title}</h2>
                    <div className="flex items-center text-slate-600 mt-1">
                      <Building2 size={16} className="mr-2" />
                      <span className="font-medium">{selectedJob.company}</span>
                      <span className="mx-2">•</span>
                      <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{selectedJob.type}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAnalyzeFit(selectedJob)}
                    disabled={analyzing}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-70 shadow-sm"
                  >
                    <Sparkles size={18} />
                    <span>{analyzing ? 'Analyzing...' : 'Analyze Fit'}</span>
                  </button>
                </div>

                {analysis && (
                  <div className="mb-6 p-4 bg-purple-50 border border-purple-100 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                      <CheckCircle2 size={16} className="mr-2"/> AI Analysis
                    </h4>
                    <p className="text-sm text-purple-800 whitespace-pre-line leading-relaxed">{analysis}</p>
                  </div>
                )}
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 scrollbar-thin">
                <h3 className="font-semibold text-slate-900 mb-3">About the Role</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{selectedJob.description}</p>
                
                <h3 className="font-semibold text-slate-900 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requiredSkills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                  Apply Now
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Briefcase size={48} className="mb-4 opacity-50" />
              <p>Select a job to view details and AI analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
