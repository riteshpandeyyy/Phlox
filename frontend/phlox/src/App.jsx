import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import Campaigns from "./pages/Campaigns";
import CreatorProfileSetup from "./pages/CreatorProfileSetup";
import CreatorProfile from "./pages/CreatorProfile";
import BrandProfile from "./pages/BrandProfile";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignApplications from "./pages/CampaignApplications";
import MyApplications from "./pages/MyApplications";


function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Campaigns />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator-profile-setup"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <CreatorProfileSetup />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator-profile"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <CreatorProfile />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand-profile"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <BrandProfile />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-campaign"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <CreateCampaign />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaign/:campaignId/applications"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <CampaignApplications />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <MyApplications />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;