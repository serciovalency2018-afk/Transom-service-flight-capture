"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    // LOGIN
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      setLoading(false);
      alert("Login failed. User not found.");
      return;
    }

    // GET USER PROFILE
    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("full_name, role, department")
        .eq("id", user.id)
        .single();

    if (profileError) {
      setLoading(false);

      await supabase.auth.signOut();

      alert(
        "Your account profile was not found. Please contact Management."
      );

      return;
    }

    setLoading(false);

    // MANAGEMENT
    if (profile.role === "management") {
      router.push("/management");
      return;
    }

    // REGULAR USER
    if (profile.role === "user") {
      router.push("/departments");
      return;
    }

    // UNKNOWN ROLE
    await supabase.auth.signOut();

    alert("Your account role is not configured correctly.");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundImage:
          "linear-gradient(rgba(7,29,65,0.55), rgba(7,29,65,0.65)), url('/transom-airport.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(255,255,255,0.97)",
          borderRadius: "16px",
          padding: "40px",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#071d41",
              fontSize: "34px",
              fontWeight: 900,
              letterSpacing: "2px",
            }}
          >
            TRANSOM
          </h1>

          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              color: "#d71920",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "1.5px",
            }}
          >
            FLIGHT SERVICE CAPTURE
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#071d41",
                fontWeight: 700,
              }}
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px",
                borderRadius: "8px",
                border:
                  "1px solid #d0d5dd",
                fontSize: "15px",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#071d41",
                fontWeight: 700,
              }}
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px",
                borderRadius: "8px",
                border:
                  "1px solid #d0d5dd",
                fontSize: "15px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "8px",
              border: "none",
              borderRadius: "8px",
              background: "#d71920",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 800,
              cursor: loading
                ? "not-allowed"
                : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "LOGGING IN..."
              : "LOGIN"}
          </button>
        </form>

        <div
          style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop:
              "1px solid #eaecf0",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: "#667085",
            }}
          >
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </main>
  );
}
