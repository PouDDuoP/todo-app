import { Injectable, signal } from '@angular/core';
import { Project, createProject } from '../models/project.model';
import { Task, createTask } from '../models/task.model';

const STORAGE_KEY = 'todo-projects';
const STALE_DAYS = 7;

@Injectable({ providedIn: 'root' })
export class TodoService {
  projects = signal<Project[]>([]);
  activeProjectId = signal<string | null>(null);

  activeProject = signal<Project | null>(null);

  constructor() {
    this.load();
  }

  // ── Persistence ──

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.projects()));
  }

  private load(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const projects: Project[] = JSON.parse(raw);
        this.projects.set(projects);
        if (projects.length > 0) {
          this.selectProject(projects[0].id);
        }
      } catch {
        this.seed();
      }
    } else {
      this.seed();
    }
  }

  private seed(): void {
    const project = createProject('My Day');
    this.projects.set([project]);
    this.selectProject(project.id);
    this.save();
  }

  // ── Project CRUD ──

  selectProject(id: string): void {
    this.activeProjectId.set(id);
    const found = this.projects().find(p => p.id === id) ?? null;
    this.activeProject.set(found);
  }

  addProject(name: string): void {
    const project = createProject(name);
    this.projects.update(projects => [...projects, project]);
    this.save();
    this.selectProject(project.id);
  }

  renameProject(id: string, name: string): void {
    this.projects.update(projects =>
      projects.map(p => (p.id === id ? { ...p, name } : p))
    );
    this.syncActive();
    this.save();
  }

  deleteProject(id: string): void {
    this.projects.update(projects => projects.filter(p => p.id !== id));
    const current = this.activeProjectId();
    if (current === id || !this.projects().find(p => p.id === current)) {
      const first = this.projects()[0] ?? null;
      this.activeProjectId.set(first?.id ?? null);
      this.activeProject.set(first);
    } else {
      this.syncActive();
    }
    this.save();
  }

  // ── Task CRUD ──

  addTask(title: string): void {
    const projectId = this.activeProjectId();
    if (!projectId) return;
    const task = createTask(title);
    this.projects.update(projects =>
      projects.map(p =>
        p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p
      )
    );
    this.syncActive();
    this.save();
  }

  toggleTask(projectId: string, taskId: number): void {
    this.projects.update(projects =>
      projects.map(p =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map(t =>
                t.id === taskId
                  ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
                  : t
              ),
            }
          : p
      )
    );
    this.syncActive();
    this.save();
  }

  deleteTask(projectId: string, taskId: number): void {
    this.projects.update(projects =>
      projects.map(p =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) }
          : p
      )
    );
    this.syncActive();
    this.save();
  }

  updateTaskTitle(projectId: string, taskId: number, title: string): void {
    this.projects.update(projects =>
      projects.map(p =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map(t =>
                t.id === taskId
                  ? { ...t, title, editing: false, updatedAt: new Date().toISOString() }
                  : t
              ),
            }
          : p
      )
    );
    this.syncActive();
    this.save();
  }

  setTaskEditing(projectId: string, taskId: number, editing: boolean): void {
    this.projects.update(projects =>
      projects.map(p =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map(t =>
                t.id === taskId ? { ...t, editing } : { ...t, editing: false }
              ),
            }
          : p
      )
    );
    this.syncActive();
  }

  // ── Stale Tasks ──

  getStaleTasks(): { project: Project; task: Task }[] {
    const now = Date.now();
    const staleThreshold = STALE_DAYS * 24 * 60 * 60 * 1000;
    const result: { project: Project; task: Task }[] = [];

    for (const project of this.projects()) {
      for (const task of project.tasks) {
        if (task.completed) continue;
        const created = new Date(task.createdAt).getTime();
        const updated = new Date(task.updatedAt).getTime();
        // Stale if never updated (or updated same second as created) and older than threshold
        if (updated - created < 1000 && (now - created) > staleThreshold) {
          result.push({ project, task });
        }
      }
    }

    return result;
  }

  // ── Export / Import ──

  exportData(): string {
    return JSON.stringify(this.projects(), null, 2);
  }

  importData(json: string): boolean {
    try {
      const data: Project[] = JSON.parse(json);
      if (!Array.isArray(data)) return false;
      for (const p of data) {
        if (!p.id || !p.name || !Array.isArray(p.tasks)) return false;
      }
      this.projects.set(data);
      if (data.length > 0) {
        this.selectProject(data[0].id);
      }
      this.save();
      return true;
    } catch {
      return false;
    }
  }

  // ── Stats ──

  getStats(projectId: string): { total: number; completed: number; pending: number } {
    const project = this.projects().find(p => p.id === projectId);
    if (!project) return { total: 0, completed: 0, pending: 0 };
    const total = project.tasks.length;
    const completed = project.tasks.filter(t => t.completed).length;
    return { total, completed, pending: total - completed };
  }

  // ── Helpers ──

  private syncActive(): void {
    const id = this.activeProjectId();
    if (id) {
      const found = this.projects().find(p => p.id === id) ?? null;
      this.activeProject.set(found);
    }
  }
}
