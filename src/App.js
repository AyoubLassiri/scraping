import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomeHeader from "./components/HomeHeader";
import Standings from "./components/Standings";
import StandingsPage from "./components/StandingsPage";
import Squad from "./components/Squad";
import History from "./components/History";
import Footer from "./components/Footer";
import HistoryPage from "./components/HistoryPage";
import ScrollToTop from "./components/ScrollToTop";
import Store from "./components/Store";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import PlayersPage from "./components/PlayersPage";



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
      <ScrollToTop />

      <Toaster position="top-center" dir="rtl" />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/standings" element={<StandingsPage />} />
        <Route path="/store" element={<Store />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
<Route path="/players" element={<PlayersPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;