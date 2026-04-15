import { useState, useEffect } from "react";
import { X, Leaf } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import { forgotPassword, login, register, resetPassword } from "../../store/slices/authSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { authUser, isSigningUp, isLoggingIn, isRequestingForToken, isUpdatingPassword } =
    useSelector((state) => state.auth);
  const { isAuthPopupOpen } = useSelector((state) => state.popup);

  const [mode, setMode] = useState("signin"); // signin | signup | forgot | reset

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (location.pathname.startsWith("/password/reset")) {
      setMode("reset");
      dispatch(toggleAuthPopup());
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (authUser) {
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    }
  }, [authUser]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "forgot") {
      dispatch(forgotPassword({ email: formData.email }));
      return;
    }
    if (mode === "reset") {
      const token = location.pathname.split("/").pop();
      dispatch(resetPassword({ token, password: formData.password, confirmPassword: formData.confirmPassword }));
      return;
    }

    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);

    if (mode === "signup") {
      data.append("name", formData.name);
      dispatch(register(data));
    } else {
      dispatch(login(data));
    }
  };

  if (!isAuthPopupOpen || authUser) return null;

  const isLoading = isLoggingIn || isSigningUp || isRequestingForToken || isUpdatingPassword;

  const inputClass = "w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 text-sm font-medium text-foreground placeholder-muted-foreground transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/40 animate-fade-in"
        onClick={() => dispatch(toggleAuthPopup())}
      />

      {/* modal card */}
      <div className="relative z-10 bg-card border border-border rounded-2xl w-full max-w-md mx-4 shadow-panel animate-scale-in overflow-hidden">
        {/* green top bar */}
        <div className="bg-brand-green px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 text-accent-foreground" strokeWidth={2.5} />
            </div>
            <h2 className="text-white font-bold text-base">
              {mode === "signup" ? "Create Account"
                : mode === "forgot" ? "Reset Password"
                : mode === "reset"  ? "New Password"
                : "Welcome back"}
            </h2>
          </div>
          <button
            onClick={() => dispatch(toggleAuthPopup())}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* form body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Full name"
                className={inputClass}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            )}

            {mode !== "reset" && (
              <input
                type="email"
                placeholder="Email address"
                className={inputClass}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            )}

            {mode !== "forgot" && (
              <input
                type="password"
                placeholder="Password"
                className={inputClass}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            )}

            {mode === "reset" && (
              <input
                type="password"
                placeholder="Confirm password"
                className={inputClass}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            )}

            {mode === "signin" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs font-semibold text-primary hover:text-primary/70 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? "Processing…"
                : mode === "signup" ? "Create Account"
                : mode === "forgot" ? "Send Reset Link"
                : mode === "reset"  ? "Reset Password"
                : "Sign In"}
            </button>
          </form>

          {(mode === "signin" || mode === "signup") && (
            <div className="mt-5 pt-4 border-t border-border text-center">
              <button
                type="button"
                onClick={() => setMode((prev) => (prev === "signin" ? "signup" : "signin"))}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                <span className="text-primary">{mode === "signin" ? "Sign up" : "Sign in"}</span>
              </button>
            </div>
          )}

          {mode === "forgot" && (
            <div className="mt-5 pt-4 border-t border-border text-center">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to <span className="text-primary">Sign in</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
