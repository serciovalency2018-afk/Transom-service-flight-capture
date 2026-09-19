"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Department = {
  key: string;
  name: string;
  description: string;
  icon: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  role: string | null;
  department: string | null;
};

const departments: Department[] = [
  {
    key: "ramp",
    name: "RAMP",
    description: "Ground handling and aircraft turnaround services",
    icon: "✈",
  },
  {
    key: "sorting",
    name: "SORTING",
    description: "Baggage sorting, transfer and ULD operations",
    icon: "▣",
  },
  {
    key: "load_control_ops",
    name: "LOAD CONTROL / OPS",
    description: "Load control and flight operational information",
    icon: "◈",
  },
  {
    key: "passenger_services",
    name: "PASSENGER SERVICES",
    description: "Check-in, boarding and passenger assistance",
    icon: "♙",
  },
  {
    key: "cargo",
    name: "CARGO",
    description: "Cargo acceptance, handling and loading operations",
    icon: "▤",
  },
];

export default function DepartmentsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  async function loadUserProfile() {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/");
        return;
      }

      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select("id, full_name, role, department")
          .eq("id", user.id)
          .maybeSingle();

      if (profileError) {
        console.error("Profile error:", profileError);
        alert("Unable to load your profile.");
        router.replace("/");
        return;
      }

      if (!profileData) {
        alert("Your user profile was not found.");
        router.replace("/");
        return;
      }

      setProfile(profileData);

      // =====================================================
      // IMPORTANT:
      // EVERY LOGGED-IN USER SEES ALL DEPARTMENTS
      // =====================================================

    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong while loading departments.");
      router.replace("/");
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // DEPARTMENT SELECT
  // =========================================================

  function handleDepartmentSelect(departmentKey: string) {
    router.push(
      `/flights?department=${encodeURIComponent(departmentKey)}`
    );
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <main className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <div className="dashboard-logo">TRANSOM</div>

            <div className="dashboard-subtitle">
              FLIGHT SERVICE CAPTURE
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="welcome-section">
            <h1>LOADING...</h1>
            <p>Loading TRANSOM departments.</p>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="dashboard-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="dashboard-header">
        <div>
          <div className="dashboard-logo">TRANSOM</div>

          <div className="dashboard-subtitle">
            FLIGHT SERVICE CAPTURE
          </div>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          LOGOUT
        </button>
      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="dashboard-content">

        <section className="welcome-section">
          <h1>
            WELCOME
            {profile?.full_name
              ? `, ${profile.full_name}`
              : ""}
          </h1>

          <p>SELECT DEPARTMENT</p>
        </section>

        {/* ===================================================
            DEPARTMENTS
        ==================================================== */}

        <section className="flights-section">

          <div className="section-heading">
            <h2>SELECT DEPARTMENT</h2>

            <p>
              Select a department to view available flights.
            </p>
          </div>

          <div className="department-grid">

            {departments.map((department) => (
              <button
                type="button"
                key={department.key}
                className="department-card"
                onClick={() =>
                  handleDepartmentSelect(department.key)
                }
              >

                <div className="department-icon">
                  {department.icon}
                </div>

                <div className="department-name">
                  {department.name}
                </div>

                <div className="department-description">
                  {department.description}
                </div>

                <div className="department-arrow">
                  →
                </div>

              </button>
            ))}

          </div>

        </section>
      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="dashboard-footer">
        TRANSOM — FLIGHT SERVICE CAPTURE
      </footer>

    </main>
  );
}
