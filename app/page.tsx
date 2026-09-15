"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/departments");
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

          <div className="forgot">
            <button type="button">
              Forgot Password?
            </button>
          </div>

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
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
