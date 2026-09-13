"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert("TRANSOM Login will be connected to Supabase next.");
  };

  return (
    <main className="login-page">
      <div className="overlay"></div>

      <section className="login-card">
        <div className="logo-area">
          <div className="logo">TRANSOM</div>
          <div className="subtitle">FLIGHT SERVICE CAPTURE</div>
        </div>

        <div className="welcome">
          <h1>Welcome Back</h1>
          <p>Sign in to access TRANSOM</p>
        </div>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot">
            <button type="button">Forgot Password?</button>
          </div>

          <button className="login-button" type="submit">
            LOGIN
          </button>
        </form>

        <div className="footer">
          <p>TRANSOM Flight Service Capture</p>
          <span>Authorized Personnel Only</span>
        </div>
      </section>
    </main>
  );
}
