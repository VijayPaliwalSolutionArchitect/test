import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import EmergentPoints from './pages/EmergentPoints';
import TechRadar from './pages/TechRadar';
import Architectures from './pages/Architectures';
import RiskMap from './pages/RiskMap';
import Roadmap from './pages/Roadmap';
import './styles/globals.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/points" element={<EmergentPoints />} />
            <Route path="/radar" element={<TechRadar />} />
            <Route path="/architectures" element={<Architectures />} />
            <Route path="/risks" element={<RiskMap />} />
            <Route path="/roadmap" element={<Roadmap />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
