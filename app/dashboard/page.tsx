"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <div className="dashboard-logo">TRANSOM</div>
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
          <h1>Flight Operations Dashboard</h1>
          <p>
            Manage and monitor flight service capture operations.
          </p>
        </div>

        <div className="status-cards">
          <div className="status-card open">
            <span className="status-number">0</span>
            <span className="status-label">OPEN</span>
          </div>

          <div className="status-card progress">
            <span className="status-number">0</span>
            <span className="status-label">IN PROGRESS</span>
          </div>

          <div className="status-card completed">
            <span className="status-number">0</span>
            <span className="status-label">
              CLOSED — NO DELAY
            </span>
          </div>

          <div className="status-card delayed">
            <span className="status-number">0</span>
            <span className="status-label">
              CLOSED — WITH DELAY
            </span>
          </div>
        </div>

        <section className="flights-section">
          <div className="section-header">
            <div>
              <h2>Flights</h2>
              <p>Flight service capture records</p>
            </div>

            <button className="new-flight-button">
              + NEW FLIGHT
            </button>
          </div>

          <div className="empty-state">
            <div className="empty-icon">✈</div>

            <h3>No flights available</h3>

            <p>
              Flight records will appear here once they are created.
            </p>
          </div>
        </section>
      </section>

      <footer className="dashboard-footer">
        <p>TRANSOM Flight Service Capture</p>
        <span>Authorized Personnel Only</span>
      </footer>
    </main>
  );
}
