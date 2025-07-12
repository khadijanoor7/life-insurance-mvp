import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signup, login } from "../lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginData, setLogin] = useState({ email: "", password: "" });
  const [signupData, setSignup] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) =>
    setLogin({ ...loginData, [e.target.name]: e.target.value });
  const handleSignupChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSignup({ ...signupData, [e.target.name]: e.target.value });

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const res = await login({
      email: loginData.email,
      password: loginData.password,
    });
    setLoading(false);
    if (res.token) {
      setMessage(res.message || "Login successful!");
      setTimeout(() => router.push("/recommendations"), 1000);
    } else {
      setError(res.error || "Login failed");
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    const res = await signup({
      email: signupData.email,
      password: signupData.password,
      firstName: signupData.firstName,
      lastName: signupData.lastName,
    });
    setLoading(false);
    if (res.token) {
      setMessage(res.message || "Signup successful!");
      setTimeout(() => router.push("/recommendations"), 1000);
    } else {
      setError(res.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">LifeGuard</span>
          </div>
        </div>
      </header>
      <motion.main
        className="flex-1 flex flex-col md:flex-row items-center justify-center px-4 py-8 md:py-16 gap-8 md:gap-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        {/* Form Section */}
        <div className="flex-1 flex flex-col items-center md:items-start w-full max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="flex justify-center w-full mb-8">
            <div className="flex rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
              <button
                className={`px-6 py-2 font-semibold transition-colors duration-300 focus:outline-none ${
                  mode === "login"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                className={`px-6 py-2 font-semibold transition-colors duration-300 focus:outline-none ${
                  mode === "signup"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </div>
          </div>
          {message && (
            <div className="mb-4 w-full text-green-600 text-center font-semibold">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 w-full text-red-600 text-center font-semibold">
              {error}
            </div>
          )}
          <AnimatePresence mode="wait" initial={false}>
            {mode === "login" ? (
              <motion.form
                key="login"
                onSubmit={handleLogin}
                className="space-y-5 w-full"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, type: "spring" }}
              >
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    value={loginData.email}
                    onChange={handleLoginChange}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                    autoComplete="current-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 text-lg font-semibold shadow-md transition-colors"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                onSubmit={handleSignup}
                className="space-y-5 w-full"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.35, type: "spring" }}
              >
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="signup-firstName">First Name</Label>
                    <Input
                      id="signup-firstName"
                      name="firstName"
                      required
                      value={signupData.firstName}
                      onChange={handleSignupChange}
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="signup-lastName">Last Name</Label>
                    <Input
                      id="signup-lastName"
                      name="lastName"
                      required
                      value={signupData.lastName}
                      onChange={handleSignupChange}
                      autoComplete="family-name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    required
                    value={signupData.email}
                    onChange={handleSignupChange}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    required
                    value={signupData.password}
                    onChange={handleSignupChange}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-confirmPassword">
                    Confirm Password
                  </Label>
                  <Input
                    id="signup-confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    autoComplete="new-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 text-lg font-semibold shadow-md transition-colors"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        {/* Hero Image Section */}
        <div className="flex-1 flex justify-center items-center w-full max-w-md md:max-w-lg lg:max-w-xl mt-8 md:mt-0">
          <Image
            src="/hero-section-image.png"
            alt="Hero section illustration"
            height={400}
            width={800}
            className="w-full h-auto object-contain drop-shadow-xl"
            style={{ maxHeight: 400 }}
          />
        </div>
      </motion.main>
    </div>
  );
}
