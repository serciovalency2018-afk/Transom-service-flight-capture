"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      router.push("/departments");
    } catch {
      alert("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="background-overlay" />

      <header className="top-bar">
        <div className="brand-mark">T</div>
        <div>
          <div className="brand-name">TRANSOM</div>
          <div className="brand-subtitle">AVIATION SERVICES</div>
        </div>
        <div className="top-status">
          <span className="status-dot" />
          FLIGHT OPERATIONS
        </div>
      </header>

      <section className="login-layout">
        <div className="welcome-panel">
          <div className="eyebrow">
            <span />
            OPERATIONAL EXCELLENCE
          </div>

          <h1>
            Every flight.
            <br />
            <span>Every detail.</span>
            <br />
            One standard.
          </h1>

          <div className="gold-line" />

          <p className="welcome-description">
            Your operations. Your team. Your record.
            <br />
            One platform for flight service capture
            and operational coordination.
          </p>

          <div className="feature-list">
            <div className="feature">
              <span className="feature-icon">01</span>
              <div>
                <strong>FLIGHT OPERATIONS</strong>
                <p>Organized operational records</p>
              </div>
            </div>

            <div className="feature">
              <span className="feature-icon">02</span>
              <div>
                <strong>TEAM COORDINATION</strong>
                <p>Connected departments and teams</p>
              </div>
            </div>

            <div className="feature">
              <span className="feature-icon">03</span>
              <div>
                <strong>ACCOUNTABILITY</strong>
                <p>Accurate service capture</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="card-emblem">
            <div className="emblem-inner">T</div>
          </div>

          <div className="card-heading">
            <div className="welcome-label">WELCOME BACK</div>
            <h2>Sign in to your account</h2>
            <p>Enter your credentials to access the platform.</p>
          </div>

          <form onSubmit={handleLogin}>
            <label htmlFor="email">EMAIL ADDRESS</label>
            <div className="input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
              </svg>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="password-label">
              <label htmlFor="password">PASSWORD</label>
            </div>

            <div className="input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            <div className="forgot-row">
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Please contact Management to reset your password."
                  )
                }
              >
                Forgot password?
              </button>
            </div>

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? "AUTHENTICATING..." : "SIGN IN"}</span>
              {!loading && <span className="button-arrow">→</span>}
            </button>
          </form>

          <div className="security-note">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>SECURE ACCESS · AUTHORIZED PERSONNEL ONLY</span>
          </div>
        </div>
      </section>

      <footer className="page-footer">
        <span>TRANSOM FLIGHT SERVICE CAPTURE</span>
        <span>PRECISION · SAFETY · EXCELLENCE</span>
      </footer>

      <style jsx>{`
        .login-page {
          --navy: #071a35;
          --navy-light: #10294a;
          --gold: #d7b56d;
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          min-height: 100svh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 28px 6%;
          box-sizing: border-box;
          color: white;
          font-family: Arial, Helvetica, sans-serif;
          background-color: var(--navy);
          background-image: url("/transom-airport.jpg");
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        .background-overlay {
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(90deg,
              rgba(4, 17, 37, 0.96) 0%,
              rgba(5, 22, 45, 0.88) 45%,
              rgba(5, 19, 39, 0.75) 100%),
            linear-gradient(0deg,
              rgba(3, 14, 30, 0.65),
              transparent 60%);
        }

        .top-bar {
          display: flex;
          align-items: center;
          gap: 13px;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
        }

        .brand-mark {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border: 1px solid var(--gold);
          color: var(--gold);
          font-size: 27px;
          font-weight: 900;
          font-style: italic;
        }

        .brand-name {
          font-size: 21px;
          font-weight: 900;
          letter-spacing: 3px;
        }

        .brand-subtitle {
          margin-top: 4px;
          color: var(--gold);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2.4px;
        }

        .top-status {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-left: auto;
          color: #e4eaf2;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.6px;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 12px #d7b56d80;
        }

        .login-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(340px, 440px);
          gap: clamp(40px, 8vw, 120px);
          align-items: center;
          width: 100%;
          max-width: 1240px;
          margin: 60px auto;
        }

        .welcome-panel {
          max-width: 610px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--gold);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .eyebrow span {
          width: 28px;
          height: 2px;
          background: var(--gold);
        }

        .welcome-panel h1 {
          margin: 25px 0 0;
          font-size: clamp(39px, 5.1vw, 68px);
          line-height: 1.12;
          font-weight: 800;
          letter-spacing: -2px;
        }

        .welcome-panel h1 span {
          color: var(--gold);
        }

        .gold-line {
          width: 65px;
          height: 3px;
          margin: 27px 0 22px;
          background: var(--gold);
        }

        .welcome-description {
          color: #d5deea;
          font-size: 14px;
          line-height: 1.9;
        }

        .feature-list {
          display: grid;
          gap: 20px;
          margin-top: 36px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .feature-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 39px;
          height: 39px;
          border: 1px solid #d7b56d75;
          color: var(--gold);
          font-size: 12px;
          font-weight: 800;
        }

        .feature strong {
          font-size: 10px;
          letter-spacing: 1.5px;
        }

        .feature p {
          margin: 5px 0 0;
          color: #bac7d7;
          font-size: 12px;
        }

        .login-card {
          width: 100%;
          box-sizing: border-box;
          padding: 38px 34px 28px;
          color: var(--navy);
          background: #ffffff;
          border-top: 4px solid var(--gold);
          border-radius: 5px;
          box-shadow: 0 25px 80px #00000040;
        }

        .card-emblem {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          margin-bottom: 24px;
          border: 1px solid #d7b56d;
          transform: rotate(45deg);
        }

        .emblem-inner {
          display: grid;
          place-items: center;
          width: 37px;
          height: 37px;
          background: var(--navy);
          color: var(--gold);
          font-size: 24px;
          font-weight: 900;
          font-style: italic;
          transform: rotate(-45deg);
        }

        .welcome-label {
          color: #a47d30;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2.5px;
        }

        .card-heading h2 {
          margin: 10px 0 8px;
          font-size: 25px;
          line-height: 1.25;
          letter-spacing: -0.7px;
        }

        .card-heading p {
          margin: 0 0 29px;
          color: #697586;
          font-size: 12px;
          line-height: 1.7;
        }

        form label {
          display: block;
          margin-bottom: 10px;
          color: #243650;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .input-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          height: 49px;
          padding: 0 13px;
          box-sizing: border-box;
          border: 1px solid #dce2ea;
          border-radius: 4px;
          background: #fbfcfe;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input-wrap:focus-within {
          border-color: #a47d30;
          box-shadow: 0 0 0 3px #d7b56d20;
        }

        .input-wrap svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          fill: none;
          stroke: #7d8a9d;
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .input-wrap input {
          width: 100%;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          color: #10213c;
          font-size: 13px;
        }

        .input-wrap input::placeholder {
          color: #a0a9b7;
        }

        .password-label {
          display: flex;
          justify-content: space-between;
          margin-top: 22px;
        }

        .password-label label {
          margin-bottom: 10px;
        }

        .show-password {
          flex-shrink: 0;
          padding: 5px 0 5px 5px;
          border: none;
          background: transparent;
          color: #8a6b2c;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin: 13px 0 22px;
        }

        .forgot-row button {
          padding: 0;
          border: none;
          background: transparent;
          color: #8a6b2c;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .login-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-height: 51px;
          padding: 0 18px;
          border: 1px solid var(--gold);
          border-radius: 4px;
          background: var(--navy);
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .login-button:hover:not(:disabled) {
          background: #153456;
          transform: translateY(-1px);
        }

        .login-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .button-arrow {
          color: var(--gold);
          font-size: 21px;
          font-weight: 400;
        }

        .security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid #edf0f4;
          color: #7a8697;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-align: center;
        }

        .security-note svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          fill: none;
          stroke: #a47d30;
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .page-footer {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding-top: 18px;
          border-top: 1px solid #ffffff30;
          color: #d2dbe7;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        @media (min-width: 1500px) {
          .login-page {
            padding-right: 8%;
            padding-left: 8%;
          }
        }

        @media (max-width: 850px) {
          .login-page {
            padding: 22px 5%;
          }

          .login-layout {
            grid-template-columns: minmax(0, 1fr) minmax(310px, 390px);
            gap: 30px;
            margin: 45px auto;
          }

          .welcome-panel h1 {
            font-size: clamp(35px, 5vw, 48px);
          }

          .feature-list {
            gap: 15px;
          }

          .login-card {
            padding: 30px 24px 24px;
          }

          .top-status {
            font-size: 8px;
            letter-spacing: 1px;
          }
        }

        @media (max-width: 650px) {
          .login-page {
            padding: 20px 18px;
            background-position: 55% center;
          }

          .background-overlay {
            background: rgba(4, 17, 37, 0.87);
          }

          .brand-mark {
            width: 38px;
            height: 38px;
            font-size: 23px;
          }

          .brand-name {
            font-size: 17px;
            letter-spacing: 2px;
          }

          .brand-subtitle {
            font-size: 8px;
            letter-spacing: 1.5px;
          }

          .top-status {
            gap: 6px;
            font-size: 7px;
            letter-spacing: 0.5px;
          }

          .login-layout {
            grid-template-columns: minmax(0, 1fr);
            gap: 30px;
            max-width: 440px;
            margin: 43px auto;
          }

          .welcome-panel h1 {
            margin-top: 19px;
            font-size: clamp(39px, 10vw, 52px);
          }

          .welcome-description {
            font-size: 12px;
          }

          .feature-list {
            display: none;
          }

          .gold-line {
            margin: 19px 0 16px;
          }

          .login-card {
            padding: 30px 23px 23px;
          }

          .card-emblem {
            margin-bottom: 20px;
          }

          .card-heading h2 {
            font-size: 23px;
          }

          .page-footer {
            flex-direction: column;
            gap: 9px;
            font-size: 8px;
            line-height: 1.6;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .input-wrap,
          .login-button {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
