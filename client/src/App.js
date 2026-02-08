import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";   // ✅ ADD THIS
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ForgotPassword from "./pages/ForgotPassword";

import Map from "./pages/Map";
import Analyze from "./pages/Analyze";
import Alerts from "./pages/Alerts";
import Rescue from "./pages/Rescue";
import Shelters from "./pages/Shelters";
import Medical from "./pages/Medical";
import History from "./pages/History";
import Dams from "./pages/Dams";

function App() {
  return (
    <Routes>
      {/* 🌟 LANDING PAGE */}
      <Route path="/" element={<Landing />} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot" element={<ForgotPassword />} />

      {/* MAIN DASHBOARD */}
      <Route path="/home" element={<Home />} />
      <Route path="/admin" element={<Admin />} />

      {/* FEATURE ROUTES */}
      <Route path="/map" element={<Map />} />
      <Route path="/analyze" element={<Analyze />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/rescue" element={<Rescue />} />
      <Route path="/shelters" element={<Shelters />} />
      <Route path="/medical" element={<Medical />} />
      <Route path="/history" element={<History />} />
      <Route path="/dams" element={<Dams />} />
    </Routes>
  );
}

export default App;
