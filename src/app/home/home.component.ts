import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { NgClass, DatePipe } from '@angular/common';
import { TodoService } from '@shared/services/todo.service';
import { LanguageService } from '@shared/services/language.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Task } from '@shared/models/todo.model';

type Filter = 'all' | 'pending' | 'completed';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, DatePipe, TranslatePipe],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected todoService = inject(TodoService);
  protected lang = inject(LanguageService);

  // ── Filter state ──
  protected readonly allFilters: Filter[] = ['all', 'pending', 'completed'];
  protected readonly search = signal('');
  protected readonly filter = signal<Filter>('all');

  // ── UI state ──
  protected readonly editingId = signal<string | null>(null);
  protected readonly showAddForm = signal(false);
  protected showSidebar = signal(false);
  protected showNewProject = signal(false);
  protected renamingProjectId = signal<string | null>(null);
  protected showStaleAlert = signal(true);
  protected darkMode = signal(false);

  // ── Form fields ──
  protected newTitle = '';
  protected newDesc = '';
  protected editTitle = '';
  protected editDesc = '';
  protected newProjectCtrl = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] });
  protected renameProjectCtrl = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] });

  // ── Computed ──
  protected activeProject = computed(() => this.todoService.activeProject());

  protected tasksByFilter = computed(() => {
    const project = this.activeProject();
    if (!project) return [];
    const tasks = project.tasks;
    const query = this.search().toLowerCase();
    const f = this.filter();
    return tasks.filter(t => {
      if (f === 'completed' && !t.completed) return false;
      if (f === 'pending' && t.completed) return false;
      if (
        query &&
        !t.title.toLowerCase().includes(query) &&
        !t.description.toLowerCase().includes(query)
      ) return false;
      return true;
    });
  });

  protected staleTasks = computed(() => this.todoService.getStaleTasks());

  protected stats = computed(() => {
    const id = this.todoService.activeProjectId();
    return id ? this.todoService.getStats(id) : { total: 0, completed: 0, pending: 0 };
  });

  constructor() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('todo-dark-mode');
    const isDark = saved !== null ? saved === 'true' : prefersDark;
    this.darkMode.set(isDark);
    this.applyTheme(isDark);
  }

  // ── Theme ──
  protected toggleDarkMode(): void {
    const next = !this.darkMode();
    this.darkMode.set(next);
    localStorage.setItem('todo-dark-mode', String(next));
    this.applyTheme(next);
  }

  private applyTheme(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }

  // ── Tasks ──
  protected addTask(): void {
    const title = this.newTitle.trim();
    if (!title) return;
    this.todoService.addTask(title, this.newDesc.trim());
    this.newTitle = '';
    this.newDesc = '';
    this.showAddForm.set(false);
  }

  protected toggleTask(taskId: string): void {
    const projectId = this.todoService.activeProjectId();
    if (projectId) this.todoService.toggleTask(projectId, taskId);
  }

  protected deleteTask(taskId: string): void {
    const projectId = this.todoService.activeProjectId();
    if (projectId) this.todoService.deleteTask(projectId, taskId);
  }

  protected startEdit(todo: Task): void {
    this.editingId.set(todo.id);
    this.editTitle = todo.title;
    this.editDesc = todo.description;
  }

  protected saveEdit(): void {
    const id = this.editingId();
    if (!id) return;
    const title = this.editTitle.trim();
    if (!title) return;
    const projectId = this.todoService.activeProjectId();
    if (projectId) this.todoService.editTask(projectId, id, title, this.editDesc.trim());
    this.editingId.set(null);
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
  }

  // ── Filter ──
  protected setFilter(f: Filter): void {
    this.filter.set(f);
  }

  // ── Projects ──
  protected selectProject(id: string): void {
    this.todoService.selectProject(id);
    this.filter.set('all');
    this.showSidebar.set(false);
  }

  protected addProject(): void {
    if (this.newProjectCtrl.valid) {
      const name = this.newProjectCtrl.value.trim();
      if (name) {
        this.todoService.addProject(name);
        this.newProjectCtrl.setValue('');
        this.showNewProject.set(false);
      }
    }
  }

  protected startRename(id: string, currentName: string): void {
    this.renamingProjectId.set(id);
    this.renameProjectCtrl.setValue(currentName);
  }

  protected confirmRename(): void {
    const id = this.renamingProjectId();
    if (id && this.renameProjectCtrl.valid) {
      const name = this.renameProjectCtrl.value.trim();
      if (name) {
        this.todoService.renameProject(id, name);
      }
    }
    this.renamingProjectId.set(null);
  }

  protected cancelRename(): void {
    this.renamingProjectId.set(null);
  }

  protected deleteProject(id: string, event: Event): void {
    event.stopPropagation();
    const project = this.todoService.projects().find(p => p.id === id);
    if (project && confirm(this.lang.translate('project.deleteConfirm', { name: project.name }))) {
      this.todoService.deleteProject(id);
    }
  }

  // ── Stale Tasks ──
  protected dismissStaleAlert(): void {
    this.showStaleAlert.set(false);
  }

  protected completeStaleTask(projectId: string, taskId: string): void {
    this.todoService.toggleTask(projectId, taskId);
  }

  protected deleteStaleTask(projectId: string, taskId: string): void {
    this.todoService.deleteTask(projectId, taskId);
  }

  // ── Export / Import ──
  protected exportData(): void {
    const data = this.todoService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  protected importData(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = this.todoService.importData(reader.result as string);
      if (result) {
        alert(this.lang.translate('import.success'));
      } else {
        alert(this.lang.translate('import.error'));
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  // ── Lang ──
  protected toggleLang(): void {
    this.lang.toggle();
  }
}
