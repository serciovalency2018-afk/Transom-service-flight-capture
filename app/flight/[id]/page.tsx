"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Flight = {
  id: string;
  flight_number: string;
  aircraft: string;
  route: string;
  flight_date: string;
  status: string;
  created_at: string;
};

export default function FlightDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const flightId = params.id as string;

  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlight = async () => {
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
        .eq("id", flightId)
        .single();

      if (error) {
        alert(error.message);
        router.push("/dashboard");
        return;
      }

      setFlight(data);
      setLoading(false);
    };

    if (flightId) {
      loadFlight();
    }
  }, [flightId, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="empty-state">
          <h3>Loading flight...</h3>
        </div>
      </main>
    );
  }

  if (!flight) {
    return (
      <main className="dashboard-page">
        <div className="empty-state">
          <h3>Flight not found</h3>

          <button
            className="new-flight-button"
            onClick={() => router.push("/dashboard")}
          >
            BACK TO DASHBOARD
          </button>
        </div>
      </main>
    );
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
          <button
            className="logout-button"
            onClick={() => router.push("/dashboard")}
            style={{ marginBottom: "20px" }}
          >
            ← BACK TO DASHBOARD
          </button>

          <h1>
            Flight {flight.flight_number}
          </h1>

          <p>
            Flight details and service capture
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
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              <div>
                <strong>Flight Number</strong>
                <p>{flight.flight_number}</p>
              </div>

              <div>
                <strong>Aircraft</strong>
                <p>{flight.aircraft}</p>
              </div>

              <div>
                <strong>Route</strong>
                <p>{flight.route}</p>
              </div>

              <div>
                <strong>Flight Date</strong>
                <p>{flight.flight_date}</p>
              </div>

              <div>
                <strong>Status</strong>
                <p>{flight.status}</p>
              </div>

              <div>
                <strong>Created</strong>
                <p>
                  {new Date(
                    flight.created_at
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flights-section">
          <div
            className="section-header"
            style={{ padding: "20px 30px" }}
          >
            <div>
              <h2>Service Capture</h2>

              <p>
                Record flight service information
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "50px",
                marginBottom: "15px",
              }}
            >
              ✈
            </div>

            <h3>
              Service Capture Ready
            </h3>

            <p>
              The flight has been created successfully.
              Service capture fields will be added here.
            </p>
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
