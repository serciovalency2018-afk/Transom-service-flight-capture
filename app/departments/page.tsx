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

const departments = [
  {
    key: "ramp",
    name: "RAMP",
    description: "Ramp & Ground Services",
    icon: "✈",
  },
  {
    key: "sorting",
    name: "SORTING",
    description: "Baggage & ULD Sorting",
    icon: "▣",
  },
  {
    key: "load_control_ops",
    name: "LOAD CONTROL / OPS",
    description: "Load Control & Operations",
    icon: "▤",
  },
  {
    key: "passenger_services",
    name: "PASSENGER SERVICES",
    description: "Passenger & Gate Services",
    icon: "♙",
  },
  {
    key: "cargo",
    name: "CARGO",
    description: "Cargo Operations",
    icon: "▰",
  },
];

export default function DepartmentsPage() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .select(
          "id, full_name, role, department"
        )
        .eq("id", user.id)
        .single();

      if (error) {
        alert(error.message);
        router.push("/");
        return;
      }

      setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, [router]);

  function selectDepartment(
    departmentKey: string
  ) {
    router.push(
      `/flights?department=${encodeURIComponent(
        departmentKey
      )}`
    );
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="empty-state">
          <h3>
            Loading departments...
          </h3>
        </div>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

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
          onClick={logout}
        >
          LOGOUT
        </button>

      </header>

      <section className="dashboard-content">

        <div className="welcome-section">

          <h1>
            Select Department
          </h1>

          <p>
            Choose the department you want
            to access.
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
                marginBottom: "28px",
              }}
            >

              <div
                style={{
                  color: "#667085",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.7px",
                }}
              >
                Logged in as
              </div>

              <div
                style={{
                  marginTop: "5px",
                  color: "#071d41",
                  fontSize: "20px",
                  fontWeight: 900,
                }}
              >
                {profile.full_name}
              </div>

            </div>

            <div className="department-grid">

              {departments.map(
                (department) => (

                  <button
                    key={
                      department.key
                    }
                    type="button"
                    className="department-card"
                    onClick={() =>
                      selectDepartment(
                        department.key
                      )
                    }
                  >

                    <div className="department-icon">
                      {department.icon}
                    </div>

                    <div className="department-name">
                      {department.name}
                    </div>

                    <div className="department-description">
                      {
                        department.description
                      }
                    </div>

                    <div className="department-arrow">
                      →
                    </div>

                  </button>

                )
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
