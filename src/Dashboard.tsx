import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RDI_DATA, type Nutrient } from './data/rdi';
import { SWEDISH_FOODS, type SwedishFood } from './data/swedishFoods';


interface Product {
    _id: string;
    product_name: string;
    brands: string;
    isLocal?: boolean;
    localData?: SwedishFood;
}

export default function Dashboard({ profile, setProfile, intake, setIntake, history, setHistory }: any) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'macros' | 'minerals' | 'vitamins'>('macros');

    const currentRDI = RDI_DATA[profile as keyof typeof RDI_DATA].nutrients;

    // --- KATEGORISERING ---
    const categories: any = {
        all: Object.keys(currentRDI),
        macros: ['calories', 'protein', 'fat', 'fiber', 'omega3'], // Lade till 'fat'
        minerals: ['iron', 'calcium', 'magnesium', 'zinc', 'potassium', 'selenium', 'copper', 'manganese', 'iodine'],
        vitamins: ['vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK', 'b1', 'b2', 'b3', 'b5', 'b6', 'b7', 'b12', 'folate']
    };

    // --- LOGIK: SÖKNING ---
    // Denna körs automatiskt varje gång searchQuery ändras
    useEffect(() => {
        if (searchQuery.length >= 3) {
            const matches: Product[] = SWEDISH_FOODS.filter(f =>
                f.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).slice(0, 10).map(f => ({
                _id: `local-${f.name}`,
                product_name: f.name,
                brands: "Svensk Råvara",
                isLocal: true,
                localData: f
            }));
            setSearchResults(matches);
        } else {
            setSearchResults([]); // Rensa om det är färre än 3 bokstäver
        }
    }, [searchQuery]);

    // --- LOGIK: LÄGG TILL MAT ---
    const addFoodIntake = (product: Product, amount: number) => {
        if (!product.localData) return;
        const ratio = amount / 100;
        const d = product.localData;

        setIntake((prev: any) => {
            const newState = { ...prev };
            Object.keys(d).forEach(key => {
                if (key in newState && typeof (d as any)[key] === 'number') {
                    newState[key] += (d as any)[key] * ratio;
                }
            });
            return newState;
        });

        // Lägg till i historiken (överst i listan)
        if (setHistory) {
            setHistory((prev: any) => [{
                id: Date.now(),
                name: product.product_name,
                amount: amount
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
                <div className="profile-selector">
                    <button className={profile === 'male' ? 'active' : ''} onClick={() => setProfile('male')}>Man</button>
                    <button className={profile === 'female' ? 'active' : ''} onClick={() => setProfile('female')}>Kvinna</button>
                </div>
            </nav>

            <main className="dashboard">
                <header className="dash-header">
                    <h1>Dagens Intag</h1>
                    <p>Mål för: {RDI_DATA[profile as keyof typeof RDI_DATA].label}</p>
                </header>

                <div className="main-layout">
                    <div className="left-column">
                        {/* FLIK-MENY */}
                        <div className="tab-menu">
                            <button className={activeTab === 'macros' ? 'active' : ''} onClick={() => setActiveTab('macros')}>Macros</button>
                            <button className={activeTab === 'minerals' ? 'active' : ''} onClick={() => setActiveTab('minerals')}>Mineraler</button>
                            <button className={activeTab === 'vitamins' ? 'active' : ''} onClick={() => setActiveTab('vitamins')}>Vitaminer</button>
                        </div>

                        <section className="stats-grid">
                            {categories[activeTab].map((key: string) => {
                                const n = currentRDI[key as keyof typeof currentRDI] as Nutrient;
                                if (!n) return null; // Hoppa över om näringsämnet saknas (t.ex. om 'fat' inte finns i RDI än)

                                const val = Number(intake[key]) || 0;
                                const pct = (val / n.value) * 100;

                                return (
                                    <div
                                        key={key}
                                        className="stat-card"
                                        onClick={() => navigate(`/nutrient/${key}`)} // Klicka på kortet för att lära dig mer
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="stat-label-row">
                                            <span className="nutrient-name">{n.name} ⓘ</span>
                                            <span className="nutrient-value">{val.toFixed(1)} <small>({pct.toFixed(0)}%)</small></span>
                                            <div className="progress-bar" style={{
                                                width: `${Math.min(pct, 100)}%`,
                                                backgroundColor: pct >= 100 ? '#00ff88' : '#00d2ff',
                                                boxShadow: pct >= 100 ? '0 0 8px #00ff88' : 'none'
                                            }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </section>
                    </div>

                    <div className="right-column">
                        <section className="search-area">
                            <div className="search-wrapper">
                                <input
                                    type="text"
                                    placeholder="Skriv 3 bokstäver för att söka..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <button className="search-btn">{loading ? '...' : 'Sök'}</button>
                            </div>

                            {searchResults.length > 0 && (
                                <div className="results-dropdown">
                                    {searchResults.map(p => (
                                        <div key={p._id} className="result-item">
                                            <div className="res-text" onClick={() => navigate(`/product/${p.product_name}`)} style={{ cursor: 'pointer' }}>
                                                <p className="product-name">{p.product_name} ℹ️</p>
                                                <small>{p.brands}</small>
                                            </div>
                                            <div className="amount-controls">
                                                <input type="number" id={`amt-${p._id}`} defaultValue={p.localData?.defaultAmount || 100} className="amount-input" />
                                                <button className="add-icon-btn" onClick={() => {
                                                    const input = document.getElementById(`amt-${p._id}`) as HTMLInputElement;
                                                    addFoodIntake(p, Number(input.value) || 100);
                                                }}>+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* HISTORIK-LISTA */}
                        <section className="history-box">
                            <h2>Idag har du ätit:</h2>
                            <div className="history-list">
                                {history && history.length > 0 ? (
                                    history.map((item: any) => (
                                        <div key={item.id} className="history-item">
                                            {/* Vi gör namnet klickbart precis som i sökresultatet */}
                                            <span
                                                onClick={() => navigate(`/product/${item.name}`)}
                                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                {item.name}
                                            </span>
                                            <strong>{item.amount}g</strong>
                                        </div>
                                    ))
                                ) : (
                                    <p className="empty-msg">Ingen mat loggad än.</p>
                                )}
                            </div>
                            <button className="reset-btn" onClick={resetAll}>Nollställ allt</button>
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
                            </div>
                        </section>
                    </div>
                </div >
            </main >
        </div >
    );
}