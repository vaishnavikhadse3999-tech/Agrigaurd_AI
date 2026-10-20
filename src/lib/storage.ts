import type { FarmProfile, Task } from '@/types';

const FARM_KEY = 'agriguard_farm';
const TASKS_KEY = 'agriguard_tasks';

export function loadFarm(): FarmProfile | null {
  try {
    const raw = localStorage.getItem(FARM_KEY);
    return raw ? (JSON.parse(raw) as FarmProfile) : null;
  } catch {
    return null;
  }
}

export function saveFarm(farm: FarmProfile): void {
  localStorage.setItem(FARM_KEY, JSON.stringify(farm));
}

export function clearFarm(): void {
  localStorage.removeItem(FARM_KEY);
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
