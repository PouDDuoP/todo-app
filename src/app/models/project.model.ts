import { Task } from './task.model';

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  tasks: Task[];
}

export function createProject(name: string): Project {
  return {
    id: Date.now().toString(),
    name,
    createdAt: new Date().toISOString(),
    tasks: [],
  };
}
