import { useParams, useNavigate } from 'react-router-dom';
import { SWEDISH_FOODS } from './data/swedishFoods';
import { RDI_DATA } from './data/rdi';
import './ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = SWEDISH_FOODS.find(f => f.name === id);

    if (!product) {
        return (
            <div className="app-container">
                <button className="back-btn" onClick={() => navigate('/')}>
                    Tillbaka
                </button>
            </div>
        );
    }

    const pexelsSearch = encodeURIComponent(product.name + " raw food ingredient");
    const pexelsImage = `https://images.pexels.com/photos/search/${pexelsSearch}?w=800&h=600&fit=crop`;

    const macros = ['calories', 'protein', 'fat', 'fiber', 'omega3'];
    const minerals = ['iron', 'calcium', 'magnesium', 'zinc', 'potassium', 'selenium', 'copper', 'manganese', 'iodine'];
    const vitamins = ['vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK', 'b1', 'b2', 'b3', 'b5', 'b6', 'b7', 'b12', 'folate'];

    const renderNode = (key: string) => {
        const val = (product as any)[key];
        if (val === undefined) return null;

        const info = RDI_DATA.male.nutrients[key as keyof typeof RDI_DATA.male.nutrients];
        if (!info) return null;

        const pct = Math.round((val / info.value) * 100);

        return (
            <div key={key} className="compact-node">
                <div className="node-info">
                    <span className="node-label">{info.name}</span>
                    <span className="node-value">{val}<small>{info.unit}</small></span>
                </div>

                <div className="node-rdi-container">
                    <span className="rdi-text">{pct}%</span>
                    <div className="rdi-mini-bar">
                        <div
                            className="rdi-fill"
                            style={{
                                width: `${Math.min(pct, 100)}%`,
                                backgroundColor: pct > 50 ? 'var(--accent)' : 'var(--blue)'
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="app-container product-page">
            <div className="product-hero">
                <img
                    src={pexelsImage}
                    alt={product.name}
                    className="hero-image"
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = '0';
                    }}
                />
                <div className="hero-overlay"></div>

                <nav className="product-nav-overlay">
                    <button className="back-circle" onClick={() => navigate('/')}>←</button>
                </nav>

                <div className="hero-content">
                    <span className="badge">100g</span>
                    <h1>{product.name}</h1>
                </div>
            </div>

            <div className="compact-layout">
                <section className="macro-section">
                    {macros.map(key => {
                        const info = RDI_DATA.male.nutrients[key as keyof typeof RDI_DATA.male.nutrients];
                        return (
                            <div key={key} className="macro-pill">
                                <span className="pill-label">{info?.name}</span>
                                <span className="pill-value">
                                    {(product as any)[key]}<small>{info?.unit}</small>
                                </span>
                            </div>
                        );
                    })}
                </section>

                <div className="micro-grid-compact">
                    <div className="micro-column">
                        <h3>Mineraler</h3>
                        <div className="node-list">
                            {minerals.map(key => renderNode(key))}
                        </div>
                    </div>

                    <div className="micro-column">
                        <h3>Vitaminer</h3>
                        <div className="node-list">
                            {vitamins.map(key => renderNode(key))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}