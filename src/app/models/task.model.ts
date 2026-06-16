export interface Task {
  id: number;
  title: string;
  completed: boolean;
  editing?: boolean;
  createdAt: string;  // ISO date
  updatedAt: string;  // ISO date
}

export function createTask(title: string): Task {
  const now = new Date().toISOString();
  return {
    id: Date.now(),
    title,
    completed: false,
    editing: false,
    createdAt: now,
    updatedAt: now,
  };
}
