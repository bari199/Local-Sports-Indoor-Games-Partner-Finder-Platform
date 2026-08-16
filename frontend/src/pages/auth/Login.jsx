import { useState } from "react";
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

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      // ========================================================
      // LOGIN
      // ========================================================

      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("LOGIN RESPONSE:", response);

      // --------------------------------------------------------
      // LOGIN FAILED
      // --------------------------------------------------------

      if (!response?.success) {
        toast.error(
          response?.message || "Login failed"
        );

        return;
      }

      // ========================================================
      // SAVE ACCESS TOKEN
      // ========================================================

      if (!response?.token) {
        toast.error(
          "Login successful, but authentication token was not received."
        );

        return;
      }

      localStorage.setItem(
        "accessToken",
        response.token
      );

      console.log(
        "TOKEN:",
        localStorage.getItem("accessToken")
      );

      // ========================================================
      // FETCH CURRENT USER
      // ========================================================

      const loggedInUser = await fetchUser();

      console.log(
        "LOGGED-IN USER:",
        loggedInUser
      );

      // --------------------------------------------------------
      // USER FETCH FAILED
      // --------------------------------------------------------

      if (!loggedInUser) {
        toast.error(
          "Unable to load your account information."
        );

        return;
      }

      // ========================================================
      // SUCCESS
      // ========================================================

      toast.success("Login successful");

      // ========================================================
      // ROLE-BASED REDIRECT
      // ========================================================

      if (loggedInUser.role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        navigate("/dashboard", {
          replace: true,
        });
      }
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
            LOGIN BUTTON
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
            className="
              font-semibold
              text-[#0078BD]
              hover:underline
            "
          >
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;