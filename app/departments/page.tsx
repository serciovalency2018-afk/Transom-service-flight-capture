"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Department = {
  key: string;
  name: string;
  description: string;
  color: "red" | "blue" | "navy";
  icon: "ramp" | "sorting" | "load" | "passenger" | "cargo";
};

const departments: Department[] = [
  {
    key: "ramp",
    name: "RAMP",
    description: "Ramp & Ground Services",
    color: "red",
    icon: "ramp",
  },
  {
    key: "sorting",
    name: "SORTING",
    description: "Baggage & ULD Sorting",
    color: "navy",
    icon: "sorting",
  },
  {
    key: "load_control_ops",
    name: "LOAD CONTROL / OPS",
    description: "Load Control & Operations",
    color: "blue",
    icon: "load",
  },
  {
    key: "passenger_services",
    name: "PASSENGER SERVICES",
    description: "Passenger & Gate Services",
    color: "red",
    icon: "passenger",
  },
  {
    key: "cargo",
    name: "CARGO",
    description: "Cargo Operations",
    color: "navy",
    icon: "cargo",
  },
];

function DepartmentIcon({
  type,
}: {
  type: Department["icon"];
}) {
  if (type === "ramp") {
    return (
      <svg
        viewBox="0 0 64 64"
        className="department-svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 44h42" />
        <path d="M16 44l5-12h18l7 12" />
        <circle cx="20" cy="48" r="5" />
        <circle cx="45" cy="48" r="5" />
        <path d="M25 32l8-13 8 13" />
        <path d="M30 25h9" />
        <path d="M34 19l5-5" />
      </svg>
    );
  }

  if (type === "sorting") {
    return (
      <svg
        viewBox="0 0 64 64"
        className="department-svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="8" y="32" width="48" height="10" rx="2" />
        <circle cx="17" cy="48" r="4" />
        <circle cx="31" cy="48" r="4" />
        <circle cx="45" cy="48" r="4" />
        <rect x="17" y="17" width="15" height="12" rx="2" />
        <path d="M40 17h10" />
        <path d="M45 12v10" />
      </svg>
    );
  }

  if (type === "load") {
    return (
      <svg
        viewBox="0 0 64 64"
        className="department-svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="13"
          y="9"
          width="38"
          height="46"
          rx="4"
        />
        <path d="M22 20h20" />
        <path d="M22 29h8" />
        <path d="M22 39h8" />
        <path d="M35 34l4 4 8-9" />
        <path d="M43 47h8" />
        <path d="M47 43v8" />
      </svg>
    );
  }

  if (type === "passenger") {
    return (
      <svg
        viewBox="0 0 64 64"
        className="department-svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="20" cy="18" r="5" />
        <path d="M20 23v15" />
        <path d="M13 31h14" />
        <path d="M15 46l5-8 5 8" />

        <rect
          x="33"
          y="16"
          width="19"
          height="30"
          rx="2"
        />

        <path d="M37 24h11" />
        <path d="M37 31h11" />
        <path d="M37 38h7" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 64 64"
      className="department-svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 45h48" />
      <path d="M13 45V31h20v14" />
      <path d="M33 35h18v10" />
      <path d="M17 31l8-13 8 13" />
      <rect
        x="39"
        y="21"
        width="12"
        height="10"
      />
      <path d="M43 21v-5" />
      <path d="M47 21v-5" />
    </svg>
  );
}

export default function DepartmentsPage() {
  const router = useRouter();

  const [fullName, setFullName] =
    useState("Authorized User");

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

      const { data: profile } =
        await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

      if (profile?.full_name) {
        setFullName(profile.full_name);
      } else if (user.email) {
        setFullName(user.email);
      }

      setLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleDepartmentSelect = (
    department: string
  ) => {
    router.push(
      `/flights?department=${department}`
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="department-page">
        <div className="department-loading">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="department-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="department-header">

        <div className="transom-brand">

          <div className="transom-logo">
            TRANSOM
          </div>

          <div className="transom-tagline">
            FLIGHT SERVICE CAPTURE
          </div>

        </div>

        <div className="header-user-area">

          <div className="user-display">

            <span className="user-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
              </svg>
            </span>

            <span>
              {fullName}
            </span>

          </div>

          <div className="header-divider" />

          <button
            className="department-logout"
            onClick={handleLogout}
          >

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M21 3v18" />
            </svg>

            LOGOUT

          </button>

        </div>

      </header>


      {/* =====================================
          HERO
      ====================================== */}

      <section className="department-hero">

        <div className="hero-content">

          <h1>
            WELCOME,{" "}
            <span>{fullName}</span>
          </h1>

          <div className="hero-red-line" />

          <p>
            SELECT DEPARTMENT
          </p>

        </div>

      </section>


      {/* =====================================
          DEPARTMENT PANEL
      ====================================== */}

      <section className="department-panel">

        <div className="department-panel-header">

          <div className="panel-title-row">

            <div className="panel-grid-icon">

              <span />
              <span />
              <span />

              <span />
              <span />
              <span />

              <span />
              <span />
              <span />

            </div>

            <div>

              <h2>
                SELECT DEPARTMENT
              </h2>

              <p>
                Choose the department you
                want to access.
              </p>

            </div>

          </div>


          <div className="department-panel-line">

            <span className="red-line" />

            <span className="blue-line" />

            <span className="navy-line" />

          </div>

        </div>


        {/* =================================
            USER
        ================================== */}

        <div className="logged-user">

          <span>
            Logged in as:
          </span>

          <strong>
            {fullName}
          </strong>

        </div>


        {/* =================================
            DEPARTMENT CARDS
        ================================== */}

        <div className="department-grid">

          {departments.map(
            (department) => (

              <button
                key={department.key}
                className={`department-card ${department.color}`}
                onClick={() =>
                  handleDepartmentSelect(
                    department.key
                  )
                }
              >

                <div className="department-icon-wrapper">

                  <DepartmentIcon
                    type={department.icon}
                  />

                </div>


                <div className="department-card-content">

                  <h3>
                    {department.name}
                  </h3>

                  <p>
                    {department.description}
                  </p>

                </div>


                <div className="department-arrow">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h13" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>

                </div>

              </button>

            )
          )}

        </div>

      </section>


      {/* =====================================
          FOOTER
      ====================================== */}

      <footer className="department-footer">

        <div>
          TRANSOM Flight Service Capture
        </div>

        <div className="footer-red-line" />

        <span>
          Authorized Personnel Only
        </span>

      </footer>

    </main>
  );
}
