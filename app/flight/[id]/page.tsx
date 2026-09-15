"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { supabase } from "../../../lib/supabase";

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

export default function FlightDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const flightId = params.id as string;
  const department =
    searchParams.get("department") || "";

  const [flight, setFlight] = useState<Flight | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pax, setPax] = useState("");
  const [baggages, setBaggages] = useState("");
  const [cargo, setCargo] = useState("");
  const [parkingBay, setParkingBay] = useState("");
  const [loadRamp, setLoadRamp] = useState("");
  const [stdEtd, setStdEtd] = useState("");
  const [staEta, setStaEta] = useState("");
  const [actualDeparture, setActualDeparture] =
    useState("");
  const [actualArrival, setActualArrival] =
    useState("");
  const [loadControlTrcName, setLoadControlTrcName] =
    useState("");
  const [salName, setSalName] = useState("");
  const [delayReason, setDelayReason] =
    useState("");
  const [iataDelayCode, setIataDelayCode] =
    useState("");
  const [operationalRemarks, setOperationalRemarks] =
    useState("");
  const [comments, setComments] = useState("");

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
        router.push("/departments");
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

  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert(
        "Your session has expired. Please login again."
      );
      setSaving(false);
      router.push("/");
      return;
    }

    const { error } = await supabase
      .from("flight_service_captures")
      .insert({
        flight_id: flightId,
        department: department,

        pax: pax ? Number(pax) : null,
        baggages: baggages
          ? Number(baggages)
          : null,
        cargo: cargo ? Number(cargo) : null,

        parking_bay: parkingBay || null,
        load_ramp: loadRamp || null,

        std_etd: stdEtd || null,
        sta_eta: staEta || null,

        actual_departure:
          actualDeparture || null,

        actual_arrival:
          actualArrival || null,

        load_control_trc_name:
          loadControlTrcName || null,

        sal_name: salName || null,

        delay_reason:
          delayReason || null,

        iata_delay_code:
          iataDelayCode || null,

        operational_remarks:
          operationalRemarks || null,

        comments: comments || null,

        created_by: user.id,
      });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Load Control / OPS service capture saved successfully!"
    );

    router.push(
      `/flights?department=${department}`
    );
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
            onClick={() =>
              router.push("/departments")
            }
          >
            BACK TO DEPARTMENTS
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
            onClick={() =>
              router.push(
                `/flights?department=${department}`
              )
            }
            style={{
              marginBottom: "20px",
            }}
          >
            ← BACK TO FLIGHTS
          </button>

          <h1>{flight.flight_number}</h1>

          <p>
            {departmentNames[department] ||
              department}
          </p>
        </div>

        <section className="flights-section">
          <div
            style={{
              padding: "30px",
              background: "#ffffff",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
                color: "#071d41",
              }}
            >
              Flight Information
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
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
            </div>
          </div>
        </section>

        {department === "load_control_ops" ? (
          <section className="flights-section">
            <div
              className="section-header"
              style={{
                padding: "25px 30px",
              }}
            >
              <div>
                <h2>Load Control / OPS</h2>

                <p>
                  Flight service capture
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSave}
              style={{
                padding: "30px",
                display: "grid",
                gap: "22px",
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
                  <label>PAX</label>

                  <input
                    type="number"
                    min="0"
                    value={pax}
                    onChange={(e) =>
                      setPax(e.target.value)
                    }
                    placeholder="Passenger count"
                  />
                </div>

                <div>
                  <label>Baggages</label>

                  <input
                    type="number"
                    min="0"
                    value={baggages}
                    onChange={(e) =>
                      setBaggages(e.target.value)
                    }
                    placeholder="Baggage count"
                  />
                </div>

                <div>
                  <label>Cargo</label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={cargo}
                    onChange={(e) =>
                      setCargo(e.target.value)
                    }
                    placeholder="Cargo"
                  />
                </div>

                <div>
                  <label>Parking Bay</label>

                  <input
                    type="text"
                    value={parkingBay}
                    onChange={(e) =>
                      setParkingBay(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Bay 04"
                  />
                </div>

                <div>
                  <label>Load / Ramp</label>

                  <input
                    type="text"
                    value={loadRamp}
                    onChange={(e) =>
                      setLoadRamp(
                        e.target.value
                      )
                    }
                    placeholder="Load / Ramp"
                  />
                </div>

                <div>
                  <label>STD / ETD</label>

                  <input
                    type="text"
                    value={stdEtd}
                    onChange={(e) =>
                      setStdEtd(
                        e.target.value
                      )
                    }
                    placeholder="e.g. 15:00 / 15:20"
                  />
                </div>

                <div>
                  <label>STA / ETA</label>

                  <input
                    type="text"
                    value={staEta}
                    onChange={(e) =>
                      setStaEta(
                        e.target.value
                      )
                    }
                    placeholder="e.g. 16:00 / 16:15"
                  />
                </div>

                <div>
                  <label>
                    Actual Departure
                  </label>

                  <input
                    type="datetime-local"
                    value={actualDeparture}
                    onChange={(e) =>
                      setActualDeparture(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label>
                    Actual Arrival
                  </label>

                  <input
                    type="datetime-local"
                    value={actualArrival}
                    onChange={(e) =>
                      setActualArrival(
                        e.target.value
                      )
