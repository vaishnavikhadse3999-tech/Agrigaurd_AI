import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { MyFarm } from '@/pages/MyFarm';
import { CropAdvisor } from '@/pages/CropAdvisor';
import { CropDoctor } from '@/pages/CropDoctor';
import { Weather } from '@/pages/Weather';
import { WaterPage } from '@/pages/WaterPage';
import { Market } from '@/pages/Market';
import { DiseaseAlert } from '@/pages/DiseaseAlert';
import { Organic } from '@/pages/Organic';
import { Planner } from '@/pages/Planner';
import { SellStore } from '@/pages/SellStore';
import { CropBudget } from '@/pages/CropBudget';
import { FarmerQuestions } from '@/pages/FarmerQuestions';
import { TalkToAgriGuard } from '@/pages/TalkToAgriGuard';
import { Intelligence } from '@/pages/Intelligence';
import { ToolsGrid } from '@/pages/ToolsGrid';
import type { FarmProfile, PageKey, Task } from '@/types';
import { loadFarm, saveFarm, loadTasks, saveTasks, uid } from '@/lib/storage';
import { DEMO_FARM, SAMPLE_TASKS } from '@/lib/data';

function App() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [farm, setFarm] = useState<FarmProfile | null>(loadFarm());
  const [tasks, setTasks] = useState<Task[]>(loadTasks());

  useEffect(() => {
    if (tasks.length === 0) {
      const sample: Task[] = SAMPLE_TASKS.map((t) => ({
        id: uid(), name: t.name, date: t.date, category: t.category, completed: false,
      }));
      setTasks(sample);
      saveTasks(sample);
    }
  }, []);

  const navigate = (p: PageKey) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const handleSaveFarm = (f: FarmProfile) => {
    setFarm(f);
    saveFarm(f);
  };

  const handleLoadDemo = () => {
    setFarm(DEMO_FARM);
    saveFarm(DEMO_FARM);
    const demoTasks: Task[] = SAMPLE_TASKS.map((t) => ({
      id: uid(), name: t.name, date: t.date, category: t.category, completed: false,
    }));
    setTasks(demoTasks);
    saveTasks(demoTasks);
    navigate('dashboard');
  };

  const upcomingTasks = tasks.filter((t) => !t.completed).slice(0, 5).map((t) => ({ name: t.name, date: t.date, category: t.category }));

  const back = () => navigate('dashboard');

  return (
    <Layout
      current={page}
      onNavigate={navigate}
      farmName={farm?.farmerName || null}
      onShowTools={() => navigate('intelligence')}
    >
      {page === 'dashboard' && (
        <Dashboard
          farm={farm}
          onNavigate={navigate}
          onLoadDemo={handleLoadDemo}
          upcomingTasks={upcomingTasks}
        />
      )}
      {page === 'my-farm' && (
        <MyFarm farm={farm} onSave={handleSaveFarm} onBack={back} onNavigate={navigate} />
      )}
      {page === 'farmer-questions' && (
        <FarmerQuestions farm={farm} onSave={handleSaveFarm} onBack={back} onNavigate={navigate} />
      )}
      {page === 'talk' && (
        <TalkToAgriGuard farm={farm} onSave={handleSaveFarm} onBack={back} onNavigate={navigate} />
      )}
      {page === 'crop-advisor' && (
        <CropAdvisor farm={farm} onBack={back} onNavigate={navigate} />
      )}
      {page === 'crop-doctor' && (
        <CropDoctor farm={farm} onBack={back} onNavigate={navigate} />
      )}
      {page === 'weather' && <Weather onBack={back} />}
      {page === 'water' && <WaterPage farm={farm} onBack={back} />}
      {page === 'market' && <Market farm={farm} onBack={back} />}
      {page === 'disease-alert' && <DiseaseAlert onBack={back} />}
      {page === 'organic' && <Organic onBack={back} />}
      {page === 'planner' && <Planner onBack={back} />}
      {page === 'sell-store' && <SellStore farm={farm} onBack={back} />}
      {page === 'budget' && <CropBudget farm={farm} onBack={back} onNavigate={navigate} />}
      {page === 'intelligence' && (
        <Intelligence farm={farm} onBack={back} onNavigate={navigate} />
      )}
      {page === 'tools' && <ToolsGrid onNavigate={navigate} onBack={back} />}
    </Layout>
  );
}

export default App;
