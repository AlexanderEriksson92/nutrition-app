import { useState, useEffect } from 'react'
import { RDI_DATA } from './data/rdi'
import type { Nutrient } from './data/rdi'
import './App.css'

// 1. Definitioner för TypeScript
interface Product {
  _id: string;
  product_name: string;
  brands: string;
  image_front_small_url?: string;
  nutriments: {
    proteins_100g?: number;
    fiber_100g?: number;
    'vitamin-d_100g'?: number;
    'vitamin-c_100g'?: number;
    iron_100g?: number;
    magnesium_100g?: number;
    zinc_100g?: number;
    folates_100g?: number;
    [key: string]: any;
  };
}

interface IntakeState {
  [key: string]: number;
}

function App() {
  // 2. States med korrekta typer
  const [profile, setProfile] = useState<'male' | 'female'>('female');
  
  // Laddar initialt värde från localStorage om det finns
  const [intake, setIntake] = useState<IntakeState>(() => {
    const saved = localStorage.getItem('nutrition_intake');
    return saved ? JSON.parse(saved) : {
      protein: 0, fiber: 0, vitaminD: 0, vitaminC: 0,
      iron: 0, magnesium: 0, zinc: 0, folate: 0
    };
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Sparar till localStorage när intake ändras
  useEffect(() => {
    localStorage.setItem('nutrition_intake', JSON.stringify(intake));
  }, [intake]);

  const currentRDI = RDI_DATA[profile].nutrients;

  // 3. API-Logik
  const searchFood = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchQuery}&search_simple=1&action=process&json=1&page_size=6&countries=Sweden`
      );
      const data = await response.json();
      setSearchResults(data.products || []);
    } catch (error) {
      console.error("API-fel:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFoodIntake = (product: Product) => {
    const nut = product.nutriments;
    setIntake((prev) => ({
      ...prev,
      protein: prev.protein + (nut.proteins_100g || 0),
      fiber: prev.fiber + (nut.fiber_100g || 0),
      // Konvertering till rätt enheter (API kör ofta gram)
      vitaminD: prev.vitaminD + ((nut['vitamin-d_100g'] || 0) * 1000000), 
      vitaminC: prev.vitaminC + ((nut['vitamin-c_100g'] || 0) * 1000),
      iron: prev.iron + ((nut.iron_100g || 0) * 1000),
      magnesium: prev.magnesium + ((nut.magnesium_100g || 0) * 1000),
      zinc: prev.zinc + ((nut.zinc_100g || 0) * 1000),
      folate: prev.folate + ((nut.folates_100g || 0) * 1000000)
    }));
    setSearchResults([]);
    setSearchQuery('');
  };

  // 4. Coach-logik
  const getCoachTips = () => {
    const missing: { name: string; diff: string; unit: string; tip: string }[] = [];
    
    Object.entries(currentRDI).forEach(([key, value]) => {
      const nutrientRDI = value as Nutrient;
      const currentVal = intake[key] || 0;
      
      if (currentVal < nutrientRDI.value) {
        const tips: { [key: string]: string } = {
          protein: "Kvarg, ägg eller linser",
          iron: "Spenat, linser eller rött kött",
          vitaminD: "Fet fisk eller berikad mjölk",
          fiber: "Havregryn eller grovt bröd",
          magnesium: "Nötter eller frön"
        };
        
        missing.push({
          name: nutrientRDI.name,
          diff: (nutrientRDI.value - currentVal).toFixed(1),
          unit: nutrientRDI.unit,
          tip: tips[key] || "Se svenska livsmedel"
        });
      }
    });
    return missing;
  };

  return (
    <div className="app-container">
      <nav className="navbar-simple">
        <div className="logo">NUTRITION<span>COACH</span></div>
        <div className="profile-selector">
          <button className={profile === 'male' ? 'active' : ''} onClick={() => setProfile('male')}>Man</button>
          <button className={profile === 'female' ? 'active' : ''} onClick={() => setProfile('female')}>Kvinna</button>
        </div>
      </nav>

      <main className="dashboard">
        <header className="dash-header">
          <h1>Dagens Intag</h1>
          <p>Baserat på {RDI_DATA[profile].label}</p>
        </header>

        <section className="stats-grid">
          {Object.entries(currentRDI).map(([key, value]) => {
            const nutrient = value as Nutrient;
            const currentVal = intake[key] || 0;
            const percent = Math.min((currentVal / nutrient.value) * 100, 100);
            
            return (
              <div key={key} className="stat-card">
                <div className="stat-label-row">
                  <span className="nutrient-name">{nutrient.name}</span>
                  <span className="nutrient-value">{currentVal.toFixed(1)} / {nutrient.value} {nutrient.unit}</span>
                </div>
                <div className="progress-container">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${percent}%`, 
                      backgroundColor: percent >= 100 ? 'var(--accent)' : 'var(--blue)' 
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="coach-box">
          <h2>Coach rekommenderar</h2>
          <div className="tips-list">
            {getCoachTips().slice(0, 3).map((item, i) => (
              <div key={i} className="tip-item">
                <p>Du behöver <strong>{item.diff} {item.unit}</strong> mer <strong>{item.name}</strong>.</p>
                <small>Tips: {item.tip}</small>
              </div>
            ))}
            {getCoachTips().length === 0 && <p className="success">Du har nått alla dina mål!</p>}
          </div>
        </section>

        <section className="search-area">
          <div className="search-wrapper">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchFood()}
              placeholder="Sök svensk produkt..." 
            />
            <button onClick={searchFood} className="search-btn">
              {loading ? '...' : 'Sök'}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="results-dropdown">
              {searchResults.map((product) => (
                <div key={product._id} className="result-item" onClick={() => addFoodIntake(product)}>
                  <img src={product.image_front_small_url || 'https://via.placeholder.com/40'} alt="" />
                  <div className="res-text">
                    <p className="product-name">{product.product_name}</p>
                    <small>{product.brands}</small>
                  </div>
                  <span className="add-icon">+</span>
                </div>
              ))}
            </div>
          )}
          <button 
            className="reset-btn" 
            onClick={() => setIntake({ protein: 0, fiber: 0, vitaminD: 0, vitaminC: 0, iron: 0, magnesium: 0, zinc: 0, folate: 0 })}
          >
            Nollställ dagens intag
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;