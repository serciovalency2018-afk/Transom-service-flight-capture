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
  const [updating, setUpdating] = useState<string | null>(null);

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

  const updateStatus = async (
    flightId: string,
    newStatus: string
  ) => {
    setUpdating(flightId);

    const { error } = await supabase
      .from("flights")
      .update({ status: newStatus })
      .eq("id", flightId);

    if (error) {
      alert(error.message);
      setUpdating(null);
      return;
    }

    setFlights((currentFlights) =>
      currentFlights.map((flight) =>
        flight.id === flightId
          ? { ...flight, status: newStatus }
          : flight
      )
    );

    setUpdating(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Open":
        return "flight-status open-status";

      case "In Progress":
        return "flight-status progress-status";

      case "Closed - No Delay":
        return "flight-status no-delay-status";

      case "Closed - With Delay":
        return "flight-status delay-status";

      default:
        return "flight-status";
    }
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
            Flight Operations Dashboard
          </h1>

          <p>
            Manage and monitor flight service
            capture operations.
          </p>
        </div>

        <div className="status-cards">
          <div className="status-card open">
            <span className="status-number">
              {openCount}
            </span>

            <span className="status-label">
              OPEN
            </span>
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

              <p>
                Flight service capture records
              </p>
            </div>

            <button
              className="new-flight-button"
              onClick={() =>
                router.push("/new-flight")
              }
            >
              + NEW FLIGHT
            </button>
          </div>

          {loading ? (
            <div className="empty-state">
              <h3>
                Loading flights...
              </h3>
            </div>
          ) : flights.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                ✈
              </div>

              <h3>
                No flights available
              </h3>

              <p>
                Click + NEW FLIGHT to create
                your first flight.
              </p>
            </div>
          ) : (
            <div className="flight-table-wrapper">
              <table className="flight-table">
                <thead>
                  <tr>
                    <th>FLIGHT</th>
                    <th>AIRCRAFT</th>
                    <th>ROUTE</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {flights.map((flight) => (
                    <tr key={flight.id}>
                      <td>
                        <strong>
                          {flight.flight_number}
                        </strong>
                      </td>

                      <td>
                        {flight.aircraft}
                      </td>

                      <td>
                        {flight.route}
                      </td>

                      <td>
                        {flight.flight_date}
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            flight.status
                          )}
                        >
                          {flight.status}
                        </span>
                      </td>

                      <td>
                        <div className="flight-actions">
                          <button
                            className="action-button view"
                            onClick={() =>
                              router.push(
                                `/flight/${flight.id}`
                              )
                            }
                          >
                            VIEW DETAILS
                          </button>

                          {flight.status === "Open" && (
                            <button
                              className="action-button start"
                              disabled={
                                updating === flight.id
                              }
                              onClick={() =>
                                updateStatus(
                                  flight.id,
                                  "In Progress"
                                )
                              }
                            >
                              {updating === flight.id
                                ? "..."
                                : "START"}
                            </button>
                          )}

                          {flight.status ===
                            "In Progress" && (
                            <>
                              <button
                                className="action-button close-green"
                                disabled={
                                  updating === flight.id
                                }
                                onClick={() =>
                                  updateStatus(
                                    flight.id,
                                    "Closed - No Delay"
                                  )
                                }
                              >
                                CLOSE — NO DELAY
                              </button>

                              <button
                                className="action-button close-red"
                                disabled={
                                  updating === flight.id
                                }
                                onClick={() =>
                                  updateStatus(
                                    flight.id,
                                    "Closed - With Delay"
                                  )
                                }
                              >
                                CLOSE — DELAY
                              </button>
                            </>
                          )}

                          {(flight.status ===
                            "Closed - No Delay" ||
                            flight.status ===
                              "Closed - With Delay") && (
                            <button
                              className="action-button reopen"
                              disabled={
                                updating === flight.id
                              }
                              onClick={() =>
                                updateStatus(
                                  flight.id,
                                  "Open"
                                )
                              }
                            >
                              REOPEN
                            </button>
                          )}
                        </div>
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
