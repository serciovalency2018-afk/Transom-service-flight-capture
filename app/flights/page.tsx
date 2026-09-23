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

  const [flights, setFlights] =
    useState<Flight[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showAddFlight, setShowAddFlight] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

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
  }, []);

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

  const handleAddFlight = async () => {
    if (
      !flightNumber.trim() ||
      !aircraft.trim() ||
      !route.trim() ||
      !flightDate
    ) {
      alert(
        "Please fill in all flight information."
      );
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("flights")
      .insert({
        flight_number:
          flightNumber.trim().toUpperCase(),
        aircraft:
          aircraft.trim().toUpperCase(),
        route:
          route.trim().toUpperCase(),
        flight_date: flightDate,
        status,
      });

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

      {/* ================================
          HEADER
      ================================= */}

      <header className="flight-header">

        <div className="flight-brand">

          <div className="flight-logo">
            TRANSOM
          </div>

          <div className="flight-tagline">
            FLIGHT SERVICE CAPTURE
          </div>

        </div>

        <div className="flight-header-actions">

          <div className="flight-user">
            <span className="flight-user-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                />

                <path
                  d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7"
                />
              </svg>
            </span>

            <span>
              Authorized User
            </span>
          </div>

          <div className="flight-header-divider" />

          <button
            className="flight-logout"
            onClick={handleLogout}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M21 3v18" />
            </svg>

            LOGOUT
          </button>

        </div>

      </header>


      {/* ================================
          HERO
      ================================= */}

      <section className="flight-hero">

        <div>

          <h1>
            SELECT FLIGHT
          </h1>

          <div className="flight-hero-line" />

          <p>
            {departmentNames[department] ||
              department ||
              "FLIGHT OPERATIONS"}
          </p>

        </div>

      </section>


      {/* ================================
          MAIN PANEL
      ================================= */}

      <section className="flight-main-panel">

        {/* PANEL HEADER */}

        <div className="flight-panel-heading">

          <div className="flight-panel-title">

            <div className="flight-panel-icon">
              ✈
            </div>

            <div>

              <h2>
                SELECT FLIGHT
              </h2>

              <p>
                Select a flight to access
                the service capture.
              </p>

            </div>

          </div>

        </div>


        <div className="flight-color-line">
