import { AnimationConfig } from '../types';

export interface SavedProject {
  id: string;
  name: string;
  config: AnimationConfig;
  updatedAt: number;
}

const STORAGE_KEY = 'introforge_projects';

export const persistenceService = {
  getProjects(): SavedProject[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse saved projects', e);
      return [];
    }
  },

  saveProject(config: AnimationConfig, name: string, id?: string): string {
    const projects = this.getProjects();
    const projectId = id || Math.random().toString(36).substring(2, 9);
    
    const newProject: SavedProject = {
      id: projectId,
      name: name || 'Untitled Project',
      config,
      updatedAt: Date.now(),
    };

    const existingIndex = projects.findIndex(p => p.id === projectId);
    if (existingIndex > -1) {
      projects[existingIndex] = newProject;
    } else {
      projects.push(newProject);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return projectId;
  },

  deleteProject(id: string): void {
    const projects = this.getProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  },

  getProject(id: string): SavedProject | null {
    const projects = this.getProjects();
    return projects.find(p => p.id === id) || null;
  }
};
