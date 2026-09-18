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

type Capture = {
  id: string;
  flight_id: string;
  department: string;
  created_at: string;
};

const departmentNames: Record<string, string> = {
  ramp: "RAMP",
  sorting: "SORTING",
  load_control_ops: "LOAD CONTROL / OPS",
  passenger_services: "PASSENGER SERVICES",
  cargo: "CARGO",
};

export default function ManagementPage() {
  const router = useRouter();

  const [flights, setFlights] = useState<Flight[]>([]);
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function loadManagementData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();

      if (profileError) {
        alert(profileError.message);
        router.push("/");
        return;
      }

      if (profile.role !== "management") {
        alert("Management access only.");
        router.push("/departments");
        return;
      }

      setUserName(profile.full_name || "Management");

      const { data: flightData, error: flightError } =
        await supabase
          .from("flights")
          .select(
            "id, flight_number, aircraft, route, flight_date, status, created_at"
          )
          .order("created_at", {
            ascending: false,
          });

      if (flightError) {
        alert(flightError.message);
        setLoading(false);
        return;
      }

      const {
        data: captureData,
        error: captureError,
      } = await supabase
        .from("flight_service_captures")
        .select(
          "id, flight_id, department, created_at"
        )
        .order("created_at", {
          ascending: false,
        });

      if (captureError) {
        alert(captureError.message);
        setLoading(false);
        return;
      }

      setFlights(flightData || []);
      setCaptures(captureData || []);
      setLoading(false);
    }

    loadManagementData();
  }, [router]);

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
    (flight) =>
      flight.status === "Closed - No Delay"
  ).length;

  const delayCount = flights.filter(
    (flight) =>
      flight.status === "Closed - With Delay"
  ).length;

  const getFlightNumber = (flightId: string) => {
    const flight = flights.find(
      (item) => item.id === flightId
    );

    return flight?.flight_number || "Unknown";
  };

  return (
    <main className="dashboard-page">
      {/* HEADER */}
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

      {/* CONTENT */}
      <section className="dashboard-content">
        {/* WELCOME */}
        <div className="welcome-section">
          <h1>Management Dashboard</h1>

          <p>
            Welcome, {userName}. Monitor all
            flights and service capture operations.
          </p>
        </div>

        {/* STATUS CARDS */}
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

        {/* ALL FLIGHTS */}
        <section className="flights-section">
          <div className="section-header">
            <div>
              <h2>All Flights</h2>

              <p>
                Management view of all flight
                operations.
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
                Loading management dashboard...
              </h3>
            </div>
          ) : flights.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                ✈
              </div>

              <h3>No flights available</h3>

              <p>
                No flight records have been
                created yet.
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
                    <th>SERVICES</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {flights.map((flight) => {
                    const flightCaptures =
                      captures.filter(
                        (capture) =>
                          capture.flight_id ===
                          flight.id
                      );

                    return (
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
                          <strong>
                            {
                              flightCaptures.length
                            }
                          </strong>
                        </td>

                        <td>
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SERVICE CAPTURES */}
        <section className="flights-section">
          <div className="section-header">
            <div>
              <h2>Service Captures</h2>

              <p>
                Captures submitted by all service
                departments.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <h3>Loading captures...</h3>
            </div>
          ) : captures.length === 0 ? (
            <div className="empty-state">
              <h3>No service captures yet</h3>

              <p>
                Service captures will appear here
                after users submit them.
              </p>
            </div>
          ) : (
            <div className="flight-table-wrapper">
              <table className="flight-table">
                <thead>
                  <tr>
                    <th>FLIGHT</th>
                    <th>DEPARTMENT</th>
                    <th>CAPTURE ID</th>
                    <th>CREATED</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {captures.map((capture) => (
                    <tr key={capture.id}>
                      {/* FLIGHT */}
                      <td>
                        <strong>
                          {getFlightNumber(
                            capture.flight_id
                          )}
                        </strong>
                      </td>

                      {/* DEPARTMENT */}
                      <td>
                        {departmentNames[
                          capture.department
                        ] ||
                          capture.department}
                      </td>

                      {/* CAPTURE ID */}
                      <td>
                        {capture.id.slice(0, 8)}
                      </td>

                      {/* CREATED */}
                      <td>
                        {new Date(
                          capture.created_at
                        ).toLocaleString()}
                      </td>

                      {/* VIEW CAPTURE */}
                      <td>
                        <button
                          className="action-button view"
                          onClick={() =>
                            router.push(
                              `/capture/${capture.id}`
                            )
                          }
                        >
                          VIEW CAPTURE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>

      {/* FOOTER */}
      <footer className="dashboard-footer">
        <p>
          TRANSOM Flight Service Capture
        </p>

        <span>
          Management — Authorized Personnel Only
        </span>
      </footer>
    </main>
  );
}
