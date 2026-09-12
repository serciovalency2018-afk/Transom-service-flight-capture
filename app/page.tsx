"use client";

import { FormEvent, useState } from "react";

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className={"logo " + (dark ? "logo-dark" : "")}>
      <div className="plane-mark" aria-hidden="true">
        <span className="wing wing-top" />
        <span className="wing wing-bottom" />
        <span className="fuselage" />
      </div>
      <span className="logo-divider" />
      <div>
        <div className="brand">TRANSOM</div>
        <div className="brand-sub">FLIGHT SERVICE CAPTURE</div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Authentication will be connected to Supabase in the next step.");
  }

  return (
    <main className="login-shell">
      <section className="hero-panel">
        <div className="hero-overlay" />
        <div className="hero-content">
          <Logo />
          <div className="hero-copy">
            <h1>Safer Flights.<br />On Time. Together.</h1>
            <div className="red-line" />
            <p>
              Efficient flight service capture for<br className="desktop-only" />
              smooth operations and better<br className="desktop-only" />
              aviation experiences.
            </p>
          </div>
          <div className="feature-row">
            <Feature icon="✈" title={<>Flight<br />Management</>} />
            <Feature icon="◇" title={<>Real-time<br />Operations</>} />
            <Feature icon="▥" title={<>Accurate<br />Reporting</>} />
            <Feature icon="♧" title={<>Team<br />Collaboration</>} />
          </div>
        </div>
      </section>

      <section className="form-panel">
        <div className="form-card">
          <Logo dark />
          <div className="welcome">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-icon">♟</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                autoComplete="username"
                required
              />
            </label>

            <label className="field">
              <span className="field-icon">▣</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="eye"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "◉" : "◌"}
              </button>
            </label>

            <button className="login-button" type="submit">
              <span>↪</span> Login
            </button>

            <div className="form-options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="checkmark">{remember ? "✓" : ""}</span>
                Remember me
              </label>
              <button type="button" className="text-button">Forgot password?</button>
            </div>

            <div className="or"><span>OR</span></div>

            <button type="button" className="sso-button">
              <span>◈</span> Login with SSO
            </button>

            {message && <p className="status-message">{message}</p>}
          </form>

          <div className="card-footer">
            <span>Version 1.0.0</span>
            <span>Powered by <strong>TRANSOM</strong></span>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <Logo />
        <span>© 2025 TRANSOM. All rights reserved.</span>
      </footer>
    </main>
  );
}

function Feature({ icon, title }: { icon: string; title: React.ReactNode }) {
  return (
    <div className="feature">
      <div className="feature-icon">{icon}</div>
      <div>{title}</div>
    </div>
  );
}
