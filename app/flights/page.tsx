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

type Profile = {
  id: string;
  full_name: string;
  role: string;
  department: string;
};

const departmentNames: Record<string, string> = {
  ramp: "RAMP",
  sorting: "SORTING",
  load_control_ops: "LOAD CONTROL / OPS",
  passenger_services: "PASSENGER SERVICES",
  cargo: "CARGO",
};

const departmentDescriptions: Record<string, string> = {
  ramp: "Ramp & Ground Services",
  sorting: "Baggage & ULD Sorting",
  load_control_ops: "Load Control & Operations",
  passenger_services: "Passenger & Gate Services",
  cargo: "Cargo Operations",
};

function calculateDuration(start: string, end: string) {
  if (!start || !end) return "";

  const s = new Date(`1970-01-01T${start}`);
  const e = new Date(`1970-01-01T${end}`);

  if (
    Number.isNaN(s.getTime()) ||
    Number.isNaN(e.getTime())
  ) {
    return "";
  }

  let difference = e.getTime() - s.getTime();

  if (difference < 0) {
    difference += 24 * 60 * 60 * 1000;
  }

  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    mins
  ).padStart(2, "0")}`;
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="transom-field">
      <label>{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* =========================================================
   TEXT AREA
========================================================= */

function TextAreaField({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="transom-field transom-textarea">
      <label>{label}</label>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* =========================================================
   SERVICE CARD
========================================================= */

function ServiceTime({
  title,
  start,
  end,
  setStart,
  setEnd,
}: {
  title: string;
  start: string;
  end: string;
  setStart: (value: string) => void;
  setEnd: (value: string) => void;
}) {
  const duration = calculateDuration(start, end);

  return (
    <div className="service-box">
      <div className="service-box-header">
        <span className="service-icon">✓</span>
        <strong>{title}</strong>
      </div>

      <div className="service-times">
        <div>
          <label>START TIME</label>
          <input
            type="time"
            value={start}
            onChange={(e) =>
              setStart(e.target.value)
            }
          />
        </div>

        <div>
          <label>END TIME</label>
          <input
            type="time"
            value={end}
            onChange={(e) =>
              setEnd(e.target.value)
            }
          />
        </div>
      </div>

      <div className="duration-box">
        <span>SERVICE DURATION</span>
        <strong>{duration || "--:--"}</strong>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS BUTTON
========================================================= */

function StatusButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`status-control ${
        active ? "status-active" : ""
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/* =========================================================
   MAIN
========================================================= */

function FlightCapturePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const flightId = params.id as string;

  const department =
    searchParams.get("department") || "ramp";

  const [flight, setFlight] =
    useState<Flight | null>(null);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /* =====================================================
     RAMP
  ===================================================== */

  const [gpuStart, setGpuStart] = useState("");
  const [gpuEnd, setGpuEnd] = useState("");

  const [acuStart, setAcuStart] = useState("");
  const [acuEnd, setAcuEnd] = useState("");

  const [cleaningStart, setCleaningStart] =
    useState("");
  const [cleaningEnd, setCleaningEnd] =
    useState("");

  const [conveyorStart, setConveyorStart] =
    useState("");
  const [conveyorEnd, setConveyorEnd] =
    useState("");

  const [vomitingStart, setVomitingStart] =
    useState("");
  const [vomitingEnd, setVomitingEnd] =
    useState("");

  const [cobus, setCobus] = useState("");
  const [towing, setTowing] = useState("");
  const [pushback, setPushback] = useState("");
  const [lavatoryService, setLavatoryService] =
    useState("");
  const [portableWater, setPortableWater] =
    useState("");
  const [paxStairs, setPaxStairs] =
    useState("");
  const [paxStep, setPaxStep] =
    useState("");
  const [ambulift, setAmbulift] =
    useState("");
  const [asu, setAsu] = useState("");
  const [chocksIn, setChocksIn] =
    useState("");
  const [chocksOut, setChocksOut] =
    useState("");

  const [supervisorName, setSupervisorName] =
    useState("");

  const [rampOpeningStatus, setRampOpeningStatus] =
    useState("");

  const [rampClosingStatus, setRampClosingStatus] =
    useState("");

  const [rampComments, setRampComments] =
    useState("");

  /* =====================================================
     SORTING
  ===================================================== */

  const [uldBagSorting, setUldBagSorting] =
    useState("");

  const [numberOfBags, setNumberOfBags] =
    useState("");

  const [uldNumber, setUldNumber] =
    useState("");

  const [sortingStart, setSortingStart] =
    useState("");

  const [sortingEnd, setSortingEnd] =
    useState("");

  const [bagTransfer, setBagTransfer] =
    useState("");

  const [rushPriority, setRushPriority] =
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

  /* =====================================================
     LOAD CONTROL
  ===================================================== */

  const [pax, setPax] = useState("");
  const [baggages, setBaggages] =
    useState("");
  const [cargo, setCargo] = useState("");
  const [parkingBay, setParkingBay] =
    useState("");
  const [loadRamp, setLoadRamp] =
    useState("");

  const [std, setStd] = useState("");
  const [etd, setEtd] = useState("");
  const [sta, setSta] = useState("");
  const [eta, setEta] = useState("");

  const [actualDeparture, setActualDeparture] =
    useState("");

  const [actualArrival, setActualArrival] =
    useState("");

  const [loadControlTrcName, setLoadControlTrcName] =
    useState("");

  const [salName, setSalName] =
    useState("");

  const [iataDelayCode, setIataDelayCode] =
    useState("");

  const [delayReason, setDelayReason] =
    useState("");

  const [operationalRemarks, setOperationalRemarks] =
    useState("");

  const [loadControlComments, setLoadControlComments] =
    useState("");

  /* =====================================================
     PASSENGER SERVICES
  ===================================================== */

  const [checkInStart, setCheckInStart] =
    useState("");

  const [checkInEnd, setCheckInEnd] =
    useState("");

  const [checkInAgents, setCheckInAgents] =
    useState("");

  const [boardingStart, setBoardingStart] =
    useState("");

  const [boardingEnd, setBoardingEnd] =
    useState("");

  const [boardingAgents, setBoardingAgents] =
    useState("");

  const [gateNumber, setGateNumber] =
    useState("");

  const [gateOpen, setGateOpen] =
    useState("");

  const [gateClose, setGateClose] =
    useState("");

  const [wheelchair, setWheelchair] =
    useState("");

  const [specialAssistance, setSpecialAssistance] =
    useState("");

  const [noShow, setNoShow] =
    useState("");

  const [deniedBoarding, setDeniedBoarding] =
    useState("");

  const [transferPax, setTransferPax] =
    useState("");

  const [passengerRemarks, setPassengerRemarks] =
    useState("");

  const [passengerComments, setPassengerComments] =
    useState("");

  /* =====================================================
     CARGO
  ===================================================== */

  const [cargoAcceptanceStart, setCargoAcceptanceStart] =
    useState("");

  const [cargoAcceptanceEnd, setCargoAcceptanceEnd] =
    useState("");

  const [cargoType, setCargoType] =
    useState("");

  const [cargoWeight, setCargoWeight] =
    useState("");

  const [cargoPieces, setCargoPieces] =
    useState("");

  const [awb, setAwb] =
    useState("");

  const [cargoUldNumber, setCargoUldNumber] =
    useState("");

  const [dangerousGoods, setDangerousGoods] =
    useState("");

  const [specialCargo, setSpecialCargo] =
    useState("");

  const [warehouseLocation, setWarehouseLocation] =
    useState("");

  const [loadingStart, setLoadingStart] =
    useState("");

  const [loadingEnd, setLoadingEnd] =
    useState("");

  const [doName, setDoName] =
    useState("");

  const [agentName, setAgentName] =
    useState("");

  const [cargoRemarks, setCargoRemarks] =
    useState("");

  const [cargoComments, setCargoComments] =
    useState("");

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      const { data: profileData } =
        await supabase
          .from("profiles")
          .select(
            "id, full_name, role, department"
          )
          .eq("id", user.id)
          .single();

      if (profileData) {
        setProfile(profileData);
      }

      const { data: flightData, error } =
        await supabase
          .from("flights")
          .select(
            "id, flight_number, aircraft, route, flight_date, status"
          )
          .eq("id", flightId)
          .single();

      if (error) {
        setMessage(
          `Unable to load flight: ${error.message}`
        );
      }

      if (flightData) {
        setFlight(flightData);
      }

      setLoading(false);
    };

    loadData();
  }, [flightId, router]);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = async () => {
    if (!profile || !flight) return;

    setSaving(true);
    setMessage("");

    const captureData: any = {
      flight_id: flight.id,
      department,
      created_by: profile.id,

      gpu_start: gpuStart,
      gpu_end: gpuEnd,
      gpu_duration: calculateDuration(
        gpuStart,
        gpuEnd
      ),

      acu_start: acuStart,
      acu_end: acuEnd,
      acu_duration: calculateDuration(
        acuStart,
        acuEnd
      ),

      cleaning_start: cleaningStart,
      cleaning_end: cleaningEnd,
      cleaning_duration: calculateDuration(
        cleaningStart,
        cleaningEnd
      ),

      conveyor_start: conveyorStart,
      conveyor_end: conveyorEnd,
      conveyor_duration: calculateDuration(
        conveyorStart,
        conveyorEnd
      ),

      vomiting_start: vomitingStart,
      vomiting_end: vomitingEnd,
      vomiting_duration: calculateDuration(
        vomitingStart,
        vomitingEnd
      ),

      cobus,
      towing,
      pushback,
      lavatory_service: lavatoryService,
      portable_water: portableWater,
      pax_stairs: paxStairs,
      pax_step: paxStep,
      ambulift,
      asu,
      chocks_in: chocksIn,
      chocks_out: chocksOut,

      supervisor_name: supervisorName,
      ramp_opening_status: rampOpeningStatus,
      ramp_closing_status: rampClosingStatus,
      ramp_comments: rampComments,

      uld_bag_sorting: uldBagSorting,
      number_of_bags: numberOfBags,
      uld_number: uldNumber,
      sorting_start: sortingStart,
      sorting_end: sortingEnd,
      sorting_duration: calculateDuration(
        sortingStart,
        sortingEnd
      ),
      bag_transfer: bagTransfer,
      rush_priority: rushPriority,
      misrouted_bags: misroutedBags,
      damaged_bags: damagedBags,
      missing_bags: missingBags,
      sorting_remarks: sortingRemarks,
      sorting_comments: sortingComments,

      pax,
      baggages,
      cargo,
      parking_bay: parkingBay,
      load_ramp: loadRamp,
      std,
      etd,
      sta,
      eta,
      actual_departure: actualDeparture,
      actual_arrival: actualArrival,
      load_control_trc_name:
        loadControlTrcName,
      sal_name: salName,
      iata_delay_code: iataDelayCode,
      delay_reason: delayReason,
      operational_remarks:
        operationalRemarks,
      load_control_comments:
        loadControlComments,

      check_in_start: checkInStart,
      check_in_end: checkInEnd,
      check_in_duration: calculateDuration(
        checkInStart,
        checkInEnd
      ),
      check_in_agents: checkInAgents,

      boarding_start: boardingStart,
      boarding_end: boardingEnd,
      boarding_duration: calculateDuration(
        boardingStart,
        boardingEnd
      ),
      boarding_agents: boardingAgents,

      gate_number: gateNumber,
      gate_open: gateOpen,
      gate_close: gateClose,
      wheelchair,
      special_assistance: specialAssistance,
      no_show: noShow,
      denied_boarding: deniedBoarding,
      transfer_pax: transferPax,
      passenger_remarks: passengerRemarks,
      passenger_comments: passengerComments,

      cargo_acceptance_start:
        cargoAcceptanceStart,
      cargo_acceptance_end:
        cargoAcceptanceEnd,
      cargo_acceptance_duration:
        calculateDuration(
          cargoAcceptanceStart,
          cargoAcceptanceEnd
        ),

      cargo_type: cargoType,
      cargo_weight: cargoWeight,
      cargo_pieces: cargoPieces,
      awb,
      cargo_uld_number: cargoUldNumber,
      dangerous_goods: dangerousGoods,
      special_cargo: specialCargo,
      warehouse_location:
        warehouseLocation,

      loading_start: loadingStart,
      loading_end: loadingEnd,
      loading_duration: calculateDuration(
        loadingStart,
        loadingEnd
      ),

      do_name: doName,
      agent_name: agentName,
      cargo_remarks: cargoRemarks,
      cargo_comments: cargoComments,
    };

    const { error } =
      await supabase
        .from("flight_service_captures")
        .insert([captureData]);

    if (error) {
      setMessage(
        `SAVE ERROR: ${error.message}`
      );
    } else {
      setMessage(
        "SERVICE CAPTURE SAVED SUCCESSFULLY"
      );
    }

    setSaving(false);
  };

  /* =====================================================
     STATUS
  ===================================================== */

  const updateFlightStatus = async (
    status: string
  ) => {
    if (!flight) return;

    const { error } =
      await supabase
        .from("flights")
        .update({ status })
        .eq("id", flight.id);

    if (error) {
      setMessage(
        `STATUS ERROR: ${error.message}`
      );
      return;
    }

    setFlight({
      ...flight,
      status,
    });
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="transom-loading">
        <div className="loading-card">
          <div className="loading-logo">
            TRANSOM
          </div>
          LOADING FLIGHT...
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="transom-loading">
        <div className="loading-card">
          <h2>FLIGHT NOT FOUND</h2>

          <button
            onClick={() =>
              router.push(
                `/flights?department=${department}`
              )
            }
          >
            ← BACK TO FLIGHTS
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="transom-capture-page">

        {/* =================================================
            TOP HEADER
        ================================================= */}

        <header className="transom-topbar">
          <div className="transom-logo">
            TRANSOM
            <span>
              FLIGHT SERVICE CAPTURE
            </span>
          </div>

          <div className="topbar-right">
            <span>
              {profile?.full_name ||
                "Authorized User"}
            </span>

            <button onClick={handleLogout}>
              LOGOUT
            </button>
          </div>
        </header>

        {/* =================================================
            MAIN CONTAINER
        ================================================= */}

        <section className="transom-container">

          {/* =================================================
              PAGE TITLE
          ================================================= */}

          <div className="page-title">

            <div className="title-icon">
              {department === "ramp"
                ? "✈"
                : department === "sorting"
                ? "▣"
                : department ===
                  "load_control_ops"
                ? "☑"
                : department ===
                  "passenger_services"
                ? "♙"
                : "▥"}
            </div>

            <div>
              <h1>
                {departmentNames[
                  department
                ] || department}
              </h1>

              <p>
                {
                  departmentDescriptions[
                    department
                  ]
                }
              </p>
            </div>

          </div>

          <div className="title-line" />

          {/* =================================================
              FLIGHT CARD
          ================================================= */}

          <div className="flight-card">

            <div className="flight-card-title">
              <span>FLIGHT</span>

              <strong>
                {flight.flight_number}
              </strong>
            </div>

            <div className="flight-card-item">
              <span>AIRCRAFT</span>
              <strong>
                {flight.aircraft}
              </strong>
            </div>

            <div className="flight-card-item">
              <span>ROUTE</span>
              <strong>
                {flight.route}
              </strong>
            </div>

            <div className="flight-card-item">
              <span>DATE</span>
              <strong>
                {flight.flight_date}
              </strong>
            </div>

            <div className="flight-card-item">
              <span>STATUS</span>

              <strong
                className={`flight-status ${
                  flight.status ===
                  "In Progress"
                    ? "blue-status"
                    : flight.status ===
                      "Closed - No Delay"
                    ? "green-status"
                    : flight.status ===
                      "Closed - With Delay"
                    ? "red-status"
                    : "white-status"
                }`}
              >
                {flight.status}
              </strong>
            </div>

          </div>

          {/* =================================================
              STATUS
          ================================================= */}

          <div className="section-card">

            <div className="section-card-title">
              <div>
                <h2>FLIGHT STATUS</h2>
                <p>
                  Update the operational
                  flight status
                </p>
              </div>
            </div>

            <div className="status-buttons">

              <StatusButton
                label="OPEN"
                active={
                  flight.status === "Open"
                }
                onClick={() =>
                  updateFlightStatus("Open")
                }
              />

              <StatusButton
                label="IN PROGRESS"
                active={
                  flight.status ===
                  "In Progress"
                }
                onClick={() =>
                  updateFlightStatus(
                    "In Progress"
                  )
                }
              />

              <StatusButton
                label="CLOSED - NO DELAY"
                active={
                  flight.status ===
                  "Closed - No Delay"
                }
                onClick={() =>
                  updateFlightStatus(
                    "Closed - No Delay"
                  )
                }
              />

              <StatusButton
                label="CLOSED - WITH DELAY"
                active={
                  flight.status ===
                  "Closed - With Delay"
                }
                onClick={() =>
                  updateFlightStatus(
                    "Closed - With Delay"
                  )
                }
              />

            </div>

          </div>

          {/* =================================================
              RAMP
          ================================================= */}

          {department === "ramp" && (
            <div className="department-area">

              <DepartmentHeading
                icon="✈"
                title="RAMP SERVICES"
                description="Ramp & Ground Services"
                color="red"
              />

              <div className="service-grid">

                <ServiceTime
                  title="GPU TIME"
                  start={gpuStart}
                  end={gpuEnd}
                  setStart={setGpuStart}
                  setEnd={setGpuEnd}
                />

                <ServiceTime
                  title="ACU"
                  start={acuStart}
                  end={acuEnd}
                  setStart={setAcuStart}
                  setEnd={setAcuEnd}
                />

                <ServiceTime
                  title="CLEANING"
                  start={cleaningStart}
                  end={cleaningEnd}
                  setStart={setCleaningStart}
                  setEnd={setCleaningEnd}
                />

                <ServiceTime
                  title="CONVEYOR"
                  start={conveyorStart}
                  end={conveyorEnd}
                  setStart={setConveyorStart}
                  setEnd={setConveyorEnd}
                />

                <ServiceTime
                  title="VOMITING"
                  start={vomitingStart}
                  end={vomitingEnd}
                  setStart={setVomitingStart}
                  setEnd={setVomitingEnd}
                />

              </div>

              <div className="fields-card">

                <div className="fields-card-heading">
                  OTHER RAMP SERVICES
                </div>

                <div className="field-grid">

                  <Field
                    label="COBUS"
                    value={cobus}
                    onChange={setCobus}
                  />

                  <Field
                    label="TOWING"
                    value={towing}
                    onChange={setTowing}
                  />

                  <Field
                    label="PUSHBACK"
                    value={pushback}
                    onChange={setPushback}
                  />

                  <Field
                    label="LAVATORY SERVICE"
                    value={lavatoryService}
                    onChange={setLavatoryService}
                  />

                  <Field
                    label="PORTABLE WATER"
                    value={portableWater}
                    onChange={setPortableWater}
                  />

                  <Field
                    label="PAX STAIRS"
                    value={paxStairs}
                    onChange={setPaxStairs}
                  />

                  <Field
                    label="PAX STEP"
                    value={paxStep}
                    onChange={setPaxStep}
                  />

                  <Field
                    label="AMBULIFT"
                    value={ambulift}
                    onChange={setAmbulift}
                  />

                  <Field
                    label="ASU"
                    value={asu}
                    onChange={setAsu}
                  />

                  <Field
                    label="CHOCKS IN"
                    value={chocksIn}
                    onChange={setChocksIn}
                  />

                  <Field
                    label="CHOCKS OUT"
                    value={chocksOut}
                    onChange={setChocksOut}
                  />

                  <Field
                    label="SUPERVISOR NAME"
                    value={supervisorName}
                    onChange={setSupervisorName}
                  />

                  <Field
                    label="RAMP OPENING STATUS"
                    value={rampOpeningStatus}
                    onChange={
                      setRampOpeningStatus
                    }
                  />

                  <Field
                    label="RAMP CLOSING STATUS"
                    value={rampClosingStatus}
                    onChange={
                      setRampClosingStatus
                    }
                  />

                </div>

                <TextAreaField
                  label="RAMP COMMENTS"
                  value={rampComments}
                  onChange={setRampComments}
                  placeholder="Enter comments..."
                />

              </div>

            </div>
          )}

          {/* =================================================
              SORTING
          ================================================= */}

          {department === "sorting" && (
            <div className="department-area">

              <DepartmentHeading
                icon="▣"
                title="SORTING SERVICES"
                description="Baggage & ULD Sorting"
                color="navy"
              />

              <div className="fields-card">

                <div className="field-grid">

                  <Field
                    label="ULD / BAG SORTING"
                    value={uldBagSorting}
                    onChange={setUldBagSorting}
                  />

                  <Field
                    label="NUMBER OF BAGS"
                    value={numberOfBags}
                    onChange={setNumberOfBags}
                    type="number"
                  />

                  <Field
                    label="ULD NUMBER"
                    value={uldNumber}
                    onChange={setUldNumber}
                  />

                </div>

              </div>

              <div className="service-grid">

                <ServiceTime
                  title="SORTING"
                  start={sortingStart}
                  end={sortingEnd}
                  setStart={setSortingStart}
                  setEnd={setSortingEnd}
                />

              </div>

              <div className="fields-card">

                <div className="field-grid">

                  <Field
                    label="BAG TRANSFER"
                    value={bagTransfer}
                    onChange={setBagTransfer}
                  />

                  <Field
                    label="RUSH / PRIORITY"
                    value={rushPriority}
                    onChange={setRushPriority}
                  />

                  <Field
                    label="MISROUTED BAGS"
                    value={misroutedBags}
                    onChange={setMisroutedBags}
                  />

                  <Field
                    label="DAMAGED BAGS"
                    value={damagedBags}
                    onChange={setDamagedBags}
                  />

                  <Field
                    label="MISSING BAGS"
                    value={missingBags}
                    onChange={setMissingBags}
                  />

                  <Field
                    label="REMARKS"
                    value={sortingRemarks}
                    onChange={setSortingRemarks}
                  />

                </div>

                <TextAreaField
                  label="SORTING COMMENTS"
                  value={sortingComments}
                  onChange={setSortingComments}
                />

              </div>

            </div>
          )}

          {/* =================================================
              LOAD CONTROL
          ================================================= */}

          {department ===
            "load_control_ops" && (
            <div className="department-area">

              <DepartmentHeading
                icon="☑"
                title="LOAD CONTROL / OPS"
                description="Load Control & Operations"
                color="blue"
              />

              <div className="fields-card">

                <div className="field-grid">

                  <Field
                    label="PAX"
                    value={pax}
                    onChange={setPax}
                  />

                  <Field
                    label="BAGGAGES"
                    value={baggages}
                    onChange={setBaggages}
                  />

                  <Field
                    label="CARGO"
                    value={cargo}
                    onChange={setCargo}
                  />

                  <Field
                    label="PARKING BAY"
                    value={parkingBay}
                    onChange={setParkingBay}
                  />

                  <Field
                    label="LOAD / RAMP"
                    value={loadRamp}
                    onChange={setLoadRamp}
                  />

                  <Field
                    label="STD"
                    value={std}
                    onChange={setStd}
                    type="time"
                  />

                  <Field
                    label="ETD"
                    value={etd}
                    onChange={setEtd}
                    type="time"
                  />

                  <Field
                    label="STA"
                    value={sta}
                    onChange={setSta}
                    type="time"
                  />

                  <Field
                    label="ETA"
                    value={eta}
                    onChange={setEta}
                    type="time"
                  />

                  <Field
                    label="ACTUAL DEPARTURE"
                    value={actualDeparture}
                    onChange={
                      setActualDeparture
                    }
                    type="time"
                  />

                  <Field
                    label="ACTUAL ARRIVAL"
                    value={actualArrival}
                    onChange={
                      setActualArrival
                    }
                    type="time"
                  />

                  <Field
                    label="LOAD CONTROL / TRC NAME"
                    value={loadControlTrcName}
                    onChange={
                      setLoadControlTrcName
                    }
                  />

                  <Field
                    label="SAL NAME"
                    value={salName}
                    onChange={setSalName}
                  />

                  <Field
                    label="IATA DELAY CODE"
                    value={iataDelayCode}
                    onChange={
                      setIataDelayCode
                    }
                  />

                  <Field
                    label="DELAY REASON"
                    value={delayReason}
                    onChange={setDelayReason}
                  />

                </div>

                <TextAreaField
                  label="OPERATIONAL REMARKS"
                  value={operationalRemarks}
                  onChange={
                    setOperationalRemarks
                  }
                />

                <TextAreaField
                  label="COMMENTS"
                  value={loadControlComments}
                  onChange={
                    setLoadControlComments
                  }
                />

              </div>

            </div>
          )}

          {/* =================================================
              PASSENGER SERVICES
          ================================================= */}

          {department ===
            "passenger_services" && (
            <div className="department-area">

              <DepartmentHeading
                icon="♙"
                title="PASSENGER SERVICES"
                description="Passenger & Gate Services"
                color="red"
              />

              <div className="service-grid">

                <ServiceTime
                  title="CHECK-IN"
                  start={checkInStart}
                  end={checkInEnd}
                  setStart={setCheckInStart}
                  setEnd={setCheckInEnd}
                />

                <ServiceTime
                  title="BOARDING"
                  start={boardingStart}
                  end={boardingEnd}
                  setStart={setBoardingStart}
                  setEnd={setBoardingEnd}
                />

              </div>

              <div className="fields-card">

                <div className="field-grid">

                  <Field
                    label="CHECK-IN AGENTS"
                    value={checkInAgents}
                    onChange={
                      setCheckInAgents
                    }
                  />

                  <Field
                    label="BOARDING AGENTS"
                    value={boardingAgents}
                    onChange={
                      setBoardingAgents
                    }
                  />

                  <Field
                    label="GATE NUMBER"
                    value={gateNumber}
                    onChange={setGateNumber}
                  />

                  <Field
                    label="GATE OPEN"
                    value={gateOpen}
                    onChange={setGateOpen}
                    type="time"
                  />

                  <Field
                    label="GATE CLOSE"
                    value={gateClose}
                    onChange={setGateClose}
                    type="time"
                  />

                  <Field
                    label="WHEELCHAIR"
                    value={wheelchair}
                    onChange={setWheelchair}
                  />

                  <Field
                    label="SPECIAL ASSISTANCE"
                    value={specialAssistance}
                    onChange={
                      setSpecialAssistance
                    }
                  />

                  <Field
                    label="NO-SHOW"
                    value={noShow}
                    onChange={setNoShow}
                  />

                  <Field
                    label="DENIED BOARDING"
                    value={deniedBoarding}
                    onChange={
                      setDeniedBoarding
                    }
                  />

                  <Field
                    label="TRANSFER PAX"
                    value={transferPax}
                    onChange={setTransferPax}
                  />

                  <Field
                    label="REMARKS"
                    value={passengerRemarks}
                    onChange={
                      setPassengerRemarks
                    }
                  />

                </div>

                <TextAreaField
                  label="PASSENGER SERVICES COMMENTS"
                  value={passengerComments}
                  onChange={
                    setPassengerComments
                  }
                />

              </div>

            </div>
          )}

          {/* =================================================
              CARGO
          ================================================= */}

          {department === "cargo" && (
            <div className="department-area">

              <DepartmentHeading
                icon="▥"
                title="CARGO SERVICES"
                description="Cargo Operations"
                color="navy"
              />

              <div className="service-grid">

                <ServiceTime
                  title="CARGO ACCEPTANCE"
                  start={cargoAcceptanceStart}
                  end={cargoAcceptanceEnd}
                  setStart={
                    setCargoAcceptanceStart
                  }
                  setEnd={
                    setCargoAcceptanceEnd
                  }
                />

                <ServiceTime
                  title="LOADING"
                  start={loadingStart}
                  end={loadingEnd}
                  setStart={setLoadingStart}
                  setEnd={setLoadingEnd}
                />

              </div>

              <div className="fields-card">

                <div className="field-grid">

                  <Field
                    label="CARGO TYPE"
                    value={cargoType}
                    onChange={setCargoType}
                  />

                  <Field
                    label="WEIGHT"
                    value={cargoWeight}
                    onChange={setCargoWeight}
                  />

                  <Field
                    label="PIECES"
                    value={cargoPieces}
                    onChange={setCargoPieces}
                  />

                  <Field
                    label="AWB"
                    value={awb}
                    onChange={setAwb}
                  />

                  <Field
                    label="ULD NUMBER"
                    value={cargoUldNumber}
                    onChange={
                      setCargoUldNumber
                    }
                  />

                  <Field
                    label="DANGEROUS GOODS"
                    value={dangerousGoods}
                    onChange={
                      setDangerousGoods
                    }
                  />

                  <Field
                    label="SPECIAL CARGO"
                    value={specialCargo}
                    onChange={
                      setSpecialCargo
                    }
                  />

                  <Field
                    label="WAREHOUSE LOCATION"
                    value={warehouseLocation}
                    onChange={
                      setWarehouseLocation
                    }
                  />

                  <Field
                    label="DO NAME"
                    value={doName}
                    onChange={setDoName}
                  />

                  <Field
                    label="AGENT NAME"
                    value={agentName}
                    onChange={setAgentName}
                  />

                  <Field
                    label="REMARKS"
                    value={cargoRemarks}
                    onChange={setCargoRemarks}
                  />

                </div>

                <TextAreaField
                  label="CARGO COMMENTS"
                  value={cargoComments}
                  onChange={setCargoComments}
                />

              </div>

            </div>
          )}

          {/* =================================================
              MESSAGE
          ================================================= */}

          {message && (
            <div
              className={`capture-message ${
                message.includes("SUCCESSFULLY")
                  ? "success-message"
                  : "error-message"
              }`}
            >
              {message}
            </div>
          )}

          {/* =================================================
              SAVE
          ================================================= */}

          <div className="save-area">

            <button
              className="save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "SAVING..."
                : `SAVE ${
                    departmentNames[
                      department
                    ] || "SERVICE"
                  } CAPTURE`}
            </button>

          </div>

          {/* =================================================
              BOTTOM
          ================================================= */}

          <div className="bottom-area">

            <button
              className="back-button"
              onClick={() =>
                router.push(
                  `/flights?department=${department}`
                )
              }
            >
              ← BACK TO FLIGHTS
            </button>

            <span>
              TRANSOM Flight Service Capture
            </span>

            <span>
              Authorized Personnel Only
            </span>

          </div>

        </section>
      </main>

      {/* =====================================================
          DESIGN CSS
      ===================================================== */}

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        .transom-capture-page {
          min-height: 100vh;
          background:
            linear-gradient(
              rgba(6, 24, 49, 0.84),
              rgba(6, 24, 49, 0.88)
            ),
            url("/transom-airport.jpg");

          background-size: cover;
          background-position: center;
          background-attachment: fixed;

          color: #172b46;

          padding-bottom: 40px;
        }

        /* TOP */

        .transom-topbar {
          height: 76px;

          background: #071d35;

          border-bottom: 4px solid #e3262e;

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 0 45px;

          color: white;
        }

        .transom-logo {
          font-size: 23px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .transom-logo span {
          display: block;

          font-size: 9px;

          letter-spacing: 2px;

          color: #aebed0;

          margin-top: 4px;
        }

        .topbar-right {
          display: flex;

          align-items: center;

          gap: 15px;
        }

        .topbar-right span {
          font-size: 13px;
          font-weight: 700;
        }

        .topbar-right button {
          border: 1px solid #73869c;

          background: transparent;

          color: white;

          border-radius: 6px;

          padding: 8px 15px;

          font-size: 10px;

          font-weight: 800;
        }

        .topbar-right button:hover {
          background: #e3262e;
          border-color: #e3262e;
        }

        /* MAIN */

        .transom-container {
          width: calc(100% - 80px);

          max-width: 1250px;

          margin: 34px auto 0;

          background: #ffffff;

          border-radius: 17px;

          padding: 30px;

          box-shadow:
            0 20px 55px
            rgba(0, 0, 0, 0.28);
        }

        /* TITLE */

        .page-title {
          display: flex;

          align-items: center;

          gap: 17px;
        }

        .title-icon {
          width: 57px;
          height: 57px;

          border-radius: 50%;

          background: #e3262e;

          color: white;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 27px;

          font-weight: 900;
        }

        .page-title h1 {
          margin: 0;

          font-size: 27px;

          font-weight: 900;

          color: #182b45;

          letter-spacing: 0.2px;
        }

        .page-title p {
          margin: 5px 0 0;

          color: #8490a0;

          font-size: 12px;
        }

        .title-line {
          height: 3px;

          margin-top: 18px;

          background:
            linear-gradient(
              90deg,
              #e3262e 0%,
              #e3262e 18%,
              #3388d1 18%,
              #3388d1 100%
            );
        }

        /* FLIGHT */

        .flight-card {
          margin-top: 22px;

          display: grid;

          grid-template-columns:
            1.2fr
            1fr
            1.4fr
            1.2fr
            1fr;

          border: 1px solid #e1e6ec;

          border-radius: 12px;

          overflow: hidden;

          background: #f9fafc;
        }

        .flight-card > div {
          padding: 17px;

          border-right: 1px solid #e1e6ec;
        }

        .flight-card > div:last-child {
          border-right: none;
        }

        .flight-card span {
          display: block;

          color: #8994a3;

          font-size: 9px;

          font-weight: 900;

          letter-spacing: 1px;

          margin-bottom: 7px;
        }

        .flight-card strong {
          color: #172b46;

          font-size: 15px;

          font-weight: 900;
        }

        .flight-card-title strong {
          font-size: 22px;
        }

        .flight-status {
          display: inline-block;

          padding: 6px 9px;

          border-radius: 5px;

          font-size: 9px !important;

          white-space: nowrap;
        }

        .white-status {
          background: white;

          border: 1px solid #ccd4de;
        }

        .blue-status {
          background: #173b64;
          color: white !important;
        }

        .green-status {
          background: #198754;
          color: white !important;
        }

        .red-status {
          background: #dc3545;
          color: white !important;
        }

        /* SECTION */

        .section-card {
          margin-top: 20px;

          border: 1px solid #e2e7ee;

          border-radius: 12px;

          padding: 19px;

          background: white;
        }

        .section-card-title h2 {
          margin: 0;

          font-size: 14px;

          font-weight: 900;

          color: #172b46;
        }

        .section-card-title p {
          margin: 4px 0 0;

          color: #8a95a3;

          font-size: 11px;
        }

        .status-buttons {
          display: flex;

          flex-wrap: wrap;

          gap: 8px;

          margin-top: 15px;
        }

        .status-control {
          border: 1px solid #d2dbe5;

          background: #fff;

          color: #30445d;

          padding: 9px 13px;

          border-radius: 6px;

          font-size: 9px;

          font-weight: 900;

          transition: 0.2s;
        }

        .status-control:hover,
        .status-active {
          background: #173b64;

          color: white;

          border-color: #173b64;
        }

        /* DEPARTMENT */

        .department-area {
          margin-top: 25px;
        }

        .department-heading {
          display: flex;

          align-items: center;

          gap: 13px;

          padding: 17px 19px;

          border: 1px solid #e1e6ed;

          border-radius: 11px;

          background: #f8fafc;
        }

        .department-heading-icon {
          width: 43px;
          height: 43px;

          border-radius: 50%;

          display: flex;

          align-items: center;

          justify-content: center;

          color: white;

          font-size: 20px;
        }

        .department-heading-icon.red {
          background: #e3262e;
        }

        .department-heading-icon.navy {
          background: #173b64;
        }

        .department-heading-icon.blue {
          background: #238bd1;
        }

        .department-heading h2 {
          margin: 0;

          font-size: 16px;

          font-weight: 900;

          color: #172b46;
        }

        .department-heading p {
          margin: 4px 0 0;

          color: #8a95a3;

          font-size: 11px;
        }

        /* SERVICES */

        .service-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 14px;

          margin-top: 15px;
        }

        .service-box {
          border: 1px solid #dfe5ec;

          border-radius: 11px;

          background: white;

          padding: 15px;

          box-shadow:
            0 3px 10px
            rgba(25, 45, 70, 0.05);
        }

        .service-box-header {
          display: flex;

          align-items: center;

          gap: 8px;

          padding-bottom: 11px;

          border-bottom: 1px solid #edf0f4;

          margin-bottom: 13px;
        }

        .service-icon {
          width: 25px;
          height: 25px;

          border-radius: 50%;

          background: #e3262e;

          color: white;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 11px;
        }

        .service-box-header strong {
          color: #172b46;

          font-size: 11px;

          letter-spacing: 0.5px;
        }

        .service-times {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 8px;
        }

        .service-times label {
          display: block;

          color: #8a95a3;

          font-size: 8px;

          font-weight: 900;

          margin-bottom: 5px;
        }

        .service-times input {
          width: 100%;

          height: 36px;

          border: 1px solid #d8e0e8;

          border-radius: 5px;

          padding: 0 7px;

          background: #fbfcfd;

          color: #172b46;

          font-size: 11px;
        }

        .duration-box {
          margin-top: 10px;

          display: flex;

          justify-content: space-between;

          align-items: center;

          background: #f3f6f9;

          border-radius: 5px;

          padding: 8px 9px;
        }

        .duration-box span {
          color: #8994a3;

          font-size: 8px;

          font-weight: 900;
        }

        .duration-box strong {
          color: #173b64;

          font-size: 11px;
        }

        /* FIELDS CARD */

        .fields-card {
          margin-top: 15px;

          border: 1px solid #dfe5ec;

          border-radius: 11px;

          padding: 18px;

          background: #fff;
        }

        .fields-card-heading {
          font-size: 11px;

          font-weight: 900;

          color: #173b64;

          padding-bottom: 12px;

          border-bottom: 1px solid #e9edf2;

          margin-bottom: 16px;
        }

        .field-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 14px;
        }

        .transom-field label {
          display: block;

          color: #657489;

          font-size: 9px;

          font-weight: 900;

          letter-spacing: 0.5px;

          margin-bottom: 6px;
        }

        .transom-field input,
        .transom-field textarea {
          width: 100%;

          border: 1px solid #d6dee7;

          border-radius: 6px;

          background: #fbfcfd;

          color: #172b46;

          outline: none;
        }

        .transom-field input {
          height: 39px;

          padding: 0 10px;

          font-size: 11px;
        }

        .transom-field textarea {
          min-height: 85px;

          padding: 10px;

          resize: vertical;

          font-size: 11px;
        }

        .transom-field input:focus,
        .transom-field textarea:focus {
          border-color: #318bd0;

          background: white;

          box-shadow:
            0 0 0 2px
            rgba(49, 139, 208, 0.08);
        }

        .transom-textarea {
          margin-top: 15px;
        }

        /* MESSAGE */

        .capture-message {
          margin-top: 18px;

          padding: 12px 15px;

          border-radius: 7px;

          font-size: 10px;

          font-weight: 900;
        }

        .success-message {
          background: #e9f8ef;

          color: #19723f;

          border: 1px solid #b5dfc5;
        }

        .error-message {
          background: #fff0f1;

          color: #b4232d;

          border: 1px solid #efb8bd;
        }

        /* SAVE */

        .save-area {
          display: flex;

          justify-content: flex-end;

          margin-top: 22px;

          padding-top: 20px;

          border-top: 1px solid #e6ebf0;
        }

        .save-button {
          background: #e3262e;

          color: white;

          border: none;

          border-radius: 7px;

          min-height: 43px;

          padding: 0 25px;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 0.5px;

          box-shadow:
            0 4px 10px
            rgba(227, 38, 46, 0.20);
        }

        .save-button:hover {
          background: #c91d26;
        }

        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* BOTTOM */

        .bottom-area {
          margin-top: 25px;

          padding-top: 18px;

          border-top: 1px solid #e5eaf0;

          display: flex;

          justify-content: space-between;

          align-items: center;

          color: #8a95a3;

          font-size: 9px;
        }

        .back-button {
          border: 1px solid #cfd8e2;

          background: white;

          color: #173b64;

          border-radius: 6px;

          padding: 8px 12px;

          font-size: 9px;

          font-weight: 900;
        }

        .back-button:hover {
          background: #173b64;

          color: white;
        }

        /* LOADING */

        .transom-loading {
          min-height: 100vh;

          background:
            linear-gradient(
              rgba(6, 24, 49, 0.88),
              rgba(6, 24, 49, 0.92)
            ),
            url("/transom-airport.jpg");

          background-size: cover;

          display: flex;

          align-items: center;

          justify-content: center;
        }

        .loading-card {
          background: white;

          border-radius: 13px;

          padding: 35px;

          text-align: center;

          color: #173b64;

          font-weight: 900;
        }

        .loading-logo {
          color: #e3262e;

          font-size: 25px;

          margin-bottom: 10px;
        }

        /* TABLET */

        @media (max-width: 900px) {

          .transom-container {
            width: calc(100% - 30px);

            padding: 22px;
          }

          .flight-card {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .flight-card > div:nth-child(3) {
            border-right: none;
          }

          .service-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .field-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        /* MOBILE */

        @media (max-width: 600px) {

          .transom-topbar {
            height: auto;

            min-height: 70px;

            padding: 13px 17px;
          }

          .transom-logo {
            font-size: 18px;
          }

          .topbar-right span {
            display: none;
          }

          .transom-container {
            width: calc(100% - 16px);

            margin-top: 15px;

            padding: 15px;

            border-radius: 12px;
          }

          .page-title h1 {
            font-size: 22px;
          }

          .flight-card {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .flight-card > div {
            border-right: none;

            border-bottom: 1px solid #e1e6ec;
          }

          .service-grid {
            grid-template-columns: 1fr;
          }

          .field-grid {
            grid-template-columns: 1fr;
          }

          .status-buttons {
            display: grid;

            grid-template-columns: 1fr 1fr;
          }

          .status-control {
            width: 100%;
          }

          .save-area {
            justify-content: stretch;
          }

          .save-button {
            width: 100%;
          }

          .bottom-area {
            flex-direction: column;

            text-align: center;

            gap: 10px;
          }

          .back-button {
            width: 100%;
          }
        }

      `}</style>
    </>
  );
}

/* =========================================================
   DEPARTMENT HEADING
========================================================= */

function DepartmentHeading({
  icon,
  title,
  description,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  color: "red" | "navy" | "blue";
}) {
  return (
    <div className="department-heading">

      <div
        className={`department-heading-icon ${color}`}
      >
        {icon}
      </div>

      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="transom-loading">
          <div className="loading-card">
            <div className="loading-logo">
              TRANSOM
            </div>
            LOADING...
          </div>
        </div>
      }
    >
      <FlightCapturePage />
    </Suspense>
  );
}
