import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/Home";
import Table from "./pages/table";
import Squad from "./pages/squad";
import Fixtures from "./pages/fixtures";
import Results from "./pages/results";
import News from "./pages/news";

function App() {
  return (
    <div className="min-h-screen bg-[#1f1e1d] text-white flex flex-col">
      <Navbar />
      <main className="pt-14 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/table" element={<Table />} />
          <Route path="/squad" element={<Squad />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/results" element={<Results />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;