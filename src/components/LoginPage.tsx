import React, { useState } from "react";
import { Lock, Mail, Phone, ArrowRight, EyeOff, Eye, Sparkles } from "lucide-react";
import { loginWithEmail, loginWithPhone } from "@/api/auth";
import { saveAuth } from "@/utils/auth";
import { BRAND } from "@/config/brand";
import {
  createDemoAuthPayload,
  createDemoLoginResponse,
  DEMO_CREDENTIALS,
  matchesDemoCredentials,
} from "@/demo";

interface LoginPageProps {
  onLogin: (user: unknown) => void;
}

type LoginMode = "EMAIL" | "PHONE";

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loginMode, setLoginMode] = useState<LoginMode>("EMAIL");

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeLogin = (data: ReturnType<typeof createDemoLoginResponse>) => {
    saveAuth(createDemoAuthPayload());
    onLogin(data);
  };

  const handleDemoLogin = () => {
    setError(null);
    setIsLoading(true);

    try {
      setLoginMode("EMAIL");
      setEmail(DEMO_CREDENTIALS.email);
      setPassword(DEMO_CREDENTIALS.password);
      completeLogin(createDemoLoginResponse());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Demo login failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (matchesDemoCredentials(loginMode, email, phoneNumber, password)) {
        completeLogin(createDemoLoginResponse());
        return;
      }

      const data =
        loginMode === "EMAIL"
          ? await loginWithEmail(email, password)
          : await loginWithPhone(phoneNumber, password);

      const userEmail = data.user?.email;
      const name =
        userEmail?.split("@")[0] ??
        data.user?.phone ??
        data.user?.name ??
        "User";
      const role = data.user?.role ?? "Trainee";
      const avatarSeed = userEmail ?? data.user?.id ?? name;
      const avatar = `https://api.dicebear.com/6.x/identicon/svg?seed=${encodeURIComponent(
        avatarSeed,
      )}`;

      saveAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: {
          id: data.user?.id ?? "",
          name,
          email: userEmail ?? "",
          role,
          avatar,
        },
      });
      onLogin({
        accessToken: data.accessToken,
        user: data.user,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen brand-gradient-soft flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-brand-green/10 flex flex-col md:flex-row min-h-[560px]">
        {/* Brand panel */}
        <div className="brand-gradient md:w-[42%] p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-brand-yellow/10" />
          <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-brand-yellow/5" />

          <div className="relative z-10">
            <img
              src={BRAND.logo}
              className="w-full max-w-[18rem] h-auto object-contain brightness-0 invert mb-8"
              alt={BRAND.name}
            />
            <h1 className="text-3xl font-bold text-white leading-tight">
              Welcome to
              <br />
              <span className="text-brand-yellow">{BRAND.name}</span>
            </h1>
            <p className="text-white/70 mt-4 text-sm leading-relaxed max-w-xs">
              {BRAND.tagline}. Sign in to access your courses, track progress,
              and earn rewards.
            </p>
          </div>

          <div className="relative z-10 mt-10 space-y-3">
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <div className="w-2 h-2 rounded-full bg-brand-yellow" />
              Learn at your own pace
            </div>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <div className="w-2 h-2 rounded-full bg-brand-yellow" />
              Offline-ready course downloads
            </div>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <div className="w-2 h-2 rounded-full bg-brand-yellow" />
              Track certificates & achievements
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full space-y-6">
            <div className="md:hidden text-center mb-2">
              <img
                src={BRAND.logo}
                className="w-full max-w-[14rem] h-auto object-contain mx-auto mb-4"
                alt={BRAND.name}
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-brand-green">Sign In</h2>
              <p className="text-slate-500 text-sm mt-1">
                Enter your credentials to continue
              </p>
            </div>

            <div className="flex bg-brand-green/5 rounded-xl p-1 border border-brand-green/10">
              <button
                type="button"
                onClick={() => setLoginMode("EMAIL")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${
                  loginMode === "EMAIL"
                    ? "bg-brand-green text-white shadow-sm"
                    : "text-slate-500 hover:text-brand-green"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMode("PHONE")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${
                  loginMode === "PHONE"
                    ? "bg-brand-green text-white shadow-sm"
                    : "text-slate-500 hover:text-brand-green"
                }`}
              >
                Phone
              </button>
            </div>

            <form
              id="truss-ugavi-login-form"
              name="login"
              method="post"
              autoComplete="on"
              className="space-y-5"
              onSubmit={handleSubmit}
            >
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              {loginMode === "EMAIL" ? (
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-semibold text-brand-green mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-green/40 h-5 w-5" />
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="username"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="brand-input pl-10"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="login-phone"
                    className="block text-sm font-semibold text-brand-green mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-green/40 h-5 w-5" />
                    <input
                      id="login-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      placeholder="123-456-7890"
                      className="brand-input pl-10"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-semibold text-brand-green mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-green/40 h-5 w-5" />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="brand-input pl-10 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-brand-green"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full brand-btn-primary py-3.5 flex items-center justify-center gap-2 text-base"
              >
                {isLoading ? "Signing in…" : "Sign In"}
                {!isLoading && <ArrowRight size={18} />}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full rounded-xl border-2 border-brand-green/20 bg-brand-green/5 py-3 text-brand-green font-semibold flex items-center justify-center gap-2 hover:bg-brand-green/10 transition-colors disabled:opacity-60"
              >
                <Sparkles size={18} />
                Try Demo Account
              </button>

              <p className="text-xs text-center text-slate-500 leading-relaxed">
                Demo login:{" "}
                <span className="font-medium text-brand-green">
                  {DEMO_CREDENTIALS.email}
                </span>{" "}
                /{" "}
                <span className="font-medium text-brand-green">
                  {DEMO_CREDENTIALS.password}
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
