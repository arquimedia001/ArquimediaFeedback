import React, { useState, useEffect, useCallback } from 'react';
import type { Project, Design, Comment, NewComment } from './types';
import { INITIAL_PROJECTS } from './constants';
import ProjectsScreen from './components/ProjectsScreen';
import ProjectBoardsScreen from './components/ProjectBoardsScreen';
import DesignFeedbackScreen from './components/DesignFeedbackScreen';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);

  useEffect(() => {
    // Per user request to "clean everything", we are resetting the application state
    // by clearing any projects stored in localStorage on startup.
    try {
      localStorage.removeItem('arquimedia_projects');
      setProjects(INITIAL_PROJECTS); // INITIAL_PROJECTS is an empty array
    } catch (error) {
      console.error("Failed to clear projects from localStorage", error);
      setProjects(INITIAL_PROJECTS);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('arquimedia_projects', JSON.stringify(projects));
    } catch (error) {
      console.error("Failed to save projects to localStorage", error);
      alert("Could not save project changes. Your browser's local storage might be full. Please try uploading smaller images.");
    }
  }, [projects]);
  
  // Derive current project and design from the single source of truth (`projects`)
  // This prevents state synchronization issues.
  const currentProject = projects.find(p => p.id === currentProjectId) || null;
  const currentDesign = currentProject?.designs.find(d => d.id === currentDesignId) || null;

  const handleAddProject = (name: string, password?: string) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name,
      password,
      designs: [],
    };
    setProjects(prev => [...prev, newProject]);
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProjectId(project.id);
    setCurrentDesignId(null);
  };
  
  const handleSelectDesign = (design: Design) => {
    setCurrentDesignId(design.id);
  };

  const handleAddDesign = useCallback((projectId: string, designName: string, imageUrl: string) => {
    const newDesign: Design = {
      id: `design-${Date.now()}`,
      name: designName,
      imageUrl,
      comments: [],
      generalComments: [],
    };
    
    setProjects(prevProjects => 
      prevProjects.map(p => 
        p.id === projectId 
          ? { ...p, designs: [...p.designs, newDesign] } 
          : p
      )
    );
  }, []);

  const handleAddComment = useCallback((designId: string, comment: NewComment) => {
    if (!currentProjectId) return;

    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}`,
    };
    
    setProjects(prevProjects => 
      prevProjects.map(p => {
        if (p.id !== currentProjectId) return p;
        
        const updatedDesigns = p.designs.map(d => 
          d.id === designId 
            ? { ...d, comments: [...d.comments, newComment] } 
            : d
        );

        return { ...p, designs: updatedDesigns };
      })
    );
  }, [currentProjectId]);
  
  const handleAddGeneralComment = useCallback((designId: string, comment: string) => {
    if (!currentProjectId) return;
    
    setProjects(prevProjects => 
      prevProjects.map(p => {
        if (p.id !== currentProjectId) return p;

        const updatedDesigns = p.designs.map(d => 
          d.id === designId 
            ? { ...d, generalComments: [...d.generalComments, comment] } 
            : d
        );
        
        return { ...p, designs: updatedDesigns };
      })
    );
  }, [currentProjectId]);

  const handleDeleteProject = useCallback((projectId: string) => {
    setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
  }, []);

  const handleDeleteDesign = useCallback((projectId: string, designId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(p => {
        if (p.id !== projectId) {
          return p;
        }
        return {
          ...p,
          designs: p.designs.filter(d => d.id !== designId),
        };
      })
    );
  }, []);


  const handleBackToProjects = () => {
    setCurrentProjectId(null);
    setCurrentDesignId(null);
  };

  const handleBackToBoards = () => {
    setCurrentDesignId(null);
  }

  if (!currentProject) {
    return <ProjectsScreen 
              projects={projects} 
              onAddProject={handleAddProject} 
              onSelectProject={handleSelectProject} 
              onDeleteProject={handleDeleteProject}
            />;
  }

  if (currentProject && !currentDesign) {
    return <ProjectBoardsScreen 
              project={currentProject} 
              onSelectDesign={handleSelectDesign} 
              onAddDesign={handleAddDesign} 
              onDeleteDesign={handleDeleteDesign}
              onBack={handleBackToProjects}
            />;
  }

  if (currentProject && currentDesign) {
    return <DesignFeedbackScreen 
              project={currentProject} 
              design={currentDesign} 
              onAddComment={handleAddComment}
              onAddGeneralComment={handleAddGeneralComment}
              onBackToBoards={handleBackToBoards}
            />;
  }

  return <div>Loading...</div>;
};

export default App;