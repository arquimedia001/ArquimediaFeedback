
import React, { useState, useCallback } from 'react';
import type { Project, Design } from '../types';
import Header from './Header';
import PlusIcon from './icons/PlusIcon';
import UploadIcon from './icons/UploadIcon';

interface ProjectBoardsScreenProps {
  project: Project;
  onSelectDesign: (design: Design) => void;
  onAddDesign: (projectId: string, designName: string, imageUrl: string) => void;
  onBack: () => void;
}

const DesignCard: React.FC<{design: Design, onSelect: () => void}> = ({ design, onSelect }) => {
    return (
        <div onClick={onSelect} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md hover:border-gray-400 transition-all duration-300 group">
            <div className="aspect-w-4 aspect-h-3 w-full bg-gray-100 rounded-md overflow-hidden">
                <img src={design.imageUrl} alt={design.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h3 className="mt-4 text-md font-semibold text-gray-800">{design.name}</h3>
        </div>
    );
};

const UploadCard: React.FC<{project: Project, onAddDesign: ProjectBoardsScreenProps['onAddDesign']}> = ({ project, onAddDesign }) => {
    const [designName, setDesignName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File is too large. Max 10MB.');
                return;
            }
            setError('');
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSend = () => {
        if (designName.trim() && preview) {
            onAddDesign(project.id, designName, preview);
            setDesignName('');
            setFile(null);
            setPreview(null);
            setError('');
        } else {
            setError('Please provide a design name and upload a file.');
        }
    }

    return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
                <PlusIcon className="w-5 h-5 text-gray-600"/>
                <h3 className="text-xl font-bold text-gray-800">Upload new</h3>
            </div>
            <div className="mt-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Design Name</label>
                    <input
                        type="text"
                        value={designName}
                        onChange={(e) => setDesignName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-800"
                        placeholder="e.g., V2 Mobile Mockup"
                    />
                </div>
                 <div>
                    <label htmlFor="file-upload" className="relative cursor-pointer mt-1 flex justify-center w-full px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400">
                        <div className="space-y-1 text-center">
                           <UploadIcon className="mx-auto h-12 w-12 text-gray-400"/>
                            <div className="flex text-sm text-gray-600">
                                <span className="font-medium text-gray-700">Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif"/>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            {preview && <img src={preview} alt="preview" className="mt-2 h-20 mx-auto" />}
                        </div>
                    </label>
                </div>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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


const ProjectBoardsScreen: React.FC<ProjectBoardsScreenProps> = ({ project, onSelectDesign, onAddDesign, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`${project.name} Project boards`} />
      <main className="px-4 sm:px-8 md:px-16 pb-16">
        <p className="text-gray-600 mb-8">Click on one of the layouts to add feedback</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {project.designs.map(design => (
            <DesignCard key={design.id} design={design} onSelect={() => onSelectDesign(design)} />
          ))}
          <UploadCard project={project} onAddDesign={onAddDesign} />
        </div>
        <div className="mt-12 text-center">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-800 font-medium">
                &larr; Back to all projects
            </button>
        </div>
      </main>
    </div>
  );
};

export default ProjectBoardsScreen;