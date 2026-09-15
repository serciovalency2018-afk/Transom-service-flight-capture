"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type Profile = {
  id: string;
  full_name: string;
  role: string;
  department: string;
};

const departmentNames: Record<string, string> = {
  ramp: "RAMP DEPARTMENT",
  sorting: "SORTING DEPARTMENT",
  load_control_ops: "LOAD CONTROL / OPS",
  passenger_services: "PASSENGER SERVICES",
  cargo: "CARGO DEPARTMENT",
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = async () => {
    setLoadingProfile(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUserLoggedIn(false);
      setProfile(null);
      setLoadingProfile(false);
      return;
    }

    setUserLoggedIn(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, department")
      .eq("id", user.id)
      .single();

    if (error) {
      alert("Profile error: " + error.message);
      setLoadingProfile(false);
      return;
    }

    setProfile(data);
    setLoadingProfile(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

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

    await loadProfile();
  };

  const handleDepartmentSelect = (department: string) => {
    router.push(`/flights?department=${department}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUserLoggedIn(false);
    setProfile(null);
    setEmail("");
    setPassword("");
  };

  if (loadingProfile) {
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
            <h1>Loading...</h1>

            <p>
              Loading your TRANSOM profile.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (userLoggedIn && profile) {
    const isManagement =
      profile.role === "management";

    return (
      <main className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <div className="dashboard-logo">
              TRANSOM
            </div>

            <div className="dashboard-subtitle">
              FLIGHT SERVICE CAPTURE
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            LOGOUT
          </button>
        </header>

        <section className="dashboard-content">
          <div className="welcome-section">
            <h1>Select Department</h1>

            <p>
              Choose the department you want to
              access.
            </p>
          </div>

          <section className="flights-section">
            <div style={{ padding: "30px" }}>
              <div
                style={{
                  marginBottom: "30px",
                }}
              >
                <strong>Logged in as:</strong>

                <p
                  style={{
                    marginTop: "8px",
                  }}
                >
                  {profile.full_name}
                </p>

                <p
                  style={{
                    marginTop: "5px",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  Role: {profile.role}
                </p>
              </div>

              {isManagement ? (
                <>
                  <h2
                    style={{
                      marginBottom: "20px",
                      color: "#071d41",
                    }}
                  >
                    All Departments
                  </h2>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {Object.entries(
                      departmentNames
                    ).map(([key, name]) => (
                      <button
                        key={key}
                        onClick={() =>
                          handleDepartmentSelect(
                            key
                          )
                        }
                        style={{
                          padding: "30px 20px",
                          borderRadius: "12px",
                          border:
                            "1px solid #d9e0ea",
                          background:
                            "#ffffff",
                          color: "#071d41",
                          fontSize: "17px",
                          fontWeight: 700,
                          cursor: "pointer",
                          minHeight: "120px",
                        }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2
                    style={{
                      marginBottom: "20px",
                      color: "#071d41",
                    }}
                  >
                    Your Department
                  </h2>

                  <button
                    onClick={() =>
                      handleDepartmentSelect(
                        profile.department
                      )
                    }
                    style={{
                      width: "100%",
                      maxWidth: "500px",
                      padding: "35px 20px",
                      borderRadius: "12px",
                      border: "none",
                      background: "#071d41",
                      color: "#ffffff",
                      fontSize: "18px",
                      fontWeight: 700,
                      cursor: "pointer",
                      minHeight: "140px",
                    }}
                  >
                    {departmentNames[
                      profile.department
                    ] || profile.department}
                  </button>
                </>
              )}
            </div>
          </section>
        </section>

        <footer className="dashboard-footer">
          <p>
            TRANSOM Flight Service Capture
          </p>

          <span>
            Authorized Personnel Only
          </span>
        </footer>
      </main>
    );
  }

  return (
    <main className="login-page">
      <div className="overlay"></div>

      <section className="login-card">
        <div className="logo-area">
          <div className="logo">
            TRANSOM
          </div>

          <div className="subtitle">
            FLIGHT SERVICE CAPTURE
          </div>
        </div>

        <div className="welcome">
          <h1>Welcome Back</h1>

          <p>
            Sign in to access TRANSOM
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
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
            {loading
              ? "LOGGING IN..."
              : "LOGIN"}
          </button>
        </form>

        <div className="footer">
          <p>
            TRANSOM Flight Service Capture
          </p>

          <span>
            Authorized Personnel Only
          </span>
        </div>
      </section>
    </main>
  );
}
