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
  const [visibleDepartments, setVisibleDepartments] = useState<Department[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  async function loadUserProfile() {
    try {
      setLoading(true);

      // Check logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/");
        return;
      }

      // Get user's profile
      const { data: profileData, error: profileError } = await supabase
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
      // MANAGEMENT
      // =====================================================

      if (profileData.role === "management") {
        setVisibleDepartments(departments);
        return;
      }

      // =====================================================
      // REGULAR USER
      // =====================================================

      if (!profileData.department) {
        alert("No department has been assigned to your account.");
        setVisibleDepartments([]);
        return;
      }

      const userDepartment = departments.find(
        (department) => department.key === profileData.department
      );

      if (!userDepartment) {
        alert(
          `The department "${profileData.department}" is not configured in TRANSOM.`
        );
        setVisibleDepartments([]);
        return;
      }

      // User sees ONLY their department
      setVisibleDepartments([userDepartment]);
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
    if (!profile) return;

    // Management can access all departments
    if (profile.role === "management") {
      router.push(
        `/flights?department=${encodeURIComponent(departmentKey)}`
      );
      return;
    }

    // Regular user can ONLY access assigned department
    if (profile.department !== departmentKey) {
      alert("Access denied. You are not assigned to this department.");
      return;
    }

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
            <p>Checking your department access.</p>
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

          <p>
            {profile?.role === "management"
              ? "MANAGEMENT — SELECT DEPARTMENT"
              : profile?.department
              ? `SELECT YOUR DEPARTMENT — ${
                  departments.find(
                    (item) => item.key === profile.department
                  )?.name || profile.department
                }`
              : "SELECT DEPARTMENT"}
          </p>
        </section>

        {/* ===================================================
            DEPARTMENTS
        ==================================================== */}

        <section className="flights-section">
          <div className="section-heading">
            <h2>SELECT DEPARTMENT</h2>

            <p>
              {profile?.role === "management"
                ? "Management access — all departments"
                : "You can access your assigned department only"}
            </p>
          </div>

          {visibleDepartments.length === 0 ? (
            <div className="empty-state">
              <h3>NO DEPARTMENT ASSIGNED</h3>

              <p>
                Please contact TRANSOM management to assign
                a department to your account.
              </p>
            </div>
          ) : (
            <div className="department-grid">
              {visibleDepartments.map((department) => (
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
          )}
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
