"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Flight = {
  id: string;
  flight_number: string;
  aircraft: string;
  route: string;
  flight_date: string;
  status: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFlights = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
      return;
    }

    const { data, error } = await supabase
      .from("flights")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setFlights(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadFlights();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const openCount = flights.filter(
    (flight) => flight.status === "Open"
  ).length;

  const progressCount = flights.filter(
    (flight) => flight.status === "In Progress"
  ).length;

  const noDelayCount = flights.filter(
    (flight) => flight.status === "Closed - No Delay"
  ).length;

  const delayCount = flights.filter(
    (flight) => flight.status === "Closed - With Delay"
  ).length;

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
            <span className="status-number">{openCount}</span>
            <span className="status-label">OPEN</span>
          </div>

          <div className="status-card progress">
            <span className="status-number">
              {progressCount}
            </span>
            <span className="status-label">
              IN PROGRESS
            </span>
          </div>

          <div className="status-card completed">
            <span className="status-number">
              {noDelayCount}
            </span>
            <span className="status-label">
              CLOSED — NO DELAY
            </span>
          </div>

          <div className="status-card delayed">
            <span className="status-number">
              {delayCount}
            </span>
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

            <button
              className="new-flight-button"
              onClick={() => router.push("/new-flight")}
            >
              + NEW FLIGHT
            </button>
          </div>

          {loading ? (
            <div className="empty-state">
              <h3>Loading flights...</h3>
            </div>
          ) : flights.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✈</div>

              <h3>No flights available</h3>

              <p>
                Click + NEW FLIGHT to create your first flight.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto", padding: "20px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "700px",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "12px" }}>
                      Flight
                    </th>
                    <th style={{ textAlign: "left", padding: "12px" }}>
                      Aircraft
                    </th>
                    <th style={{ textAlign: "left", padding: "12px" }}>
                      Route
                    </th>
                    <th style={{ textAlign: "left", padding: "12px" }}>
                      Date
                    </th>
                    <th style={{ textAlign: "left", padding: "12px" }}>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {flights.map((flight) => (
                    <tr key={flight.id}>
                      <td style={{ padding: "12px" }}>
                        <strong>{flight.flight_number}</strong>
                      </td>

                      <td style={{ padding: "12px" }}>
                        {flight.aircraft}
                      </td>

                      <td style={{ padding: "12px" }}>
                        {flight.route}
                      </td>

                      <td style={{ padding: "12px" }}>
                        {flight.flight_date}
                      </td>

                      <td style={{ padding: "12px" }}>
                        {flight.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>

      <footer className="dashboard-footer">
        <p>TRANSOM Flight Service Capture</p>
        <span>Authorized Personnel Only</span>
      </footer>
    </main>
  );
}
