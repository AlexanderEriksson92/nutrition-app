import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RDI_DATA, type Nutrient } from './data/rdi';
import { SWEDISH_FOODS, type SwedishFood } from './data/swedishFoods';
import { mealStore } from './utils/mealStore';
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
    const [age, setAge] = useState<number>(30);
    const [height, setHeight] = useState<number>(180);
    const [localResults, setLocalResults] = useState<Product[]>([]);
    const [apiResults, setApiResults] = useState<Product[]>([]);
    const [savedMeals, setSavedMeals] = useState(mealStore.getAll());
    const [mealName, setMealName] = useState('');

    const currentRDI = (RDI_DATA[profile as keyof typeof RDI_DATA] || RDI_DATA.male).nutrients;

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
                    `https://world.openfoodfacts.org/api/v2/search?categories_tags=${searchQuery}&fields=product_name,brands,nutriments,_id&page_size=6`,
                    {
                        headers: {
                            'User-Agent': 'NutritionCoachApp - Web - Version 1.0' // Krävs av OFF
                        }
                    }
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
    const allResults = [
        ...savedMeals.filter(m => m.product_name.toLowerCase().includes(searchQuery.toLowerCase())),
        ...localResults,
        ...apiResults
    ];


    // --- LOGIK: LÄGG TILL MAT ---
    const addFoodIntake = (product: Product, grams: number, displayStr: string) => {
        if (!product.localData) return;

        const d = product.localData;
        const ratio = grams / 100; // All data i filen är per 100g

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
                amount: grams,
                displayAmount: displayStr // Här sparas t.ex. "150g" eller "2 st"
            }, ...prev]);
        }

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
    // --- LOGIK: ÅTERSTÄLL ALLT ---
    const resetAll = () => {
        const empty: any = {};
        Object.keys(currentRDI).forEach(key => { empty[key] = 0; });
        setIntake(empty);
        if (setHistory) setHistory([]);
    };

    const removeItem = (itemToRemove: any) => {
        // 1. Räkna ut hur mycket näring som ska dras av
        const ratio = itemToRemove.amount / 100;
        const foodData = SWEDISH_FOODS.find(f => f.name === itemToRemove.name) ||
            allResults.find(r => r.product_name === itemToRemove.name)?.localData;

        if (foodData) {
            setIntake((prev: any) => {
                const newState = { ...prev };
                Object.keys(foodData).forEach(key => {
                    if (key in newState && typeof (foodData as any)[key] === 'number') {
                        // Dra av näringen (minus istället för plus)
                        newState[key] -= (foodData as any)[key] * ratio;
                    }
                });
                return newState;
            });
        }

        // 2. Ta bort objektet från historik-listan
        setHistory((prev: any) => prev.filter((item: any) => item.id !== itemToRemove.id));
    };

    // --- LOGIK: SPARA MÅLTID ---
    const handleSaveAsMeal = () => {
        if (!mealName.trim() || history.length === 0) {
            alert("Ge rätten ett namn och se till att du har mat i listan!");
            return;
        }

        // Vi sparar det nuvarande 'intake'-objektet (summan av allt i historiken)
        const updated = mealStore.save(mealName, intake);
        setSavedMeals(updated);
        setMealName('');
        alert(`"${mealName}" är sparad!`);
    };

    return (
        <div className="app-container">
            <nav className="navbar-simple">
                <div className="logo">NUTRITION<span>COACH</span></div>
            </nav>

            <main className="dashboard">
                <header className="dash-header">
                    <h1>Dagens Intag</h1>
                    <div className="header-controls">
                        {/* Profilväljare, Ålder och Vikt i en rad */}
                        <div className="user-profile-settings">
                            <div className="profile-switcher">
                                <button
                                    className={profile === 'male' ? 'active' : ''}
                                    onClick={() => setProfile('male')}
                                >Man</button>
                                <button
                                    className={profile === 'female' ? 'active' : ''}
                                    onClick={() => setProfile('female')}
                                >Kvinna</button>
                            </div>

                            <div className="user-specs">
                                <label>
                                    Ålder
                                    <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                                </label>
                                <label>
                                    Vikt (kg)
                                    <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
                                </label>
                            </div>
                            <label className="training-toggle">
                                <input
                                    type="checkbox"
                                    checked={hasTrained}
                                    onChange={() => setHasTrained(!hasTrained)}
                                />
                                <span>Tränat idag? (Dubbelt proteinmål)</span>
                            </label>
                        </div>


                    </div>
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
                                // Använd currentRDI som vi redan definierat säkert på rad 28
                                const nutrientData = (currentRDI as any)[key] as Nutrient;

                                // Om näringsvärdet saknas, hoppa över just detta kort istället för att krascha hela listan
                                if (!nutrientData) return null;

                                let targetValue = nutrientData.value;
                                if (key === 'protein') {
                                    targetValue = hasTrained ? weight * 2 : weight * 0.8;
                                }

                                if (key === 'calories') {
                                    const baseCalories = profile === 'male' ? 2500 : 2000;
                                    const weightAdjustment = (weight - 75) * 10; // +10 kcal per kg över 75
                                    const ageAdjustment = (age - 30) * 5;      // -5 kcal per år över 30
                                    targetValue = baseCalories + weightAdjustment - ageAdjustment;
                                }

                                const val = Number(intake[key]) || 0;
                                const pct = targetValue > 0 ? (val / targetValue) * 100 : 0;
                                return (
                                    <div key={key} className="stat-card" onClick={() => navigate(`/nutrient/${key}`)}>
                                        <div className="nutrient-header">
                                            <span className="nutrient-name">{nutrientData.name}</span>
                                        </div>

                                        <div className="nutrient-value-row">
                                            <span className="current-val">{val.toFixed(1)}</span>
                                            <span className="target-val">
                                                / {targetValue.toFixed(0)}{nutrientData.unit}
                                            </span>
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
                                    // Vi kollar om varan HAR ett styck-pris (defaultAmount)
                                    const hasPieceOption = p.localData && p.localData.defaultAmount && p.localData.defaultAmount > 0;

                                    // Vi använder ett lokalt state eller bara kollar input-fältets id för att avgöra enhet
                                    // För att hålla det enkelt: Om användaren skriver in ett lågt tal (< 10) på en vara med styck-pris, 
                                    // så räknar vi det som styck, annars som gram. 
                                    // ELLER så låter vi användaren skriva vad de vill och vi visar båda enheterna:

                                    return (
                                        <div key={p._id} className="result-item">
                                            <div className="res-text" onClick={() => navigate(`/product/${p.product_name}`)}>
                                                <p className="product-name">{p.product_name} ℹ️</p>
                                                <small>{p.brands} {hasPieceOption && `(1st ≈ ${p.localData?.defaultAmount}g)`}</small>
                                            </div>

                                            <div className="amount-controls">
                                                <input
                                                    type="number"
                                                    id={`amt-${p._id}`}
                                                    defaultValue={hasPieceOption ? 1 : 100}
                                                    className="amount-input"
                                                />

                                                <select id={`unit-${p._id}`} className="unit-selector">
                                                    <option value="g">g</option>
                                                    {hasPieceOption && <option value="st">st</option>}
                                                </select>

                                                <button className="add-icon-btn" onClick={() => {
                                                    const amountInput = document.getElementById(`amt-${p._id}`) as HTMLInputElement;
                                                    const unitSelect = document.getElementById(`unit-${p._id}`) as HTMLSelectElement;
                                                    const val = Number(amountInput.value) || 0;
                                                    const unit = unitSelect.value;

                                                    // Om enheten är 'st', multiplicera med defaultAmount, annars använd värdet som gram
                                                    const finalGrams = unit === 'st' ? val * (p.localData?.defaultAmount || 1) : val;

                                                    addFoodIntake(p, finalGrams, unit === 'st' ? `${val} st` : `${val}g`);
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
                                            <div className="history-item-info">
                                                <span
                                                    onClick={() => navigate(`/product/${item.name}`)}
                                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                >
                                                    {item.name}
                                                </span>
                                                <strong>{item.displayAmount || `${item.amount}g`}</strong>
                                            </div>
                                            <button
                                                className="remove-single-btn"
                                                onClick={() => removeItem(item)}
                                                title="Ta bort"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="empty-msg">Ingen mat loggad än.</p>
                                )}
                            </div>
                            <div className="save-meal-tool" style={{ marginTop: '15px', padding: '10px', borderTop: '1px solid #333' }}>
                                <input
                                    type="text"
                                    placeholder="Namnge denna måltid..."
                                    value={mealName}
                                    onChange={(e) => setMealName(e.target.value)}
                                    className="meal-name-input"
                                    style={{ width: '100%', marginBottom: '8px', padding: '5px', background: '#111', color: '#fff', border: '1px solid #444' }}
                                />
                                <button
                                    onClick={handleSaveAsMeal}
                                    className="save-meal-btn"
                                    style={{ width: '100%', background: '#00d2ff', color: '#000', border: 'none', padding: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    💾 Spara listan som en rätt
                                </button>
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