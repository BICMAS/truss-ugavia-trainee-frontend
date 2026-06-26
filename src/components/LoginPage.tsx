import React, { useState } from "react";
import {
  Lock,
  Mail,
  Phone,
  ArrowRight,
  EyeOff,
  Eye,
  Sparkles,
  BookOpen,
  Download,
  Award,
} from "lucide-react";
import { loginWithEmail, loginWithPhone } from "@/api/auth";
import { saveAuth } from "@/utils/auth";
import { BRAND } from "@/config/brand";
import {
  createDemoAuthPayload,
  createDemoLoginResponse,
  DEMO_ACCOUNTS,
  DEMO_CREDENTIALS,
  type DemoAccount,
  findDemoAccount,
} from "@/demo";

interface LoginPageProps {
  onLogin: (user: unknown) => void;
}

type LoginMode = "EMAIL" | "PHONE";

const FEATURES = [
  { icon: BookOpen, label: "Learn at your pace" },
  { icon: Download, label: "Offline downloads" },
  { icon: Award, label: "Certificates" },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loginMode, setLoginMode] = useState<LoginMode>("EMAIL");

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeLogin = (account: DemoAccount) => {
    saveAuth(createDemoAuthPayload(account));
    onLogin(createDemoLoginResponse(account));
  };

  const handleDemoLogin = () => {
    setError(null);
    setIsLoading(true);

    try {
      setLoginMode("EMAIL");
      setEmail(DEMO_CREDENTIALS.email);
      setPassword(DEMO_CREDENTIALS.password);
      completeLogin(DEMO_ACCOUNTS[0]);
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
      const demoAccount = findDemoAccount(
        loginMode,
        email,
        phoneNumber,
        password,
      );
      if (demoAccount) {
        completeLogin(demoAccount);
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
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh brand-gradient-soft flex flex-col md:items-center md:justify-center md:p-8">
      {/* Mobile hero */}
      <div className="brand-gradient relative overflow-hidden px-safe pt-safe px-5 pb-10 md:hidden">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-brand-yellow/10" />
        <div className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-brand-yellow/5" />

        <div className="relative z-10 mx-auto max-w-md">
          <img
            src={BRAND.logo}
            alt={BRAND.name}
            className="mx-auto h-auto w-full max-w-[11rem] object-contain"
          />
          <p className="mt-3 text-center text-xs font-semibold uppercase tracking-widest text-brand-yellow">
            {BRAND.tagline}
          </p>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FEATURES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/90"
              >
                <Icon size={13} className="text-brand-yellow" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="flex w-full max-w-5xl flex-1 flex-col overflow-hidden bg-white md:min-h-[560px] md:flex-row md:rounded-3xl md:border md:border-brand-green/10 md:shadow-2xl">
        {/* Desktop brand panel */}
        <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden brand-gradient p-10 md:flex">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-brand-yellow/10" />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand-yellow/5" />

          <div className="relative z-10">
            <img
              src={BRAND.logo}
              alt={BRAND.name}
              className="mb-8 h-auto w-full max-w-[18rem] object-contain"
            />
            <h1 className="text-3xl font-bold leading-tight text-white">
              Welcome to
              <br />
              <span className="text-brand-yellow">{BRAND.name}</span>
            </h1>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              {BRAND.tagline}. Sign in to access your courses, track progress,
              and earn rewards.
            </p>
          </div>

          <div className="relative z-10 mt-10 space-y-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 text-sm text-white/80"
              >
                <Icon size={16} className="text-brand-yellow" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Form panel */}
        <div className="relative z-10 flex flex-1 flex-col px-safe pb-safe md:pb-0">
          <div className="-mt-6 flex-1 overflow-y-auto rounded-t-[1.75rem] bg-white px-5 py-6 sm:px-8 sm:py-8 md:mt-0 md:rounded-none md:overflow-visible md:flex md:flex-col md:justify-center md:p-10">
            <div className="mx-auto w-full max-w-sm space-y-5 sm:space-y-6">
              <div>
                <h2 className="text-xl font-bold text-brand-green sm:text-2xl">
                  Sign In
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter your credentials to continue
                </p>
              </div>

              <div className="flex rounded-xl border border-brand-green/10 bg-brand-green/5 p-1">
                <button
                  type="button"
                  onClick={() => setLoginMode("EMAIL")}
                  className={`min-h-11 flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                    loginMode === "EMAIL"
                      ? "bg-brand-green text-white shadow-sm"
                      : "text-slate-500 active:bg-brand-green/5"
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode("PHONE")}
                  className={`min-h-11 flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                    loginMode === "PHONE"
                      ? "bg-brand-green text-white shadow-sm"
                      : "text-slate-500 active:bg-brand-green/5"
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
                className="space-y-4 sm:space-y-5"
                onSubmit={handleSubmit}
              >
                {error && (
                  <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {loginMode === "EMAIL" ? (
                  <div>
                    <label
                      htmlFor="login-email"
                      className="mb-2 block text-sm font-semibold text-brand-green"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-green/40" />
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
                        className="brand-input"
                        style={{ paddingLeft: "40px" }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="login-phone"
                      className="mb-2 block text-sm font-semibold text-brand-green"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-green/40" />
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
                        className="brand-input"
                        style={{ paddingLeft: "40px" }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-2 block text-sm font-semibold text-brand-green"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-green/40" />
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
                      className="brand-input pr-12"
                      style={{ paddingLeft: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 active:text-brand-green"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="brand-btn-primary flex min-h-12 w-full items-center justify-center gap-2 py-3.5 text-base"
                >
                  {isLoading ? "Signing in…" : "Sign In"}
                  {!isLoading && <ArrowRight size={18} />}
                </button>

                <div className="relative py-1">
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
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-brand-green/20 bg-brand-green/5 py-3 font-semibold text-brand-green transition-colors active:bg-brand-green/10 disabled:opacity-60"
                >
                  <Sparkles size={18} />
                  Try Demo Account
                </button>

                <div className="rounded-xl border border-brand-green/10 bg-brand-green/5 p-3 text-center">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Demo credentials
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold text-brand-green">
                    {DEMO_CREDENTIALS.email}
                  </p>
                  <p className="text-sm font-semibold text-brand-green">
                    {DEMO_CREDENTIALS.password}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
