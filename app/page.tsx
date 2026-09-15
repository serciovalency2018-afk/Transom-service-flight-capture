"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("Connecting to Supabase...");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(`SUPABASE ERROR: ${error.message}`);
        setLoading(false);
        return;
      }

      if (data.user) {
        setMessage("LOGIN SUCCESSFUL");
      } else {
        setMessage("No user returned.");
      }
    } catch (error) {
      console.error(error);

      setMessage(
        `CONNECTION ERROR: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    setLoading(false);
  };

  return (
    <main className="login-page">
      <div className="overlay"></div>

      <section className="login-card">
        <div className="logo-area">
          <div className="logo">TRANSOM</div>

          <div className="subtitle">
            FLIGHT SERVICE CAPTURE
          </div>
        </div>

        <div className="welcome">
          <h1>Welcome Back</h1>

          <p>Sign in to access TRANSOM</p>
        </div>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "TESTING..." : "LOGIN"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              borderRadius: "8px",
              background: "#f1f1f1",
              color: "#071d41",
              fontWeight: "600",
              wordBreak: "break-word",
            }}
          >
            {message}
          </div>
        )}

        <div className="footer">
          <p>TRANSOM Flight Service Capture</p>

          <span>Authorized Personnel Only</span>
        </div>
      </section>
    </main>
  );
}
