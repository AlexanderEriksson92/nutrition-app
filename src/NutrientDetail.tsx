import { useParams, useNavigate } from 'react-router-dom';
import { RDI_DATA } from './data/rdi';

// Här lägger vi faktatexterna (du kan fylla på med fler)
const NUTRIENT_INFO: Record<string, { desc: string; why: string; sources: string }> = {
  // --- MACROS ---
  calories: {
    desc: "Energi som mäts i kilokalorier (kcal). Det är kroppens bensin.",
    why: "Kroppen behöver energi för allt: från att hjärtat ska slå till att du ska kunna springa eller tänka.",
    sources: "Finns i allt, men mest koncentrerat i fett, kolhydrater och protein."
  },
  protein: {
    desc: "Kroppens främsta byggmaterial för vävnader.",
    why: "Behövs för att bygga och reparera muskler, hår, hud och för att immunförsvaret ska fungera.",
    sources: "Kyckling, fisk, bönor, linser, ägg, kvarg och nötter."
  },
  fat: {
    desc: "En viktig energikälla och bärare av fettlösliga vitaminer.",
    why: "Skyddar inre organ, hjälper kroppen att ta upp vitaminer och behövs för hormonproduktion.",
    sources: "Avokado, olivolja, fet fisk, nötter och frön."
  },
  fiber: {
    desc: "Kolhydrater från växtriket som inte bryts ner helt i tunntarmen.",
    why: "Håller igång magen, ger mättnadskänsla och hjälper till att hålla blodsockret jämnt.",
    sources: "Fullkornsprodukter, havregryn, grönsaker, frukt och bönor."
  },
  omega3: {
    desc: "Livsnödvändiga fleromättade fettsyror som kroppen inte kan tillverka själv.",
    why: "Viktigt för hjärnans funktion, synen och för att minska inflammationer i kroppen.",
    sources: "Lax, makrill, valnötter, chiafrön och rapsolja."
  },

  // --- MINERALER ---
  iron: {
    desc: "Ett spårämne som ingår i de röda blodkropparna.",
    why: "Transporterar syre från lungorna ut till kroppens celler. Brist gör dig trött och blek.",
    sources: "Kött, blodpudding, spenat, linser och fullkornsprodukter."
  },
  calcium: {
    desc: "Det mineral vi har mest av i kroppen.",
    why: "Nödvändigt för att bygga starka ben och tänder, samt för nervfunktion och muskelkontraktion.",
    sources: "Mjölkprodukter, berikad havremjölk, broccoli och mandel."
  },
  magnesium: {
    desc: "Ett mineral som deltar i över 300 kemiska reaktioner i kroppen.",
    why: "Hjälper musklerna att slappna av (motverkar kramp) och behövs för proteinsyntesen.",
    sources: "Mörk choklad, spenat, nötter, frön och bananer."
  },
  zinc: {
    desc: "Ett mineral som finns i nästan alla kroppens celler.",
    why: "Viktigt för sårläkning, immunförsvaret och för normal smak- och luktförmåga.",
    sources: "Kött, skaldjur, mejeriprodukter och fullkorn."
  },
  potassium: {
    desc: "Ett grundämne som reglerar vätskebalansen.",
    why: "Viktigt för blodtrycket, musklernas funktion och för hjärtats rytm.",
    sources: "Bananer, potatis, spenat och torkade aprikoser."
  },

  // --- VITAMINER ---
  vitaminA: {
    desc: "Ett fettlösligt vitamin som lagras i levern.",
    why: "Avgörande för mörkerseende, slemhinnor och hudens hälsa.",
    sources: "Morötter (betakaroten), lever, ägg och berikade matfetter."
  },
  vitaminC: {
    desc: "En kraftfull antioxidant som underlättar järnupptaget.",
    why: "Hjälper till att bygga upp bindväv (kollagen) och stödjer immunförsvaret.",
    sources: "Paprika, apelsin, kiwi, broccoli och jordgubbar."
  },
  vitaminD: {
    desc: 'Ofta kallat "solvitaminet" eftersom huden bildar det vid solljus.',
    why: "Nödvändigt för att kroppen ska kunna ta upp kalcium till skelettet. Viktigt för humöret under vintern.",
    sources: "Fet fisk, ägg och berikade mejeriprodukter."
  },
  vitaminB12: {
    desc: "Ett vitamin som främst finns i animaliska livsmedel.",
    why: "Behövs för bildandet av blodkroppar och för nervsystemets funktion.",
    sources: "Kött, fisk, mjölk, ägg och berikade veganska alternativ."
  },
  folate: {
    desc: "En form av B-vitamin (B9) som är viktig för cellförnyelse.",
    why: "Behövs för att bilda nya celler och röda blodkroppar. Särskilt viktigt vid graviditet.",
    sources: "Mörkgröna bladgrönsaker, bönor, kikärter och frukt."
  }
};

export default function NutrientDetail() {
  const { nutrientKey } = useParams();
  const navigate = useNavigate();
  const info = NUTRIENT_INFO[nutrientKey || ""];
  
  // Hämta namnet från RDI_DATA för att få det på svenska (t.ex. "Protein")
  const label = (RDI_DATA.male.nutrients as any)[nutrientKey || ""]?.name || nutrientKey;

  return (
    <div className="app-container">
      <nav className="navbar-simple">
        <button className="back-btn" onClick={() => navigate('/')}>← Tillbaka</button>
        <h1>Om {label}</h1>
      </nav>

      <div className="nutrient-info-card">
        <section>
          <h3>Vad är det?</h3>
          <p>{info?.desc || "Information kommer snart..."}</p>
        </section>
        
        <section style={{ marginTop: '20px' }}>
          <h3>Varför behöver kroppen det?</h3>
          <p>{info?.why || "Detta näringsämne är viktigt för kroppens funktioner."}</p>
        </section>

        <section className="sources-box">
          <h4>Bra källor:</h4>
          <p>{info?.sources || "Varierad kost."}</p>
        </section>
      </div>
    </div>
  );
}