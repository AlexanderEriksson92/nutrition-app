import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RDI_DATA } from './data/rdi';
import Dashboard from './Dashboard';
import ProductDetail from './ProductDetail';
import './App.css';
import NutrientDetail from './NutrientDetail'; // Importera


export default function App() {
  const [filters, setFilters] = useState({
    vego: false,
    laktosfritt: false,
    glutenfritt: false
  });
  const [profile, setProfile] = useState<'male' | 'female'>('female');

  // 1. Skapa state för intag (mätarna)
  const [intake, setIntake] = useState(() => {
    const saved = localStorage.getItem('nutrition_intake');
    if (saved) return JSON.parse(saved);
    const empty: any = {};
    Object.keys(RDI_DATA.male.nutrients).forEach(key => { empty[key] = 0; });
    return empty;
  });

  // 2. Skapa state för historik (listan)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('nutrition_history');
    return saved ? JSON.parse(saved) : [];
  });

  // 3. Spara båda till localStorage automatiskt
  useEffect(() => {
    localStorage.setItem('nutrition_intake', JSON.stringify(intake));
    localStorage.setItem('nutrition_history', JSON.stringify(history));
  }, [intake, history]);

  return (
    <Routes>
      <Route path="/" element={
        <Dashboard
          profile={profile}
          setProfile={setProfile}
          filters={filters}
          setFilters={setFilters}
          intake={intake}
          setIntake={setIntake}
          history={history}
          setHistory={setHistory}
        />
      } />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/nutrient/:nutrientKey" element={<NutrientDetail />} />
    </Routes>
  );
}