import React, { useState } from 'react';
import type { Project } from '../types';
import Header from './Header';
import PlusIcon from './icons/PlusIcon';
import EyeIcon from './icons/EyeIcon';
import EyeOffIcon from './icons/EyeOffIcon';

interface ProjectsScreenProps {
  projects: Project[];
  onAddProject: (name: string, password?: string) => void;
  onSelectProject: (project: Project) => void;
}

const ProjectCard: React.FC<{project: Project, onSelect: () => void}> = ({ project, onSelect }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleGo = () => {
    if (project.password && password !== project.password) {
      setError('Incorrect password.');
    } else {
      setError('');
      onSelect();
    }
  };
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  return (
    <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm w-full">
      <h3 className="text-xl font-bold text-gray-800">Project: {project.name}</h3>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative mt-1">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGo()}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-800 pr-10"
              placeholder="Enter project password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
      <button
        onClick={handleGo}
        className="mt-4 w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
      >
        Go
      </button>
    </div>
  );
};


const CreateProjectCard: React.FC<{onAddProject: (name: string, password?: string) => void}> = ({onAddProject}) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSend = () => {
        if (name.trim()) {
            onAddProject(name.trim(), password.trim() || undefined);
            setName('');
            setPassword('');
        }
    }
    
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prev => !prev);
    };

    return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm w-full">
            <div className="flex items-center space-x-2">
                <PlusIcon className="w-5 h-5 text-gray-600"/>
                <h3 className="text-xl font-bold text-gray-800">Create new Project</h3>
            </div>
            <div className="mt-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Design Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-800"
                        placeholder="e.g., Summer Campaign"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Create a Password (optional)</label>
                    <div className="relative mt-1">
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-800 pr-10"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                        >
                          {isPasswordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>
            <button
                onClick={handleSend}
                className="mt-4 w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            >
                Send
            </button>
        </div>
    );
};

const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ projects, onAddProject, onSelectProject }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="PROJECTS" />
      <main className="px-4 sm:px-8 md:px-16 pb-16">
        <p className="text-gray-600 mb-8">Click on one of the layouts to add feedback</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {projects.map(p => (
                <ProjectCard key={p.id} project={p} onSelect={() => onSelectProject(p)} />
            ))}
            <CreateProjectCard onAddProject={onAddProject} />
        </div>
      </main>
    </div>
  );
};

export default ProjectsScreen;