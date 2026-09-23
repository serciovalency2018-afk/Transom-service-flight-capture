"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";
import {
  useSearchParams,
  useRouter,
} from "next/navigation";
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

  const [showAddFlight, setShowAddFlight] =
    useState(false);

  const [savingFlight, setSavingFlight] =
    useState(false);

  const [flightNumber, setFlightNumber] =
    useState("");

  const [aircraft, setAircraft] =
    useState("");

  const [route, setRoute] =
    useState("");

  const [flightDate, setFlightDate] =
    useState("");

  const [flightStatus, setFlightStatus] =
    useState("Open");

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleFlightSelect = (
    flightId: string
  ) => {
    router.push(
      `/flight/${flightId}?department=${department}`
    );
  };

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
      alert(
        "Please complete all required flight information."
      );
      return;
    }

    setSavingFlight(true);

    const { error } = await supabase
      .from("flights")
      .insert([
        {
          flight_number:
            flightNumber.trim(),
          aircraft: aircraft.trim(),
          route: route.trim(),
          flight_date: flightDate,
          status: flightStatus,
        },
      ]);

    if (error) {
      alert(error.message);
      setSavingFlight(false);
      return;
    }

    setFlightNumber("");
    setAircraft("");
    setRoute("");
    setFlightDate("");
    setFlightStatus("Open");

    setShowAddFlight(false);
    setSavingFlight(false);

    await loadFlights();

    alert("Flight added successfully.");
  };

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

      {/* MAIN CONTENT */}
      <section className="dashboard-content">

        {/* WELCOME */}
        <div className="welcome-section">

          <button
            className="back-button"
            onClick={() =>
              router.push("/departments")
            }
          >
            ← BACK TO DEPARTMENTS
          </button>

          <h1>
            Select Flight
          </h1>

          <p>
            {departmentNames[department] ||
              department ||
              "Flight Operations"}
          </p>

        </div>

        {/* FLIGHT SECTION */}
        <section className="flights-section">

          <div className="flight-color-line">
            <span className="line-red"></span>
            <span className="line-blue"></span>
            <span className="line-navy"></span>
          </div>

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

            <button
              className="new-flight-button"
              onClick={() =>
                setShowAddFlight(
                  !showAddFlight
                )
              }
            >
              + ADD NEW FLIGHT
            </button>

          </div>

          {/* ADD FLIGHT FORM */}
          {showAddFlight && (
            <div className="new-flight-card">

              <div className="new-flight-header">

                <div>
                  <h3>
                    Add New Flight
                  </h3>

                  <p>
                    Enter the flight information
                    below.
                  </p>
                </div>

                <button
                  type="button"
                  className="close-form-button"
                  onClick={() =>
                    setShowAddFlight(false)
                  }
                >
                  ×
                </button>

              </div>

              <form
                onSubmit={handleAddFlight}
                className="new-flight-form"
              >

                <div className="flight-form-grid">

                  <div className="form-field">
                    <label>
                      FLIGHT NUMBER
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. TC100"
                      value={flightNumber}
                      onChange={(e) =>
                        setFlightNumber(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      AIRCRAFT
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Q400"
                      value={aircraft}
                      onChange={(e) =>
                        setAircraft(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      ROUTE
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. DAR - MWZ"
                      value={route}
                      onChange={(e) =>
                        setRoute(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      FLIGHT DATE
                    </label>

                    <input
                      type="date"
                      value={flightDate}
                      onChange={(e) =>
                        setFlightDate(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      STATUS
                    </label>

                    <select
                      value={flightStatus}
                      onChange={(e) =>
                        setFlightStatus(
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

                <div className="form-actions">

                  <button
                    type="button"
                    className="cancel-flight-button"
                    onClick={() =>
                      setShowAddFlight(false)
                    }
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

          {/* LOADING */}
          {loading ? (
            <div className="empty-state">

              <div className="loading-spinner"></div>

              <h3>
                Loading flights...
              </h3>

            </div>
          ) : flights.length === 0 ? (

            /* NO FLIGHTS */
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

              <button
                className="new-flight-button"
                onClick={() =>
                  setShowAddFlight(true)
                }
              >
                + ADD NEW FLIGHT
              </button>

            </div>

          ) : (

            /* FLIGHT TABLE */
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

            <div className="loading-spinner"></div>

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
