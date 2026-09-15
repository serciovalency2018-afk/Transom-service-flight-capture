"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

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

export default function DepartmentsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        alert(error.message);
        router.push("/");
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleDepartmentSelect = (department: string) => {
    router.push(`/flights?department=${department}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="empty-state">
          <h3>Loading departments...</h3>
        </div>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  const isManagement = profile.role === "management";

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
            Choose the department you want to access.
          </p>
        </div>

        <section className="flights-section">
          <div
            style={{
              padding: "30px",
            }}
          >
            <div
              style={{
                marginBottom: "25px",
              }}
            >
              <strong>Logged in as:</strong>

              <p
                style={{
                  marginTop: "6px",
                }}
              >
                {profile.full_name}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
              }}
            >
              {isManagement ? (
                <>
                  {Object.entries(departmentNames).map(
                    ([key, name]) => (
                      <button
                        key={key}
                        onClick={() =>
                          handleDepartmentSelect(key)
                        }
                        style={{
                          padding: "30px 20px",
                          borderRadius: "12px",
                          border: "1px solid #d9e0ea",
                          background: "#ffffff",
                          color: "#071d41",
                          fontSize: "17px",
                          fontWeight: 700,
                          cursor: "pointer",
                          minHeight: "120px",
                        }}
                      >
                        {name}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      router.push("/management")
                    }
                    style={{
                      padding: "30px 20px",
                      borderRadius: "12px",
                      border: "none",
                      background: "#071d41",
                      color: "#ffffff",
                      fontSize: "17px",
                      fontWeight: 700,
                      cursor: "pointer",
                      minHeight: "120px",
                    }}
                  >
                    MANAGEMENT
                    <br />
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 400,
                      }}
                    >
                      VIEW ALL DEPARTMENTS
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() =>
                    handleDepartmentSelect(
                      profile.department
                    )
                  }
                  style={{
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
              )}
            </div>
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
