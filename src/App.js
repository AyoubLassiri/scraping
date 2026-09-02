import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeHeader from "./components/HomeHeader";
import Standings from "./components/Standings";
import Squad from "./components/Squad";
import History from "./components/History";
import Footer from "./components/Footer";
import HistoryPage from "./components/HistoryPage"; 
import ScrollToTop from "./components/ScrollToTop"; // Import it here

function HomePage() {
  return (
    <>
      <HomeHeader />
      <Standings />
      <Squad />
      <History />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* Drop it inside the router */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;