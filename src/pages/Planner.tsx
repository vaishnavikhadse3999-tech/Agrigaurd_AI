import { useState } from 'react';
import { ClipboardList, Plus, Check, Trash2, Calendar, Tag, ListChecks } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { TASK_CATEGORIES } from '@/lib/data';
import { loadTasks, saveTasks, uid } from '@/lib/storage';
import type { Task } from '@/types';

interface PlannerProps {
  onBack: () => void;
}

export function Planner({ onBack }: PlannerProps) {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState(TASK_CATEGORIES[0]);

  const persist = (next: Task[]) => {
    setTasks(next);
    saveTasks(next);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;
    persist([...tasks, { id: uid(), name: name.trim(), date, category, completed: false }]);
    setName('');
    setDate('');
    setCategory(TASK_CATEGORIES[0]);
  };

  const toggle = (id: string) =>
    persist(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const remove = (id: string) => persist(tasks.filter((t) => t.id !== id));

  const upcoming = tasks.filter((t) => !t.completed).sort((a, b) => a.date.localeCompare(b.date));
  const completed = tasks.filter((t) => t.completed).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHeader
        title="Farm Work Planner"
        subtitle="Plan and track your farm tasks"
        icon={<ClipboardList className="w-6 h-6" />}
        onBack={onBack}
      />

      <form onSubmit={addTask} className="card p-5 space-y-4 animate-fade-in">
        <div>
          <label className="label">Task Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Water cotton field" required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {TASK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" className="btn-primary w-full">
          <Plus className="w-5 h-5" /> Add Task
        </button>
      </form>

      <div className="mt-6">
        <h2 className="section-title mb-3 flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-primary-600" /> Upcoming Tasks
          <span className="badge bg-primary-100 text-primary-700">{upcoming.length}</span>
        </h2>
        {upcoming.length === 0 ? (
          <div className="card p-6 text-center text-primary-500 text-sm">
            No upcoming tasks. Add a task above to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map((t) => (
              <div key={t.id} className="card p-3 flex items-center gap-3 animate-fade-in">
                <button
                  onClick={() => toggle(t.id)}
                  className="w-6 h-6 rounded-full border-2 border-primary-300 hover:border-primary-500 flex items-center justify-center shrink-0 transition-colors"
                  aria-label="Mark complete"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary-900 text-sm">{t.name}</p>
                  <div className="flex items-center gap-3 text-xs text-primary-500 mt-0.5">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {t.date}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {t.category}</span>
                  </div>
                </div>
                <button onClick={() => remove(t.id)} className="btn-ghost p-2 text-error-500 hover:bg-error-50" aria-label="Delete task">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="section-title mb-3 flex items-center gap-2">
          <Check className="w-5 h-5 text-success-600" /> Completed Tasks
          <span className="badge bg-success-100 text-success-700">{completed.length}</span>
        </h2>
        {completed.length === 0 ? (
          <div className="card p-6 text-center text-primary-500 text-sm">
            No completed tasks yet.
          </div>
        ) : (
          <div className="space-y-2">
            {completed.map((t) => (
              <div key={t.id} className="card p-3 flex items-center gap-3 opacity-70 animate-fade-in">
                <button
                  onClick={() => toggle(t.id)}
                  className="w-6 h-6 rounded-full bg-success-500 text-white flex items-center justify-center shrink-0"
                  aria-label="Mark incomplete"
                >
                  <Check className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary-900 text-sm line-through">{t.name}</p>
                  <div className="flex items-center gap-3 text-xs text-primary-500 mt-0.5">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {t.date}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {t.category}</span>
                  </div>
                </div>
                <button onClick={() => remove(t.id)} className="btn-ghost p-2 text-error-500 hover:bg-error-50" aria-label="Delete task">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
