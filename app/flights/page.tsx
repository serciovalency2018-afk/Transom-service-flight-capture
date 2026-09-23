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

  const [showAddFlight, setShowAddFlight] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [flightNumber, setFlightNumber] =
    useState("");
  const [aircraft, setAircraft] =
    useState("");
  const [route, setRoute] =
    useState("");
  const [flightDate, setFlightDate] =
    useState("");
  const [status, setStatus] =
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
        "Please fill in all required flight details."
      );
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("flights")
      .insert([
        {
          flight_number:
            flightNumber.trim(),
          aircraft: aircraft.trim(),
          route: route.trim(),
          flight_date: flightDate,
          status,
        },
      ]);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    setFlightNumber("");
    setAircraft("");
    setRoute("");
    setFlightDate("");
    setStatus("Open");

    setShowAddFlight(false);
    setSaving(false);

    await loadFlights();

    alert("Flight added successfully.");
  };

  const handleCancelAddFlight = () => {
    setFlightNumber("");
    setAircraft("");
    setRoute("");
    setFlightDate("");
    setStatus("Open");
    setShowAddFlight(false);
  };

  const getStatusClass = (
    flightStatus: string
  ) => {
    switch (flightStatus) {
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
    <main className="flight-selection-page">

      {/* ================= HEADER ================= */}

      <header className="flight-header">

        <div className="flight-brand">
          <div className="flight-logo">
            TRANSOM
          </div>

          <div className="flight-brand-subtitle">
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

      {/* ================= HEADER LINE ================= */}

      <div className="flight-color-line">
        <span className="flight-red-line"></span>
        <span className="flight-blue-line"></span>
        <span className="flight-navy-line"></span>
      </div>

      {/* ================= CONTENT ================= */}

      <section className="flight-content">

        {/* BACK */}

        <button
          className="back-button"
          onClick={() =>
            router.push("/departments")
          }
        >
          ← BACK TO DEPARTMENTS
        </button>

        {/* TITLE */}

        <div className="flight-title-section">

          <h1>
            Select Flight
          </h1>

          <div className="title-red-line"></div>

          <p>
            {departmentNames[department] ||
              department ||
              "Flight Operations"}
          </p>

        </div>

        {/* ================= FLIGHT CARD ================= */}

        <section className="flight-main-card">

          <div className="flight-card-header">

            <div>
              <h2>
                AVAILABLE FLIGHTS
              </h2>

              <p>
                Select a flight to access
                the service capture.
              </p>
            </div>

            {/* ADD NEW FLIGHT */}

            <button
              className="add-flight-button"
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

          {/* ================= ADD FLIGHT FORM ================= */}

          {showAddFlight && (
            <div className="add-flight-panel">

              <div className="add-flight-heading">

                <div className="add-flight-icon">
                  ✈
                </div>

                <div>
                  <h3>
                    ADD NEW FLIGHT
                  </h3>

                  <p>
                    Enter the flight information
                    below.
                  </p>
                </div>

              </div>

              <form
                onSubmit={handleAddFlight}
                className="flight-form"
              >

                {/* FLIGHT NUMBER */}

                <div className="flight-form-group">

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
                    required
                  />

                </div>

                {/* AIRCRAFT */}

                <div className="flight-form-group">

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
                    required
                  />

                </div>

                {/* ROUTE */}

                <div className="flight-form-group">

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
                    required
                  />

                </div>

                {/* DATE */}

                <div className="flight-form-group">

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
                    required
                  />

                </div>

                {/* STATUS */}

                <div className="flight-form-group">

                  <label>
                    STATUS
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

                {/* FORM BUTTONS */}

                <div className="flight-form-actions">

                  <button
                    type="button"
                    className="cancel-flight-button"
                    onClick={
                      handleCancelAddFlight
                    }
                    disabled={saving}
                  >
                    CANCEL
                  </button>

                  <button
                    type="submit"
                    className="save-flight-button"
                    disabled={saving}
                  >
                    {saving
                      ? "SAVING..."
                      : "SAVE FLIGHT"}
                  </button>

                </div>

              </form>

            </div>
          )}

          {/* ================= FLIGHT LIST ================= */}

          {loading ? (
            <div className="flight-empty-state">

              <div className="loading-icon">
                ✈
              </div>

              <h3>
                Loading flights...
              </h3>

            </div>
          ) : flights.length === 0 ? (
            <div className="flight-empty-state">

              <div className="empty-flight-icon">
                ✈
              </div>

              <h3>
                No flights available
              </h3>

              <p>
                There are currently no flights
                available.
              </p>

              <button
                className="empty-add-flight-button"
                onClick={() =>
                  setShowAddFlight(true)
                }
              >
                + ADD NEW FLIGHT
              </button>

            </div>
          ) : (
            <div className="flight-table-wrapper">

              <table className="flight-table">

                <thead>
                  <tr>
                    <th>
                      FLIGHT
                    </th>

                    <th>
                      AIRCRAFT
                    </th>

                    <th>
                      ROUTE
                    </th>

                    <th>
                      DATE
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      ACTION
                    </th>
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
                          {
                            flight.aircraft
                          }
                        </td>

                        <td>
                          {flight.route}
                        </td>

                        <td>
                          {
                            flight.flight_date
                          }
                        </td>

                        <td>
                          <span
                            className={getStatusClass(
                              flight.status
                            )}
                          >
                            {
                              flight.status
                            }
                          </span>
                        </td>

                        <td>

                          <button
                            className="select-flight-button"
                            onClick={() =>
                              handleFlightSelect(
                                flight.id
                              )
                            }
                          >
                            SELECT FLIGHT
                            <span>
                              →
                            </span>
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

      {/* ================= FOOTER ================= */}

      <footer className="flight-footer">

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
        <main className="flight-selection-page">

          <div className="flight-empty-state">

            <div className="loading-icon">
              ✈
            </div>

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
