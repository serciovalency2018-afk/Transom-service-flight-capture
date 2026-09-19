"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";
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

function FlightsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const department =
    searchParams.get("department") || "";

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  // ADD FLIGHT STATES
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [savingFlight, setSavingFlight] = useState(false);

  const [flightNumber, setFlightNumber] = useState("");
  const [aircraft, setAircraft] = useState("");
  const [route, setRoute] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [status, setStatus] = useState("Open");

  // LOAD FLIGHTS
  const loadFlights = async () => {
    setLoading(true);

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
      .order("flight_date", {
        ascending: false,
      });

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
  }, [router]);

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // SELECT FLIGHT
  const handleFlightSelect = (
    flightId: string
  ) => {
    router.push(
      `/flight/${flightId}?department=${department}`
    );
  };

  // RESET FORM
  const resetFlightForm = () => {
    setFlightNumber("");
    setAircraft("");
    setRoute("");
    setFlightDate("");
    setStatus("Open");
  };

  // SAVE NEW FLIGHT
  const handleAddFlight = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !flightNumber.trim() ||
      !aircraft.trim() ||
      !route.trim() ||
      !flightDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setSavingFlight(true);

    const { error } = await supabase
      .from("flights")
      .insert([
        {
          flight_number: flightNumber.trim(),
          aircraft: aircraft.trim(),
          route: route.trim(),
          flight_date: flightDate,
          status,
        },
      ]);

    if (error) {
      alert(error.message);
      setSavingFlight(false);
      return;
    }

    alert("Flight added successfully.");

    resetFlightForm();
    setShowAddFlight(false);
    setSavingFlight(false);

    await loadFlights();
  };

  // STATUS CLASS
  const getStatusClass = (
    status: string
  ) => {
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

          <button
            className="logout-button"
            onClick={() =>
              router.push("/departments")
            }
            style={{
              marginBottom: "20px",
            }}
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

        {/* FLIGHTS */}
        <section className="flights-section">

          {/* SECTION HEADER */}
          <div className="section-header">

            <div>
              <h2>
                Available Flights
              </h2>

              <p>
                Select a flight to access
                the service capture.
              </p>
            </div>

            {/* ADD NEW FLIGHT BUTTON */}
            <button
              className="new-flight-button"
              onClick={() =>
                setShowAddFlight(
                  !showAddFlight
                )
              }
            >
              {showAddFlight
                ? "✕ CLOSE"
                : "+ ADD NEW FLIGHT"}
            </button>

          </div>

          {/* ADD FLIGHT FORM */}
          {showAddFlight && (
            <div className="new-flight-form">

              <div className="new-flight-form-header">

                <div>
                  <h3>
                    Add New Flight
                  </h3>

                  <p>
                    Enter the flight details
                    below.
                  </p>
                </div>

              </div>

              <form
                onSubmit={handleAddFlight}
              >

                <div className="form-grid">

                  {/* FLIGHT NUMBER */}
                  <div className="form-group">

                    <label>
                      Flight Number *
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. TC 728"
                      value={flightNumber}
                      onChange={(e) =>
                        setFlightNumber(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* AIRCRAFT */}
                  <div className="form-group">

                    <label>
                      Aircraft *
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Dash 8 Q400"
                      value={aircraft}
                      onChange={(e) =>
                        setAircraft(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* ROUTE */}
                  <div className="form-group">

                    <label>
                      Route *
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. DAR → ZNZ"
                      value={route}
                      onChange={(e) =>
                        setRoute(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* DATE */}
                  <div className="form-group">

                    <label>
                      Flight Date *
                    </label>

                    <input
                      type="date"
                      value={flightDate}
                      onChange={(e) =>
                        setFlightDate(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* STATUS */}
                  <div className="form-group">

                    <label>
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(
                          e.target.value
                        )
                      }
                    >
                      <option value="Open">
                        Open
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Closed - No Delay">
                        Closed - No Delay
                      </option>

                      <option value="Closed - With Delay">
                        Closed - With Delay
                      </option>
                    </select>

                  </div>

                </div>

                {/* FORM ACTIONS */}
                <div className="new-flight-actions">

                  <button
                    type="button"
                    className="cancel-flight-button"
                    onClick={() => {
                      resetFlightForm();
                      setShowAddFlight(false);
                    }}
                    disabled={savingFlight}
                  >
                    CANCEL
                  </button>

                  <button
                    type="submit"
                    className="save-flight-button"
                    disabled={savingFlight}
                  >
                    {savingFlight
                      ? "SAVING..."
                      : "SAVE FLIGHT"}
                  </button>

                </div>

              </form>

            </div>
          )}

          {/* FLIGHT LIST */}
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
                There are currently no
                flights available.
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

                  {flights.map(
                    (flight) => (

                      <tr
                        key={flight.id}
                      >

                        <td>
                          <strong>
                            {
                              flight.flight_number
                            }
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

                    )
                  )}

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
          Authorized Personnel Only
        </span>

      </footer>

    </main>
  );
}

export default function FlightsPage() {
  return (
    <Suspense
      fallback={
        <main className="dashboard-page">

          <div className="empty-state">

            <h3>
              Loading flights...
            </h3>

          </div>

        </main>
      }
    >
      <FlightsContent />
    </Suspense>
  );
                  }
