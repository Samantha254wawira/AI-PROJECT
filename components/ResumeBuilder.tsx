import React, { useState } from 'react';
import { UserProfile, ExperienceItem, EducationItem } from '../types';
import { generateResumeContent } from '../services/geminiService';
import { Wand2, Plus, Trash2, Save, Download } from 'lucide-react';

interface ResumeBuilderProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ profile, onUpdateProfile }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'skills'>('personal');

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    onUpdateProfile({ ...profile, [field]: value });
  };

  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: Date.now().toString(),
      role: 'New Role',
      company: 'Company Name',
      duration: '2023 - Present',
      description: 'Describe your responsibilities and achievements...',
    };
    onUpdateProfile({ ...profile, experience: [...profile.experience, newExp] });
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string) => {
    const updatedExp = profile.experience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdateProfile({ ...profile, experience: updatedExp });
  };

  const removeExperience = (id: string) => {
    onUpdateProfile({
      ...profile,
      experience: profile.experience.filter((exp) => exp.id !== id),
    });
  };

  const polishDescription = async (id: string, text: string) => {
    if (!text) return;
    setIsGenerating(true);
    const polishedText = await generateResumeContent(`Rewrite the following job description bullet points to be more professional, quantifiable, and result-oriented:\n\n${text}`);
    updateExperience(id, 'description', polishedText);
    setIsGenerating(false);
  };

  const generateSummary = async () => {
    setIsGenerating(true);
    const context = `
      Name: ${profile.name}
      Skills: ${profile.skills.join(', ')}
      Experience: ${profile.experience.map(e => `${e.role} at ${e.company}`).join(', ')}
    `;
    const summary = await generateResumeContent(`Write a compelling 3-4 sentence professional summary for a resume based on this background:\n\n${context}`);
    handleInputChange('summary', summary);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Resume Builder</h2>
        <div className="flex space-x-2">
           <button className="flex items-center space-x-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
            <Save size={18} />
            <span>Save Draft</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download size={18} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            className={`flex-1 py-4 text-sm font-medium ${activeTab === 'personal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Info
          </button>
          <button
            className={`flex-1 py-4 text-sm font-medium ${activeTab === 'experience' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('experience')}
          >
            Experience
          </button>
          <button
            className={`flex-1 py-4 text-sm font-medium ${activeTab === 'skills' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('skills')}
          >
            Skills & Education
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700">Professional Summary</label>
                  <button
                    onClick={generateSummary}
                    disabled={isGenerating}
                    className="text-xs flex items-center text-purple-600 hover:text-purple-700 disabled:opacity-50"
                  >
                    <Wand2 size={12} className="mr-1" />
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={profile.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Summarize your professional background..."
                />
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              {profile.experience.map((exp) => (
                <div key={exp.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                   <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                        className="w-full bg-transparent font-semibold text-slate-900 placeholder-slate-400 border-b border-transparent focus:border-blue-500 outline-none"
                        placeholder="Job Title"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full bg-transparent text-slate-700 placeholder-slate-400 border-b border-transparent focus:border-blue-500 outline-none"
                        placeholder="Company"
                      />
                    </div>
                     <div>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                        className="w-full bg-transparent text-sm text-slate-500 placeholder-slate-400 border-b border-transparent focus:border-blue-500 outline-none"
                        placeholder="Duration (e.g. Jan 2020 - Present)"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      className="w-full p-2 text-sm text-slate-700 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Job description..."
                    />
                    <button
                      onClick={() => polishDescription(exp.id, exp.description)}
                      disabled={isGenerating}
                      className="absolute bottom-2 right-2 p-1.5 bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200 transition-colors"
                      title="Polish with AI"
                    >
                      <Wand2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addExperience}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center font-medium transition-colors"
              >
                <Plus size={18} className="mr-2" />
                Add Position
              </button>
            </div>
          )}

          {activeTab === 'skills' && (
             <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Skills (Comma separated)</label>
                  <textarea
                    rows={3}
                    value={profile.skills.join(', ')}
                    onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="React, TypeScript, Project Management..."
                  />
               </div>
               {/* Education section could be added similarly to experience */}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
