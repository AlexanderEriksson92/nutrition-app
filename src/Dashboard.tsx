import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RDI_DATA, type Nutrient } from './data/rdi';
import { SWEDISH_FOODS, type SwedishFood } from './data/swedishFoods';
import './Dashboard.css';


interface Product {
    _id: string;
    product_name: string;
    brands: string;
    isLocal?: boolean;
    localData?: SwedishFood;
}

export default function Dashboard({ profile, setProfile, filters, setFilters, intake, setIntake, history, setHistory }: any) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'macros' | 'minerals' | 'vitamins'>('macros');
    const [hasTrained, setHasTrained] = useState(false);
    const [weight, setWeight] = useState<number>(75);
    const [height, setHeight] = useState<number>(180);
    const [localResults, setLocalResults] = useState<Product[]>([]);
    const [apiResults, setApiResults] = useState<Product[]>([]);

    const currentRDI = RDI_DATA[profile as keyof typeof RDI_DATA].nutrients;

    // --- KATEGORISERING ---
    const categories: any = {
        all: Object.keys(currentRDI),
        macros: ['calories', 'protein', 'fat', 'fiber', 'omega3'], // Lade till 'fat'
        minerals: ['iron', 'calcium', 'magnesium', 'zinc', 'potassium', 'selenium', 'copper', 'manganese', 'iodine'],
        vitamins: ['vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK', 'b1', 'b2', 'b3', 'b5', 'b6', 'b7', 'b12', 'folate']
    };

    // --- LOGIK 1: BLIXTSNABB LOKAL SÖKNING ---
    useEffect(() => {
        if (searchQuery.length < 2) {
            setLocalResults([]);
            return;
        }

        const matches = SWEDISH_FOODS.filter(f => {
            const matchesName = f.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesVego = !filters.vego || (f as any).isVego;
            const matchesLaktos = !filters.laktosfritt || (f as any).isLaktosfri;
            const matchesGluten = !filters.glutenfritt || (f as any).isGlutenfri;
            return matchesName && matchesVego && matchesLaktos && matchesGluten;
        }).map(f => ({
            _id: `local-${f.name}`,
            product_name: f.name,
            brands: "Svensk Råvara",
            isLocal: true,
            localData: f
        })).slice(0, 10);

        setLocalResults(matches);
    }, [searchQuery, filters]);

    // --- 2. ASYNKRON API-SÖKNING (OPEN FOOD FACTS) ---
    useEffect(() => {
        if (searchQuery.length < 3) {
            setApiResults([]);
            setLoading(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchQuery}&search_simple=1&action=process&json=1&page_size=6`
                );
                const data = await res.json();

                const mapped = (data.products || [])
                    .filter((p: any) => p.product_name && p.nutriments)
                    .map((p: any) => ({
                        _id: p._id,
                        product_name: p.product_name,
                        brands: p.brands || "Märke saknas",
                        isLocal: true,
                        localData: {
                            name: p.product_name,
                            calories: p.nutriments['energy-kcal_100g'] || 0,
                            protein: p.nutriments.protein_100g || 0,
                            fat: p.nutriments.fat_100g || 0,
                            carbs: p.nutriments.carbohydrates_100g || 0,
                            fiber: p.nutriments.fiber_100g || 0,
                            iron: (p.nutriments.iron_100g || 0) * 1000,
                            vitaminC: (p.nutriments['vitamin-c_100g'] || 0) * 1000,
                        } as any
                    }));
                setApiResults(mapped);
                setLoading(false); // Stänger av laddningen här
            } catch (e) {
                console.error("API-fel:", e);
                setLoading(false); // Stänger av laddningen även vid fel
            }
        }, 600);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // --- 3. SAMMANSTÄLLNING AV RESULTAT ---
    const allResults = [...localResults, ...apiResults];


    // --- LOGIK: LÄGG TILL MAT ---
    const addFoodIntake = (product: Product, amount: number) => {
        if (!product.localData) return;

        const d = product.localData;

        const totalWeight = d.defaultAmount ? amount * d.defaultAmount : amount;
        const ratio = totalWeight / 100;

        setIntake((prev: any) => {
            const newState = { ...prev };
            Object.keys(d).forEach(key => {
                if (key in newState && typeof (d as any)[key] === 'number' && key !== 'defaultAmount') {
                    newState[key] += (d as any)[key] * ratio;
                }
            });
            return newState;
        });

        if (setHistory) {
            setHistory((prev: any) => [{
                id: Date.now(),
                name: product.product_name,
                amount: totalWeight,
                displayAmount: d.defaultAmount ? `${amount} st` : `${amount}g`
            }, ...prev]);
        }

        setSearchResults([]);
        setSearchQuery('');
    };

    // --- LOGIK: COACH TIPS ---
    const getCoachTips = () => {
        const missing: any[] = [];
        const tips: { [key: string]: string } = {
            protein: "Kvarg, ägg eller kyckling",
            iron: "Spenat eller nötfärs",
            vitaminD: "Lax eller berikad mjölk",
            fiber: "Havregryn eller knäckebröd",
            magnesium: "Nötter eller frön",
            potassium: "Banan eller potatis",
            vitaminC: "Satsumas eller paprika"
        };

        Object.entries(currentRDI).forEach(([key, value]) => {
            const nutrientRDI = value as Nutrient;
            const currentVal = intake[key] || 0;
            if (currentVal < nutrientRDI.value) {
                missing.push({
                    name: nutrientRDI.name,
                    diff: (nutrientRDI.value - currentVal).toFixed(1),
                    unit: nutrientRDI.unit,
                    tip: tips[key] || "Se svenska råvaror"
                });
            }
        });
        return missing;
    };

    const resetAll = () => {
        const empty: any = {};
        Object.keys(currentRDI).forEach(key => { empty[key] = 0; });
        setIntake(empty);
        if (setHistory) setHistory([]);
    };

    return (
        <div className="app-container">
            <nav className="navbar-simple">
                <div className="logo">NUTRITION<span>COACH</span></div>
            </nav>

            <main className="dashboard">
                <header className="dash-header">
                    <h1>Dagens Intag</h1>
                    <p>Mål för: {RDI_DATA[profile as keyof typeof RDI_DATA].label}</p>
                </header>

                <div className="main-layout">
                    <div className="left-column">
                        <div className="tab-menu">
                            <button className={activeTab === 'macros' ? 'active' : ''} onClick={() => setActiveTab('macros')}>Macros</button>
                            <button className={activeTab === 'minerals' ? 'active' : ''} onClick={() => setActiveTab('minerals')}>Mineraler</button>
                            <button className={activeTab === 'vitamins' ? 'active' : ''} onClick={() => setActiveTab('vitamins')}>Vitaminer</button>
                        </div>

                        <section className="stats-grid">
                            {categories[activeTab].map((key: string) => {
                                const selectedProfileData = RDI_DATA[profile as keyof typeof RDI_DATA];
                                const nutrientData = (selectedProfileData.nutrients as any)[key] as Nutrient;
                                if (!nutrientData) return null;

                                let targetValue = nutrientData.value;
                                if (key === 'protein') {
                                    targetValue = hasTrained ? weight * 2 : weight * 0.8;
                                }

                                const val = Number(intake[key]) || 0;
                                const pct = (val / targetValue) * 100;

                                return (
                                    <div key={key} className="stat-card" onClick={() => navigate(`/nutrient/${key}`)}>
                                        <div className="nutrient-header">
                                            <span className="nutrient-name">{nutrientData.name}</span>
                                        </div>
                                        <div className="nutrient-value-row">
                                            <span className="current-val">{val.toFixed(1)}</span>
                                            <span className="target-val">/ {targetValue.toFixed(0)}{nutrientData.unit}</span>
                                        </div>
                                        <div className="progress-container">
                                            <div
                                                className="progress-bar"
                                                style={{
                                                    width: `${Math.min(pct, 100)}%`,
                                                    backgroundColor: pct >= 100 ? '#00ff88' : '#00d2ff'
                                                }}
                                            ></div>
                                            <span className="progress-text">{pct.toFixed(0)}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </section>
                    </div>

                    <div className="right-column">
                        {/* SÖK-SEKTION */}
                        <section className="search-area">
                            <div className="search-wrapper" style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Sök råvara (t.ex. kyckling, havregryn)..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                                {loading && (
                                    <div className="search-status" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: '#00d2ff', fontWeight: 'bold' }}>
                                        Hämtar...
                                    </div>
                                )}
                            </div>

                            <div className="results-list">
                                {allResults.map(p => {
                                    // Kontrollera om varan faktiskt har ett styck-värde definierat (t.ex. ägg)
                                    const isPiece = p.localData && p.localData.defaultAmount && p.localData.defaultAmount > 0;

                                    return (
                                        <div key={p._id} className="result-item">
                                            <div className="res-text" onClick={() => navigate(`/product/${p.product_name}`)} style={{ cursor: 'pointer' }}>
                                                <p className="product-name">{p.product_name} ℹ️</p>
                                                <small>{p.brands}</small>
                                            </div>
                                            <div className="amount-controls">
                                                <input
                                                    type="number"
                                                    id={`amt-${p._id}`}
                                                    defaultValue={isPiece ? 1 : 100}
                                                    className="amount-input"
                                                />
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                                    {isPiece ? 'st' : 'g'}
                                                </span>
                                                <button className="add-icon-btn" onClick={() => {
                                                    const input = document.getElementById(`amt-${p._id}`) as HTMLInputElement;
                                                    addFoodIntake(p, Number(input.value) || 1);
                                                }}>+</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* HISTORIK-LISTA */}
                        <section className="history-box">
                            <h2>Idag har du ätit:</h2>
                            <div className="history-list">
                                {history && history.length > 0 ? (
                                    history.map((item: any) => (
                                        <div key={item.id} className="history-item">
                                            <span
                                                onClick={() => navigate(`/product/${item.name}`)}
                                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                {item.name}
                                            </span>
                                            <strong>{item.displayAmount || `${item.amount}g`}</strong>
                                        </div>
                                    ))
                                ) : (
                                    <p className="empty-msg">Ingen mat loggad än.</p>
                                )}
                            </div>
                            <button className="reset-btn" onClick={resetAll}>Nollställ allt</button>
                        </section>

                        {/* COACH REKOMMENDERAR */}
                        <section className="coach-box">
                            <h2>Coach rekommenderar</h2>
                            <div className="tips-list">
                                {getCoachTips().slice(0, 3).map((item, i) => (
                                    <div key={i} className="tip-item">
                                        <p>Du behöver <strong>{item.diff} {item.unit}</strong> mer <strong>{item.name}</strong>.</p>
                                        <small>Tips: {item.tip}</small>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}