import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import { loginUser } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // FORM SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser(formData);

      console.log("LOGIN RESPONSE:", response);

      if (!response?.success) {
        toast.error(response?.message || "Login failed");
        return;
      }

      // ========================================================
      // SAVE ACCESS TOKEN
      // ========================================================

      if (response.token) {
        localStorage.setItem(
          "accessToken",
          response.token
        );
      }

      console.log(
        "TOKEN:",
        localStorage.getItem("accessToken")
      );

      // ========================================================
      // FETCH LOGGED-IN USER
      // ========================================================

      await fetchUser();

      console.log("LOGIN USER FETCHED");

      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue finding players and games around you."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* ======================================================
            EMAIL
        ====================================================== */}

        <AuthInput
          label="Email address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />

        {/* ======================================================
            PASSWORD
        ====================================================== */}

        <AuthInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />

        {/* ======================================================
            SUBMIT
        ====================================================== */}

        <button
          type="submit"
          disabled={loading}
          className="
            flex h-11 w-full items-center justify-center
            gap-2 rounded-lg
            bg-[#0078BD]
            text-sm font-semibold text-white
            shadow-sm
            transition
            hover:bg-[#0069A7]
            focus:outline-none
            focus:ring-4
            focus:ring-[#0078BD]/20
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={17} />
              Sign in
            </>
          )}
        </button>

        {/* ======================================================
            REGISTER LINK
        ====================================================== */}

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#0078BD] hover:underline"
          >
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;