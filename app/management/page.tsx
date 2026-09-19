"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Profile = {
  id: string;
  full_name: string | null;
  role: string | null;
  department: string | null;
};

export default function ManagementPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkManagement();
  }, []);

  async function checkManagement() {
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

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, department")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Profile error:", error);
        alert("Unable to load your profile.");
        router.replace("/");
        return;
      }

      if (!data) {
        alert("Your profile was not found.");
        router.replace("/");
        return;
      }

      if (data.role !== "management") {
        alert("Management access only.");
        router.replace("/departments");
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error(error);
      router.replace("/");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <header style={headerStyle}>
          <div>
            <div style={logoStyle}>TRANSOM</div>
            <div style={subtitleStyle}>
              FLIGHT SERVICE CAPTURE
            </div>
          </div>
        </header>

        <div style={loadingStyle}>
          LOADING MANAGEMENT DASHBOARD...
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      {/* HEADER */}
      <header style={headerStyle}>
        <div>
          <div style={logoStyle}>TRANSOM</div>

          <div style={subtitleStyle}>
            FLIGHT SERVICE CAPTURE
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          style={logoutButtonStyle}
        >
          LOGOUT
        </button>
      </header>

      {/* CONTENT */}
      <div style={contentStyle}>
        <section style={welcomeStyle}>
          <h1 style={welcomeTitleStyle}>
            WELCOME
            {profile?.full_name
              ? `, ${profile.full_name}`
              : ""}
          </h1>

          <p style={welcomeTextStyle}>
            MANAGEMENT DASHBOARD
          </p>
        </section>

        {/* MANAGEMENT OPTIONS */}
        <section>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>
              MANAGEMENT CONTROL
            </h2>

            <p style={sectionTextStyle}>
              Manage TRANSOM operations and review operational
              information.
            </p>
          </div>

          <div style={gridStyle}>
            {/* USERS */}
            <button
              type="button"
              onClick={() => router.push("/users")}
              style={cardStyle}
            >
              <div style={iconStyle}>👤</div>

              <div style={cardTitleStyle}>
                USERS
              </div>

              <div style={cardDescriptionStyle}>
                Manage TRANSOM users, roles and departments.
              </div>

              <div style={arrowStyle}>→</div>
            </button>

            {/* FLIGHTS */}
            <button
              type="button"
              onClick={() =>
                router.push("/flights?department=management")
              }
              style={cardStyle}
            >
              <div style={iconStyle}>✈</div>

              <div style={cardTitleStyle}>
                FLIGHTS
              </div>

              <div style={cardDescriptionStyle}>
                View and manage all operational flights.
              </div>

              <div style={arrowStyle}>→</div>
            </button>

            {/* SERVICE CAPTURES */}
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/flights?department=management"
                )
              }
              style={cardStyle}
            >
              <div style={iconStyle}>▣</div>

              <div style={cardTitleStyle}>
                SERVICE CAPTURES
              </div>

              <div style={cardDescriptionStyle}>
                Review flight service capture information.
              </div>

              <div style={arrowStyle}>→</div>
            </button>

            {/* DEPARTMENTS */}
            <button
              type="button"
              onClick={() => router.push("/departments")}
              style={cardStyle}
            >
              <div style={iconStyle}>◈</div>

              <div style={cardTitleStyle}>
                DEPARTMENTS
              </div>

              <div style={cardDescriptionStyle}>
                Access all TRANSOM operational departments.
              </div>

              <div style={arrowStyle}>→</div>
            </button>
          </div>
        </section>
      </div>

      <footer style={footerStyle}>
        TRANSOM — MANAGEMENT CONTROL
      </footer>
    </main>
  );
}

/* =========================
   STYLES
========================= */

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f4f6f9",
  fontFamily: "Arial, sans-serif",
};

const headerStyle: React.CSSProperties = {
  background: "#071d41",
  color: "white",
  padding: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "800",
  letterSpacing: "2px",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "12px",
  letterSpacing: "2px",
  opacity: 0.8,
  marginTop: "4px",
};

const logoutButtonStyle: React.CSSProperties = {
  background: "#d71920",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  fontWeight: "700",
  cursor: "pointer",
};

const loadingStyle: React.CSSProperties = {
  minHeight: "70vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#071d41",
  fontWeight: "700",
};

const contentStyle: React.CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "40px 20px",
};

const welcomeStyle: React.CSSProperties = {
  marginBottom: "35px",
};

const welcomeTitleStyle: React.CSSProperties = {
  color: "#071d41",
  fontSize: "30px",
  margin: 0,
};

const welcomeTextStyle: React.CSSProperties = {
  color: "#d71920",
  fontWeight: "700",
  letterSpacing: "1px",
  marginTop: "8px",
};

const sectionHeaderStyle: React.CSSProperties = {
  marginBottom: "20px",
};

const sectionTitleStyle: React.CSSProperties = {
  color: "#071d41",
  margin: 0,
  fontSize: "22px",
};

const sectionTextStyle: React.CSSProperties = {
  color: "#666",
  marginTop: "8px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "20px",
};

const cardStyle: React.CSSProperties = {
  position: "relative",
  textAlign: "left",
  background: "white",
  border: "1px solid #e0e4e8",
  borderRadius: "12px",
  padding: "25px",
  minHeight: "190px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
  cursor: "pointer",
};

const iconStyle: React.CSSProperties = {
  fontSize: "34px",
  color: "#071d41",
  marginBottom: "18px",
};

const cardTitleStyle: React.CSSProperties = {
  color: "#071d41",
  fontSize: "19px",
  fontWeight: "800",
  letterSpacing: "1px",
};

const cardDescriptionStyle: React.CSSProperties = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "1.5",
  marginTop: "10px",
  paddingRight: "20px",
};

const arrowStyle: React.CSSProperties = {
  position: "absolute",
  right: "20px",
  bottom: "18px",
  color: "#d71920",
  fontSize: "22px",
  fontWeight: "800",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#777",
  padding: "25px",
  fontSize: "12px",
};
