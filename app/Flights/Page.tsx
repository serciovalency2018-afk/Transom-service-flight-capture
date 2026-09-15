"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Flight = {
  id: string;
  flight_number: string;
  aircraft: string;
  route: string;
  flight_date: string;
  status: string;
};

const departmentNames: Record<string, string> = {
  ramp: "RAMP DEPARTMENT",
  sorting: "SORTING DEPARTMENT",
  load_control_ops: "LOAD CONTROL / OPS",
  passenger_services: "PASSENGER SERVICES",
  cargo: "CARGO DEPARTMENT",
};

export default function FlightsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const department = searchParams.get("department") || "";

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        .select(
          "id, flight_number, aircraft, route, flight_date, status"
        )
        .order("flight_date", { ascending: false });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      setFlights(data || []);
      setLoading(false);
    };

    loadFlights();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleFlightSelect = (flightId: string) => {
    router.push(
      `/flight/${flightId}?department=${department}`
    );
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
            onClick={() => router.push("/departments")}
            style={{ marginBottom: "20px" }}
          >
            ← BACK TO DEPARTMENTS
          </button>

          <h1>Select Flight</h1>

          <p>
            {departmentNames[department] ||
              department ||
              "Flight Operations"}
          </p>
        </div>

        <section className="flights-section">
          <div className="section-header">
            <div>
              <h2>Available Flights</h2>

              <p>
                Select a flight to access the service
                capture.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <h3>Loading flights...</h3>
            </div>
          ) : flights.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                ✈
              </div>

              <h3>No flights available</h3>

              <p>
                There are currently no flights
                available.
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
                        <button
                          className="action-button view"
                          onClick={() =>
                            handleFlightSelect(
                              flight.id
                            )
                          }
                        >
                          SELECT FLIGHT
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
