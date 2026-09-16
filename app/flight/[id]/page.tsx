"use client";

import { Suspense, useEffect, useState } from "react";
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

type Capture = {
  id: string;
  flight_id: string;
  department: string;
  created_at: string;
  pax: number | null;
  baggages: number | null;
  cargo: number | null;
  parking_bay: string | null;
  load_ramp: string | null;
  std_etd: string | null;
  sta_eta: string | null;
  actual_departure: string | null;
  actual_arrival: string | null;
  load_control_trc_name: string | null;
  sal_name: string | null;
  delay_reason: string | null;
  iata_delay_code: string | null;
  operational_remarks: string | null;
  comments: string | null;

  gpu_time: string | null;
  acu: string | null;
  cobus: string | null;
  towing: string | null;
  cleaning: string | null;
  pushback: string | null;
  lavatory_service: string | null;
  portable_water: string | null;
  pax_stairs: string | null;
  ambulift: string | null;
  asu: string | null;
  pax_step: string | null;
  chocks_in: string | null;
  chocks_out: string | null;
  vomiting: string | null;
  ramp_comments: string | null;

  uld_bag_sorting: string | null;
  number_of_bags: number | null;
  uld_number: string | null;
  sorting_start_time: string | null;
  sorting_end_time: string | null;
  bag_transfer: string | null;
  rush_priority_bags: number | null;
  misrouted_bags: number | null;
  damaged_bags: number | null;
  missing_bags: number | null;
  sorting_remarks: string | null;
  sorting_comments: string | null;

  check_in_start_time: string | null;
  check_in_end_time: string | null;
  check_in_agents: number | null;
  boarding_start_time: string | null;
  boarding_end_time: string | null;
  boarding_agents: number | null;
  gate_number: string | null;
  gate_open_time: string | null;
  gate_close_time: string | null;
  wheelchair_assistance: number | null;
  special_assistance: string | null;
  no_show_pax: number | null;
  denied_boarding_pax: number | null;
  transfer_pax: number | null;
  passenger_services_remarks: string | null;
  passenger_services_comments: string | null;

  cargo_acceptance_start_time: string | null;
  cargo_acceptance_end_time: string | null;
  cargo_weight: number | null;
  cargo_pieces: number | null;
  awb_number: string | null;
  cargo_uld_number: string | null;
  dangerous_goods: string | null;
  special_cargo: string | null;
  warehouse_location: string | null;
  cargo_loading_start_time: string | null;
  cargo_loading_end_time: string | null;
  cargo_remarks: string | null;
  cargo_comments: string | null;
};

const departmentNames: Record<string, string> = {
  ramp: "RAMP DEPARTMENT",
  sorting: "SORTING DEPARTMENT",
  load_control_ops: "LOAD CONTROL / OPS",
  passenger_services: "PASSENGER SERVICES",
  cargo: "CARGO DEPARTMENT",
};

function FlightDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const flightId = params.id as string;
  const department = searchParams.get("department") || "";

  const [flight, setFlight] = useState<Flight | null>(null);
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isManagement, setIsManagement] = useState(false);

  // =========================
  // LOAD CONTROL / OPS
  // =========================

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
  const [delayReason, setDelayReason] = useState("");
  const [iataDelayCode, setIataDelayCode] =
    useState("");
  const [operationalRemarks, setOperationalRemarks] =
    useState("");
  const [comments, setComments] = useState("");

  // =========================
  // RAMP
  // =========================

  const [gpuTime, setGpuTime] = useState("");
  const [acu, setAcu] = useState("");
  const [cobus, setCobus] = useState("");
  const [towing, setTowing] = useState("");
  const [cleaning, setCleaning] = useState("");
  const [pushback, setPushback] = useState("");
  const [lavatoryService, setLavatoryService] =
    useState("");
  const [portableWater, setPortableWater] =
    useState("");
  const [paxStairs, setPaxStairs] = useState("");
  const [ambulift, setAmbulift] = useState("");
  const [asu, setAsu] = useState("");
  const [paxStep, setPaxStep] = useState("");
  const [chocksIn, setChocksIn] = useState("");
  const [chocksOut, setChocksOut] = useState("");
  const [vomiting, setVomiting] = useState("");
  const [rampComments, setRampComments] =
    useState("");

  // =========================
  // SORTING
  // =========================

  const [uldBagSorting, setUldBagSorting] =
    useState("");
  const [numberOfBags, setNumberOfBags] =
    useState("");
  const [uldNumber, setUldNumber] = useState("");
  const [sortingStartTime, setSortingStartTime] =
    useState("");
  const [sortingEndTime, setSortingEndTime] =
    useState("");
  const [bagTransfer, setBagTransfer] =
    useState("");
  const [rushPriorityBags, setRushPriorityBags] =
    useState("");
  const [misroutedBags, setMisroutedBags] =
    useState("");
  const [damagedBags, setDamagedBags] =
    useState("");
  const [missingBags, setMissingBags] =
    useState("");
  const [sortingRemarks, setSortingRemarks] =
    useState("");
  const [sortingComments, setSortingComments] =
    useState("");

  // =========================
  // PASSENGER SERVICES
  // =========================

  const [checkInStartTime, setCheckInStartTime] =
    useState("");
  const [checkInEndTime, setCheckInEndTime] =
    useState("");
  const [checkInAgents, setCheckInAgents] =
    useState("");
  const [boardingStartTime, setBoardingStartTime] =
    useState("");
  const [boardingEndTime, setBoardingEndTime] =
    useState("");
  const [boardingAgents, setBoardingAgents] =
    useState("");
  const [gateNumber, setGateNumber] = useState("");
  const [gateOpenTime, setGateOpenTime] =
    useState("");
  const [gateCloseTime, setGateCloseTime] =
    useState("");
  const [
    wheelchairAssistance,
    setWheelchairAssistance,
  ] = useState("");
  const [specialAssistance, setSpecialAssistance] =
    useState("");
  const [noShowPax, setNoShowPax] = useState("");
  const [deniedBoardingPax, setDeniedBoardingPax] =
    useState("");
  const [transferPax, setTransferPax] = useState("");
  const [
    passengerServicesRemarks,
    setPassengerServicesRemarks,
  ] = useState("");
  const [
    passengerServicesComments,
    setPassengerServicesComments,
  ] = useState("");

  // =========================
  // CARGO
  // =========================

  const [
    cargoAcceptanceStartTime,
    setCargoAcceptanceStartTime,
  ] = useState("");

  const [
    cargoAcceptanceEndTime,
    setCargoAcceptanceEndTime,
  ] = useState("");

  const [cargoWeight, setCargoWeight] =
    useState("");
  const [cargoPieces, setCargoPieces] =
    useState("");
  const [awbNumber, setAwbNumber] = useState("");
  const [cargoUldNumber, setCargoUldNumber] =
    useState("");
  const [dangerousGoods, setDangerousGoods] =
    useState("");
  const [specialCargo, setSpecialCargo] =
    useState("");
  const [warehouseLocation, setWarehouseLocation] =
    useState("");
  const [
    cargoLoadingStartTime,
    setCargoLoadingStartTime,
  ] = useState("");
  const [
    cargoLoadingEndTime,
    setCargoLoadingEndTime,
  ] = useState("");
  const [cargoRemarks, setCargoRemarks] =
    useState("");
  const [cargoComments, setCargoComments] =
    useState("");

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const management =
        profile?.role === "management";

      setIsManagement(management);

      // Get flight
      const { data: flightData, error: flightError } =
        await supabase
          .from("flights")
          .select("*")
          .eq("id", flightId)
          .single();

      if (flightError) {
        alert(flightError.message);
        router.push(
          management
            ? "/management"
            : "/departments"
        );
        return;
      }

      setFlight(flightData);

      // Get captures
      const {
        data: captureData,
        error: captureError,
      } = await supabase
        .from("flight_service_captures")
        .select("*")
        .eq("flight_id", flightId)
        .order("created_at", {
          ascending: false,
        });

      if (captureError) {
        alert(captureError.message);
        setLoading(false);
        return;
      }

      setCaptures(captureData || []);
      setLoading(false);
    };

    if (flightId) {
      loadData();
    }
  }, [flightId, router]);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // =========================
  // SAVE
  // =========================

  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      alert(
        "Your session has expired. Please login again."
      );
      router.push("/");
      return;
    }

    if (!department) {
      setSaving(false);
      alert("Please select a department.");
      return;
    }

    const serviceCapture = {
      flight_id: flightId,
      department,

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

      gpu_time: gpuTime || null,
      acu: acu || null,
      cobus: cobus || null,
      towing: towing || null,
      cleaning: cleaning || null,
      pushback: pushback || null,
      lavatory_service:
        lavatoryService || null,
      portable_water:
        portableWater || null,
      pax_stairs: paxStairs || null,
      ambulift: ambulift || null,
      asu: asu || null,
      pax_step: paxStep || null,
      chocks_in: chocksIn || null,
      chocks_out: chocksOut || null,
      vomiting: vomiting || null,
      ramp_comments:
        rampComments || null,

      uld_bag_sorting:
        uldBagSorting || null,
      number_of_bags:
        numberOfBags
          ? Number(numberOfBags)
          : null,
      uld_number:
        uldNumber || null,
      sorting_start_time:
        sortingStartTime || null,
      sorting_end_time:
        sortingEndTime || null,
      bag_transfer:
        bagTransfer || null,
      rush_priority_bags:
        rushPriorityBags
          ? Number(rushPriorityBags)
          : null,
      misrouted_bags:
        misroutedBags
          ? Number(misroutedBags)
          : null,
      damaged_bags:
        damagedBags
          ? Number(damagedBags)
          : null,
      missing_bags:
        missingBags
          ? Number(missingBags)
          : null,
      sorting_remarks:
        sortingRemarks || null,
      sorting_comments:
        sortingComments || null,

      check_in_start_time:
        checkInStartTime || null,
      check_in_end_time:
        checkInEndTime || null,
      check_in_agents:
        checkInAgents
          ? Number(checkInAgents)
          : null,
      boarding_start_time:
        boardingStartTime || null,
      boarding_end_time:
        boardingEndTime || null,
      boarding_agents:
        boardingAgents
          ? Number(boardingAgents)
          : null,
      gate_number:
        gateNumber || null,
      gate_open_time:
        gateOpenTime || null,
      gate_close_time:
        gateCloseTime || null,
      wheelchair_assistance:
        wheelchairAssistance
          ? Number(wheelchairAssistance)
          : null,
      special_assistance:
        specialAssistance || null,
      no_show_pax:
        noShowPax
          ? Number(noShowPax)
          : null,
      denied_boarding_pax:
        deniedBoardingPax
          ? Number(deniedBoardingPax)
          : null,
      transfer_pax:
        transferPax
          ? Number(transferPax)
          : null,
      passenger_services_remarks:
        passengerServicesRemarks || null,
      passenger_services_comments:
        passengerServicesComments || null,

      cargo_acceptance_start_time:
        cargoAcceptanceStartTime || null,
      cargo_acceptance_end_time:
        cargoAcceptanceEndTime || null,
      cargo_weight:
        cargoWeight
          ? Number(cargoWeight)
          : null,
      cargo_pieces:
        cargoPieces
          ? Number(cargoPieces)
          : null,
      awb_number:
        awbNumber || null,
      cargo_uld_number:
        cargoUldNumber || null,
      dangerous_goods:
        dangerousGoods || null,
      special_cargo:
        specialCargo || null,
      warehouse_location:
        warehouseLocation || null,
      cargo_loading_start_time:
        cargoLoadingStartTime || null,
      cargo_loading_end_time:
        cargoLoadingEndTime || null,
      cargo_remarks:
        cargoRemarks || null,
      cargo_comments:
        cargoComments || null,

      created_by: user.id,
    };

    const { data, error } = await supabase
      .from("flight_service_captures")
      .insert(serviceCapture)
      .select("*")
      .single();

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      setCaptures((current) => [
        data as Capture,
        ...current,
      ]);
    }

    alert(
      `${
        departmentNames[department] ||
        department
      } service capture saved successfully!`
    );

    if (isManagement) {
      return;
    }

    router.push(
      `/flights?department=${department}`
    );
  };

  // =========================
  // STATUS CLASS
  // =========================

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

  // =========================
  // LOADING
  // =========================

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
        </div>
      </main>
    );
  }

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

      <section className="dashboard-content">

        {/* TITLE */}

        <div className="welcome-section">

          <button
            className="logout-button"
            onClick={() =>
              router.push(
                isManagement
                  ? "/management"
                  : `/flights?department=${department}`
              )
            }
            style={{
              marginBottom: "20px",
            }}
          >
            ← BACK
          </button>

          <h1>
            {flight.flight_number}
          </h1>

          <p>
            {isManagement
              ? "Management Flight Details"
              : departmentNames[department] ||
                department}
          </p>

        </div>

        {/* FLIGHT INFORMATION */}

        <section className="flights-section">

          <div style={{ padding: "30px" }}>

            <h2
              style={{
                color: "#071d41",
                marginBottom: "20px",
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
                <strong>
                  Flight Number
                </strong>
                <p>
                  {flight.flight_number}
                </p>
              </div>

              <div>
                <strong>
                  Aircraft
                </strong>
                <p>
                  {flight.aircraft}
                </p>
              </div>

              <div>
                <strong>
                  Route
                </strong>
                <p>
                  {flight.route}
                </p>
              </div>

              <div>
                <strong>
                  Flight Date
                </strong>
                <p>
                  {flight.flight_date}
                </p>
              </div>

              <div>
                <strong>
                  Status
                </strong>

                <p>
                  <span
                    className={getStatusClass(
                      flight.status
                    )}
                  >
                    {flight.status}
                  </span>
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            MANAGEMENT CAPTURES VIEW
        ================================================= */}

        {isManagement && (

          <section className="flights-section">

            <div
              className="section-header"
              style={{
                padding: "25px 30px",
              }}
            >

              <div>
                <h2>
                  Service Captures
                </h2>

                <p>
                  All service captures for this
                  flight.
                </p>
              </div>

            </div>

            {captures.length === 0 ? (

              <div
                className="empty-state"
                style={{
                  padding: "40px",
                }}
              >
                <h3>
                  No service captures yet
                </h3>

                <p>
                  No department has submitted
                  a service capture for this
                  flight.
                </p>
              </div>

            ) : (

              <div
                className="flight-table-wrapper"
              >

                <table className="flight-table">

                  <thead>
                    <tr>
                      <th>
                        DEPARTMENT
                      </th>

                      <th>
                        CAPTURE ID
                      </th>

                      <th>
                        CREATED
                      </th>

                      <th>
                        ACTION
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {captures.map(
                      (capture) => (

                        <tr
                          key={capture.id}
                        >

                          <td>
                            <strong>
                              {
                                departmentNames[
                                  capture.department
                                ] ||
                                capture.department
                              }
                            </strong>
                          </td>

                          <td>
                            {capture.id.slice(
                              0,
                              8
                            )}
                          </td>

                          <td>
                            {new Date(
                              capture.created_at
                            ).toLocaleString()}
                          </td>

                          <td>

                            <button
                              className="action-button view"
                              type="button"
                              onClick={() =>
                                alert(
                                  `Department: ${
                                    departmentNames[
                                      capture
                                        .department
                                    ] ||
                                    capture.department
                                  }\n\nCapture ID: ${
                                    capture.id
                                  }`
                                )
                              }
                            >
                              VIEW CAPTURE
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

        )}

        {/* =================================================
            REGULAR USER FORMS
        ================================================= */}

        {!isManagement &&
          department === "ramp" && (

            <section className="flights-section">

              <div
                className="section-header"
                style={{
                  padding: "25px 30px",
                }}
              >

                <div>
                  <h2>
                    RAMP DEPARTMENT
                  </h2>

                  <p>
                    Ramp & Ground Service Capture
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

                  {[
                    [
                      "GPU Time",
                      gpuTime,
                      setGpuTime,
                    ],
                    ["ACU", acu, setAcu],
                    [
                      "COBUS",
                      cobus,
                      setCobus,
                    ],
                    [
                      "Towing",
                      towing,
                      setTowing,
                    ],
                    [
                      "Cleaning",
                      cleaning,
                      setCleaning,
                    ],
                    [
                      "Pushback",
                      pushback,
                      setPushback,
                    ],
                    [
                      "Lavatory Service",
                      lavatoryService,
                      setLavatoryService,
                    ],
                    [
                      "Portable Water",
                      portableWater,
                      setPortableWater,
                    ],
                    [
                      "PAX Stairs",
                      paxStairs,
                      setPaxStairs,
                    ],
                    [
                      "Ambulift",
                      ambulift,
                      setAmbulift,
                    ],
                    ["ASU", asu, setAsu],
                    [
                      "PAX Step",
                      paxStep,
                      setPaxStep,
                    ],
                    [
                      "Chocks In",
                      chocksIn,
                      setChocksIn,
                    ],
                    [
                      "Chocks Out",
                      chocksOut,
                      setChocksOut,
                    ],
                    [
                      "Vomiting",
                      vomiting,
                      setVomiting,
                    ],
                  ].map(
                    ([label, value, setter]) => (
                      <div key={label as string}>
                        <label>
                          {label as string}
                        </label>

                        <input
                          type="text"
                          value={value as string}
                          onChange={(e) =>
                            (
                              setter as (
                                value: string
                              ) => void
                            )(e.target.value)
                          }
                        />
                      </div>
                    )
                  )}

                </div>

                <div>

                  <label>
                    Ramp Comments
                  </label>

                  <textarea
                    value={rampComments}
                    onChange={(e) =>
                      setRampComments(
                        e.target.value
                      )
                    }
                    rows={4}
                  />

                </div>

                <button
                  type="submit"
                  className="new-flight-button"
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE RAMP CAPTURE"}
                </button>

              </form>

            </section>
          )}

        {!isManagement &&
          department === "sorting" && (

            <section className="flights-section">

              <div
                className="section-header"
                style={{
                  padding: "25px 30px",
                }}
              >

                <div>
                  <h2>
                    SORTING DEPARTMENT
                  </h2>

                  <p>
                    Baggage & ULD Sorting
                    Service Capture
                  </p>
                </div>

              </div>

              <form
                onSubmit={handleSave}
                style={{
                  padding: "30px",
                  display: "grid",
                  gap: "20px",
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
                    <label>
                      ULD / Bag Sorting
                    </label>
                    <input
                      value={uldBagSorting}
                      onChange={(e) =>
                        setUldBagSorting(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Number of Bags
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={numberOfBags}
                      onChange={(e) =>
                        setNumberOfBags(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      ULD Number
                    </label>
                    <input
                      value={uldNumber}
                      onChange={(e) =>
                        setUldNumber(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Sorting Start Time
                    </label>
                    <input
                      type="time"
                      value={sortingStartTime}
                      onChange={(e) =>
                        setSortingStartTime(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Sorting End Time
                    </label>
                    <input
                      type="time"
                      value={sortingEndTime}
                      onChange={(e) =>
                        setSortingEndTime(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Bag Transfer
                    </label>
                    <input
                      value={bagTransfer}
                      onChange={(e) =>
                        setBagTransfer(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Rush / Priority Bags
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={rushPriorityBags}
                      onChange={(e) =>
                        setRushPriorityBags(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Misrouted Bags
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={misroutedBags}
                      onChange={(e) =>
                        setMisroutedBags(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Damaged Bags
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={damagedBags}
                      onChange={(e) =>
                        setDamagedBags(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Missing Bags
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={missingBags}
                      onChange={(e) =>
                        setMissingBags(
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <div>
                  <label>
                    Sorting Remarks
                  </label>

                  <textarea
                    value={sortingRemarks}
                    onChange={(e) =>
                      setSortingRemarks(
                        e.target.value
                      )
                    }
                    rows={4}
                  />
                </div>

                <div>
                  <label>
                    Sorting Comments
                  </label>

                  <textarea
                    value={sortingComments}
                    onChange={(e) =>
                      setSortingComments(
                        e.target.value
                      )
                    }
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  className="new-flight-button"
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE SORTING CAPTURE"}
                </button>

              </form>

            </section>
          )}

        {!isManagement &&
          department ===
            "passenger_services" && (

            <section className="flights-section">

              <div
                className="section-header"
                style={{
                  padding: "25px 30px",
                }}
              >

                <div>
                  <h2>
                    PASSENGER SERVICES
                  </h2>

                  <p>
                    Passenger & Gate Services
                    Capture
                  </p>
                </div>

              </div>

              <form
                onSubmit={handleSave}
                style={{
                  padding: "30px",
                  display: "grid",
                  gap: "20px",
                }}
              >

                <h3>
                  Check-in
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                  }}
                >

                  <div>
                    <label>
                      Check-in Start Time
                    </label>
                    <input
                      type="time"
                      value={
                        checkInStartTime
                      }
                      onChange={(e) =>
                        setCheckInStartTime(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Check-in End Time
                    </label>
                    <input
                      type="time"
                      value={
                        checkInEndTime
                      }
                      onChange={(e) =>
                        setCheckInEndTime(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Check-in Agents
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={checkInAgents}
                      onChange={(e) =>
                        setCheckInAgents(
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <h3>
                  Boarding
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                  }}
                >

                  <div>
                    <label>
                      Boarding Start Time
                    </label>
                    <input
                      type="time"
                      value={
                        boardingStartTime
                      }
                      onChange={(e) =>
                        setBoardingStartTime(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Boarding End Time
                    </label>
                    <input
                      type="time"
                      value={
                        boardingEndTime
                      }
                      onChange={(e) =>
                        setBoardingEndTime(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Boarding Agents
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={boardingAgents}
                      onChange={(e) =>
                        setBoardingAgents(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Gate Number
                    </label>
                    <input
                      value={gateNumber}
                      onChange={(e) =>
                        setGateNumber(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Gate Open Time
                    </label>
                    <input
                      type="time"
                      value={gateOpenTime}
                      onChange={(e) =>
                        setGateOpenTime(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Gate Close Time
                    </label>
                    <input
                      type="time"
                      value={gateCloseTime}
                      onChange={(e) =>
                        setGateCloseTime(
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <h3>
                  Passenger Assistance
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                  }}
                >

                  <div>
                    <label>
                      Wheelchair Assistance
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={
                        wheelchairAssistance
                      }
                      onChange={(e) =>
                        setWheelchairAssistance(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Special Assistance
                    </label>
                    <input
                      value={
                        specialAssistance
                      }
                      onChange={(e) =>
                        setSpecialAssistance(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      No-show PAX
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={noShowPax}
                      onChange={(e) =>
                        setNoShowPax(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Denied Boarding PAX
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={
                        deniedBoardingPax
                      }
                      onChange={(e) =>
                        setDeniedBoardingPax(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Transfer PAX
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={transferPax}
                      onChange={(e) =>
                        setTransferPax(
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <div>
                  <label>
                    Passenger Services Remarks
                  </label>
                  <textarea
                    value={
                      passengerServicesRemarks
                    }
                    onChange={(e) =>
                      setPassengerServicesRemarks(
                        e.target.value
                      )
                    }
                    rows={4}
                  />
                </div>

                <div>
                  <label>
                    Passenger Services Comments
                  </label>
                  <textarea
                    value={
                      passengerServicesComments
                    }
                    onChange={(e) =>
                      setPassengerServicesComments(
                        e.target.value
                      )
                    }
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  className="new-flight-button"
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE PASSENGER SERVICES"}
                </button>

              </form>

            </section>
          )}

        {!isManagement &&
          department ===
            "load_control_ops" && (

            <section className="flights-section">

              <div
                className="section-header"
                style={{
                  padding: "25px 30px",
                }}
              >

                <div>
                  <h2>
                    LOAD CONTROL / OPS
                  </h2>

                  <p>
                    Flight Service Capture
                  </p>
                </div>

              </div>

              <form
                onSubmit={handleSave}
                style={{
                  padding: "30px",
                  display: "grid",
                  gap: "20px",
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
                    <label>
                      PAX
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={pax}
                      onChange={(e) =>
                        setPax(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Baggages
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={baggages}
                      onChange={(e) =>
                        setBaggages(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Cargo
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cargo}
                      onChange={(e) =>
                        setCargo(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Parking Bay
                    </label>
                    <input
                      value={parkingBay}
                      onChange={(e) =>
                        setParkingBay(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Load / Ramp
                    </label>
                    <input
                      value={loadRamp}
                      onChange={(e) =>
                        setLoadRamp(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      STD / ETD
                    </label>
                    <input
                      value={stdEtd}
                      onChange={(e) =>
                        setStdEtd(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      STA / ETA
                    </label>
                    <input
                      value={staEta}
                      onChange={(e) =>
                        setStaEta(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Actual Departure
                    </label>
                    <input
                      type="datetime-local"
                      value={
                        actualDeparture
                      }
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
                      value={
                        actualArrival
                      }
                      onChange={(e) =>
                        setActualArrival(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Load Control / TRC Name
                    </label>
                    <input
                      value={
                        loadControlTrcName
                      }
                      onChange={(e) =>
                        setLoadControlTrcName(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      SAL Name
                    </label>
                    <input
                      value={salName}
                      onChange={(e) =>
                        setSalName(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      IATA Delay Code
                    </label>
                    <input
                      value={iataDelayCode}
                      onChange={(e) =>
                        setIataDelayCode(
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <div>
                  <label>
                    Delay Reason
                  </label>
                  <textarea
                    value={delayReason}
                    onChange={(e) =>
                      setDelayReason(
                        e.target.value
                      )
                    }
                    rows={4}
                  />
                </div>

                <div>
                  <label>
                    Operational Remarks
                  </label>
                  <textarea
                    value={
                      operationalRemarks
                    }
                    onChange={(e) =>
                      setOperationalRemarks(
                        e.target.value
                      )
                    }
                    rows={4}
                  />
                </div>

                <div>
                  <label>
                    Comments
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) =>
                      setComments(
                        e.target.value
                      )
                    }
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  className="new-flight-button"
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE SERVICE CAPTURE"}
                </button>

              </form>

            </section>
          )}

        {!isManagement &&
          department === "cargo" && (

            <section className="flights-section">

              <div
                className="section-header"
                style={{
                  padding: "25px 30px",
                }}
              >

                <div>
                  <h2>
                    CARGO DEPARTMENT
                  </h2>

                  <p>
                    Cargo Operations Service
                    Capture
                  </p>
                </div>

              </div>

              <form
                onSubmit={handleSave}
                style={{
                  padding: "30px",
                  display: "grid",
                  gap: "20px",
                }}
              >

                <h3>
                  Cargo Acceptance
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                  }}
                >

                  <div>
                    <label>
                      Cargo Acceptance Start Time
                    </label>
                    <input
                      type="time"
                      value={
                        cargoAcceptanceStartTime
                      }
                      onChange={(e) =>
                        setCargoAcceptanceStartTime(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Cargo Acceptance End Time
                    </label>
                    <input
                      type="time"
                      value={
                        cargoAcceptanceEndTime
                      }
                      onChange={(e) =>
                        setCargoAcceptanceEndTime(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Cargo Weight
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cargoWeight}
                      onChange={(e) =>
                        setCargoWeight(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Cargo Pieces
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={cargoPieces}
                      onChange={(e) =>
                        setCargoPieces(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      AWB Number
                    </label>
                    <input
                      value={awbNumber}
                      onChange={(e) =>
                        setAwbNumber(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Cargo ULD Number
                    </label>
                    <input
                      value={cargoUldNumber}
                      onChange={(e) =>
                        setCargoUldNumber(
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <h3>
                  Special Cargo
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                  }}
                >

                  <div>
                    <label>
                      Dangerous Goods
                    </label>
                    <input
                      value={dangerousGoods}
                      onChange={(e) =>
                        setDangerousGoods(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Special Cargo
                    </label>
                    <input
                      value={specialCargo}
                      onChange={(e) =>
                        setSpecialCargo(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Warehouse Location
                    </label>
                    <input
                      value={
                        warehouseLocation
                      }
                      onChange={(e) =>
                        setWarehouseLocation(
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <h3>
                  Cargo Loading
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                  }}
                >

                  <div>
                    <label>
                      Cargo Loading Start Time
                    </label>
                    <input
                      type="time"
                      value={
                        cargoLoadingStartTime
                      }
                      onChange={(e) =>
                        setCargoLoadingStartTime(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Cargo Loading End Time
                    </label>
                    <input
                      type="time"
                      value={
                        cargoLoadingEndTime
                      }
                      onChange={(e) =>
                        setCargoLoadingEndTime(
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <div>
                  <label>
                    Cargo Remarks
                  </label>
                  <textarea
                    value={cargoRemarks}
                    onChange={(e) =>
                      setCargoRemarks(
                        e.target.value
                      )
                    }
                    rows={4}
                  />
                </div>

                <div>
                  <label>
                    Cargo Comments
                  </label>
                  <textarea
                    value={cargoComments}
                    onChange={(e) =>
                      setCargoComments(
                        e.target.value
                      )
                    }
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  className="new-flight-button"
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE CARGO CAPTURE"}
                </button>

              </form>

            </section>
          )}

      </section>

      <footer className="dashboard-footer">

        <p>
          TRANSOM Flight Service Capture
        </p>

        <span>
          {isManagement
            ? "Management — Authorized Personnel Only"
            : "Authorized Personnel Only"}
        </span>

      </footer>

    </main>
  );
}

export default function FlightDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="dashboard-page">

          <div className="empty-state">

            <h3>
              Loading flight...
            </h3>

          </div>

        </main>
      }
    >
      <FlightDetailsContent />
    </Suspense>
  );
}
