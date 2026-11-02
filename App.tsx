import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CostOfLivingUkBudget2026 from "./pages/CostOfLivingUkBudget2026";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cost-of-living-uk-budget-2026" element={<CostOfLivingUkBudget2026 />} />
        {/* Fallback to home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
