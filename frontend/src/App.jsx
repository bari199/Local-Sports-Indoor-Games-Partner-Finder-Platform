import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import Games from "./pages/games/Games";
import GameDetails from "./pages/games/GameDetails";
import Requests from "./pages/requests/Requests";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Players from "./pages/players/Players";
import PlayerProfile from "./pages/players/PlayerProfile";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />

      <Routes>
        {/* Public */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected */}

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players/:id" element={<PlayerProfile />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/:id" element={<GameDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
