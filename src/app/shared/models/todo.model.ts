export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;  // ISO date
  updatedAt: string;  // ISO date
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;  // ISO date
  tasks: Task[];
}

export function createTask(title: string, description = ''): Task {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title,
    description,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function createProject(name: string): Project {
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    tasks: [],
  };
}
