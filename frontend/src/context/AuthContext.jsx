import { createContext, useEffect, useState } from "react";

import { getMyProfile } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setUser(null);
        return;
      }

      const response = await getMyProfile();

      if (response.success) {
        setUser(response.user);
      } else {
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    } catch (error) {
      console.error("Fetch user error:", error);

      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};