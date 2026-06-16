import { Component, computed, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, TitleCasePipe],
  templateUrl: './home.component.html',
  styles: [`
    :host { display: block; }
    .filter-btn {
      @apply px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-800;
    }
    .filter-btn.active-filter {
      @apply bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white;
    }
  `],
})
export class HomeComponent {
  todoService = inject(TodoService);

  // Form controls
  newTaskCtrl = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1), Validators.maxLength(128)] });
  newProjectCtrl = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] });
  renameProjectCtrl = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] });

  // Filter state
  filter = signal<'all' | 'pending' | 'completed'>('all');

  // UI state
  showNewProject = signal(false);
  showSidebar = signal(false);
  renamingProjectId = signal<string | null>(null);
  showStaleAlert = signal(true);
  darkMode = signal(false);
  showExport = signal(false);

  // Computed
  activeProject = computed(() => this.todoService.activeProject());
  tasksByFilter = computed(() => {
    const project = this.activeProject();
    if (!project) return [];
    const tasks = project.tasks;
    const filter = this.filter();
    if (filter === 'pending') return tasks.filter(t => !t.completed);
    if (filter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  });

  staleTasks = computed(() => this.todoService.getStaleTasks());
  stats = computed(() => {
    const id = this.todoService.activeProjectId();
    return id ? this.todoService.getStats(id) : { total: 0, completed: 0, pending: 0 };
  });

  constructor() {
    // Check system dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('todo-dark-mode');
    const isDark = saved !== null ? saved === 'true' : prefersDark;
    this.darkMode.set(isDark);
    this.applyTheme(isDark);
  }

  // ── Theme ──
  toggleDarkMode(): void {
    const next = !this.darkMode();
    this.darkMode.set(next);
    localStorage.setItem('todo-dark-mode', String(next));
    this.applyTheme(next);
  }

  private applyTheme(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }

  // ── Tasks ──
  addTask(): void {
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.value.trim();
      if (value) {
        this.todoService.addTask(value);
        this.newTaskCtrl.setValue('');
      }
    }
  }

  toggleTask(taskId: number): void {
    const projectId = this.todoService.activeProjectId();
    if (projectId) this.todoService.toggleTask(projectId, taskId);
  }

  deleteTask(taskId: number): void {
    const projectId = this.todoService.activeProjectId();
    if (projectId) this.todoService.deleteTask(projectId, taskId);
  }

  startEditing(taskId: number): void {
    const projectId = this.todoService.activeProjectId();
    if (projectId) this.todoService.setTaskEditing(projectId, taskId, true);
  }

  saveEdit(taskId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const projectId = this.todoService.activeProjectId();
    if (projectId && input.value.trim()) {
      this.todoService.updateTaskTitle(projectId, taskId, input.value.trim());
    }
  }

  cancelEdit(taskId: number): void {
    const projectId = this.todoService.activeProjectId();
    if (projectId) this.todoService.setTaskEditing(projectId, taskId, false);
  }

  changeFilter(filter: 'all' | 'pending' | 'completed'): void {
    this.filter.set(filter);
  }

  // ── Projects ──
  selectProject(id: string): void {
    this.todoService.selectProject(id);
    this.filter.set('all');
    this.showSidebar.set(false);
  }

  addProject(): void {
    if (this.newProjectCtrl.valid) {
      const name = this.newProjectCtrl.value.trim();
      if (name) {
        this.todoService.addProject(name);
        this.newProjectCtrl.setValue('');
        this.showNewProject.set(false);
      }
    }
  }

  startRename(id: string, currentName: string): void {
    this.renamingProjectId.set(id);
    this.renameProjectCtrl.setValue(currentName);
  }

  confirmRename(): void {
    const id = this.renamingProjectId();
    if (id && this.renameProjectCtrl.valid) {
      const name = this.renameProjectCtrl.value.trim();
      if (name) {
        this.todoService.renameProject(id, name);
      }
    }
    this.renamingProjectId.set(null);
  }

  cancelRename(): void {
    this.renamingProjectId.set(null);
  }

  deleteProject(id: string, event: Event): void {
    event.stopPropagation();
    const project = this.todoService.projects().find(p => p.id === id);
    if (project && confirm(`Delete "${project.name}" and all its tasks?`)) {
      this.todoService.deleteProject(id);
    }
  }

  // ── Stale Tasks ──
  dismissStaleAlert(): void {
    this.showStaleAlert.set(false);
  }

  completeStaleTask(projectId: string, taskId: number): void {
    this.todoService.toggleTask(projectId, taskId);
    // Refresh stale list
    this.staleTasks();
  }

  deleteStaleTask(projectId: string, taskId: number): void {
    this.todoService.deleteTask(projectId, taskId);
  }

  // ── Export / Import ──
  exportData(): void {
    const data = this.todoService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importData(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = this.todoService.importData(reader.result as string);
      if (result) {
        alert('Data imported successfully!');
      } else {
        alert('Invalid file format. Please select a valid backup file.');
      }
    };
    reader.readAsText(file);
    input.value = '';
  }
}
