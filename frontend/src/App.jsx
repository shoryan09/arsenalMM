import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Table from "./pages/table";
import Squad from "./pages/squad";
import Fixtures from "./pages/fixtures";
import Results from "./pages/results";


function App() {
  return (
    <div className="min-h-screen bg-[#1f1e1d] text-white">
      <Navbar />
      <main className="pt-14">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/table" element={<Table />} />
          <Route path="/squad" element={<Squad />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;