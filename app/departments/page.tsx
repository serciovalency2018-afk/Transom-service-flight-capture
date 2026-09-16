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
  },
  {
    key: "sorting",
    name: "SORTING",
    description: "Baggage & ULD Sorting",
  },
  {
    key: "load_control_ops",
    name: "LOAD CONTROL / OPS",
    description: "Load Control & Operations",
  },
  {
    key: "passenger_services",
    name: "PASSENGER SERVICES",
    description: "Passenger & Gate Services",
  },
  {
    key: "cargo",
    name: "CARGO",
    description: "Cargo Operations",
  },
];

export default function DepartmentsPage() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      const { data, error } =
        await supabase
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
    };

    loadProfile();
  }, [router]);

  const handleDepartmentSelect = (
    departmentKey: string
  ) => {
    router.push(
      `/flights?department=${encodeURIComponent(
        departmentKey
      )}`
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

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
          onClick={handleLogout}
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
                marginBottom: "30px",
              }}
            >

              <strong>
                Logged in as:
              </strong>

              <p
                style={{
                  marginTop: "6px",
                  color: "#071d41",
                  fontWeight: 600,
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

              {departments.map(
                (department) => (

                  <button
                    key={department.key}
                    type="button"
                    onClick={() =>
                      handleDepartmentSelect(
                        department.key
                      )
                    }
                    style={{
                      padding:
                        "30px 20px",
                      borderRadius: "12px",
                      border:
                        "1px solid #d9e0ea",
                      background:
                        "#ffffff",
                      color:
                        "#071d41",
                      cursor:
                        "pointer",
                      minHeight:
                        "140px",
                      textAlign:
                        "left",
                    }}
                  >

                    <div
                      style={{
                        fontSize:
                          "18px",
                        fontWeight:
                          800,
                        marginBottom:
                          "10px",
                      }}
                    >
                      {department.name}
                    </div>

                    <div
                      style={{
                        fontSize:
                          "14px",
                        color:
                          "#667085",
                      }}
                    >
                      {
                        department.description
                      }
                    </div>

                  </button>

                )
              )}

            </div>

          </div>

        </section>

              </
