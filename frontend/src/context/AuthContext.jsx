import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getMyProfile } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ============================================================
     FETCH LOGGED-IN USER
  ============================================================ */

  const fetchUser = async () => {
    try {
      const token =
        localStorage.getItem("accessToken");

      if (!token) {
        setUser(null);
        return null;
      }

      const response = await getMyProfile();

      if (response.success && response.user) {
        setUser(response.user);

        // IMPORTANT:
        // Return user so Login.jsx can check role
        return response.user;
      }

      localStorage.removeItem("accessToken");
      setUser(null);

      return null;
    } catch (error) {
      console.error("Fetch user error:", error);

      localStorage.removeItem("accessToken");
      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     INITIAL AUTH CHECK
  ============================================================ */

  useEffect(() => {
    fetchUser();
  }, []);

  /* ============================================================
     LOGOUT
  ============================================================ */

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ============================================================
   useAuth HOOK
============================================================ */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};