"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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

type Capture = {
  id?: string;
  department: string;
  created_by?: string;
  [key: string]: any;
};

const departmentNames: Record<string, string> = {
  ramp: "RAMP DEPARTMENT",
  sorting: "SORTING DEPARTMENT",
  load_control_ops: "LOAD CONTROL / OPS",
  passenger_services: "PASSENGER SERVICES",
  cargo: "CARGO DEPARTMENT",
};

function calculateDuration(start: string, end: string) {
  if (!start || !end) return "";

  const startDate = new Date(`1970-01-01T${start}`);
  const endDate = new Date(`1970-01-01T${end}`);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "";
  }

  let difference =
    endDate.getTime() - startDate.getTime();

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
    <div className="capture-field">
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
    <div className="capture-field capture-textarea">
      <label>{label}</label>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

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
    <div className="service-card">
      <div className="service-card-title">
        {title}
      </div>

      <div className="service-time-row">
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

      <div className="service-duration">
        <span>SERVICE DURATION</span>

        <strong>
          {duration || "--:--"}
        </strong>
      </div>
    </div>
  );
}

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
      className={`capture-status-button ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

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

  const [captures, setCaptures] =
    useState<Capture[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /* ================================
     RAMP
  ================================= */

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

  /* ================================
     SORTING
  ================================= */

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

  /* ================================
     LOAD CONTROL / OPS
  ================================= */

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

  /* ================================
     PASSENGER SERVICES
  ================================= */

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

  /* ================================
     CARGO
  ================================= */

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

  /* ================================
     LOAD DATA
  ================================= */

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
        console.error(error);
        setMessage("Unable to load flight.");
      }

      if (flightData) {
        setFlight(flightData);
      }

      const { data: captureData } =
        await supabase
          .from("flight_service_captures")
          .select("*")
          .eq("flight_id", flightId)
          .order("created_at", {
            ascending: false,
          });

      if (captureData) {
        setCaptures(captureData);
      }

      setLoading(false);
    };

    loadData();
  }, [flightId, router]);

  /* ================================
     LOGOUT
  ================================= */

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  /* ================================
     SAVE
  ================================= */

  const handleSave = async () => {
    if (!profile || !flight) return;

    setSaving(true);
    setMessage("");

    try {
      const captureData: any = {
        flight_id: flight.id,
        department,
        created_by: profile.id,

        /* RAMP */
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
        ramp_opening_status:
          rampOpeningStatus,
        ramp_closing_status:
          rampClosingStatus,
        ramp_comments: rampComments,

        /* SORTING */
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

        /* LOAD CONTROL */
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

        /* PASSENGER */
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
        passenger_remarks:
          passengerRemarks,
        passenger_comments:
          passengerComments,

        /* CARGO */
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
        console.error(error);
        setMessage(
          `SAVE ERROR: ${error.message}`
        );
        return;
      }

      setMessage(
        "SERVICE CAPTURE SAVED SUCCESSFULLY"
      );

      const { data } =
        await supabase
          .from("flight_service_captures")
          .select("*")
          .eq("flight_id", flight.id)
          .order("created_at", {
            ascending: false,
          });

      if (data) {
        setCaptures(data);
      }
    } catch (error: any) {
      console.error(error);

      setMessage(
        error?.message ||
          "An unexpected error occurred."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================================
     FLIGHT STATUS
  ================================= */

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

  const handleOpenFlight = () =>
    updateFlightStatus("Open");

  const handleInProgress = () =>
    updateFlightStatus("In Progress");

  const handleCloseFlight = () => {
    const hasDelay =
      delayReason.trim() !== "" ||
      iataDelayCode.trim() !== "";

    updateFlightStatus(
      hasDelay
        ? "Closed - With Delay"
        : "Closed - No Delay"
    );
  };

  /* ================================
     STATUS CLASS
  ================================= */

  const getStatusClass = (
    status: string
  ) => {
    if (status === "In Progress")
      return "progress-status";

    if (status === "Closed - With Delay")
      return "delay-status";

    if (status === "Closed - No Delay")
      return "no-delay-status";

    return "open-status";
  };

  /* ================================
     LOADING
  ================================= */

  if (loading) {
    return (
      <main className="capture-page">
        <div className="capture-loading">
          LOADING FLIGHT...
        </div>
      </main>
    );
  }

  if (!flight) {
    return (
      <main className="capture-page">
        <div className="capture-panel">
          <h2>FLIGHT NOT FOUND</h2>

          <button
            className="capture-back-button"
            onClick={() =>
              router.push(
                `/flights?department=${department}`
              )
            }
          >
            ← BACK TO FLIGHTS
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="capture-page">

      {/* =================================
          HEADER
      ================================== */}

      <header className="capture-header">

        <div>
          <div className="capture-brand">
            TRANSOM
          </div>

          <div className="capture-brand-subtitle">
            FLIGHT SERVICE CAPTURE
          </div>
        </div>

        <div className="capture-header-right">

          <div className="capture-user">
            {profile?.full_name ||
              "Authorized User"}
          </div>

          <button
            className="capture-logout"
            onClick={handleLogout}
          >
            LOGOUT
          </button>

        </div>

      </header>


      {/* =================================
          HERO
      ================================== */}

      <section className="capture-hero">

        <div>

          <div className="capture-small-title">
            SERVICE CAPTURE
          </div>

          <h1>
            {flight.flight_number}
            {" - "}
            {departmentNames[
              department
            ] || department}
          </h1>

          <div className="capture-red-line" />

          <p>
            Enter the service capture
            details below.
          </p>

        </div>

      </section>


      {/* =================================
          MAIN PANEL
      ================================== */}

      <section className="capture-panel">

        {/* ===============================
            PANEL HEADER
        ================================ */}

        <div className="capture-section-heading">

          <div className="capture-heading-icon">
            ✈
          </div>

          <div>
            <h2>
              FLIGHT INFORMATION
            </h2>

            <p>
              Flight operational information
            </p>
          </div>

        </div>


        {/* ===============================
            FLIGHT INFO
        ================================ */}

        <div className="flight-information">

          <div className="flight-info-item">
            <span>FLIGHT NUMBER</span>
            <strong>
              {flight.flight_number}
            </strong>
          </div>

          <div className="flight-info-item">
            <span>AIRCRAFT</span>
            <strong>
              {flight.aircraft}
            </strong>
          </div>

          <div className="flight-info-item">
            <span>ROUTE</span>
            <strong>
              {flight.route}
            </strong>
          </div>

          <div className="flight-info-item">
            <span>FLIGHT DATE</span>
            <strong>
              {flight.flight_date}
            </strong>
          </div>

          <div className="flight-info-item">
            <span>STATUS</span>

            <strong
              className={`flight-status ${getStatusClass(
                flight.status
              )}`}
            >
              {flight.status}
            </strong>
          </div>

        </div>


        {/* ===============================
            STATUS CONTROL
        ================================ */}

        <div className="capture-status-panel">

          <div>
            <span>
              FLIGHT STATUS
            </span>

            <small>
              Update the operational status
            </small>
          </div>

          <div className="capture-status-actions">

            <StatusButton
              label="OPEN"
              active={
                flight.status === "Open"
              }
              onClick={handleOpenFlight}
            />

            <StatusButton
              label="IN PROGRESS"
              active={
                flight.status ===
                "In Progress"
              }
              onClick={handleInProgress}
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


        {/* =================================
            RAMP
        ================================== */}

        {department === "ramp" && (
          <>
            <div className="department-section-title">
              <div className="section-color red" />

              <div>
                <h2>
                  RAMP DEPARTMENT
                </h2>

                <p>
                  Ramp & Ground Services
                </p>
              </div>
            </div>


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


            <div className="capture-fields-grid">

              <Field
                label="COBUS"
                value={cobus}
                onChange={setCobus}
                placeholder="e.g. 1"
              />

              <Field
                label="TOWING"
                value={towing}
                onChange={setTowing}
                placeholder="e.g. 1"
              />

              <Field
                label="PUSHBACK"
                value={pushback}
                onChange={setPushback}
                placeholder="e.g. 1"
              />

              <Field
                label="LAVATORY SERVICE"
                value={lavatoryService}
                onChange={setLavatoryService}
                placeholder="e.g. 1"
              />

              <Field
                label="PORTABLE WATER"
                value={portableWater}
                onChange={setPortableWater}
                placeholder="e.g. 1"
              />

              <Field
                label="PAX STAIRS"
                value={paxStairs}
                onChange={setPaxStairs}
                placeholder="e.g. 2"
              />

              <Field
                label="PAX STEP"
                value={paxStep}
                onChange={setPaxStep}
                placeholder="e.g. 1"
              />

              <Field
                label="AMBULIFT"
                value={ambulift}
                onChange={setAmbulift}
                placeholder="e.g. 0"
              />

              <Field
                label="ASU"
                value={asu}
                onChange={setAsu}
                placeholder="e.g. 1"
              />

              <Field
                label="CHOCKS IN"
                value={chocksIn}
                onChange={setChocksIn}
                placeholder="e.g. 1"
              />

              <Field
                label="CHOCKS OUT"
                value={chocksOut}
                onChange={setChocksOut}
                placeholder="e.g. 1"
              />

              <Field
                label="SUPERVISOR NAME"
                value={supervisorName}
                onChange={setSupervisorName}
                placeholder="Enter supervisor name"
              />

              <Field
                label="RAMP OPENING STATUS"
                value={rampOpeningStatus}
                onChange={setRampOpeningStatus}
                placeholder="Enter status"
              />

              <Field
                label="RAMP CLOSING STATUS"
                value={rampClosingStatus}
                onChange={setRampClosingStatus}
                placeholder="Enter status"
              />

            </div>


            <TextAreaField
              label="RAMP COMMENTS"
              value={rampComments}
              onChange={setRampComments}
              placeholder="Enter any additional comments..."
            />
          </>
        )}


        {/* =================================
            SORTING
        ================================== */}

        {department === "sorting" && (
          <>
            <div className="department-section-title">
              <div className="section-color navy" />

              <div>
                <h2>
                  SORTING DEPARTMENT
                </h2>

                <p>
                  Baggage & ULD Sorting
                </p>
              </div>
            </div>


            <div className="capture-fields-grid">

              <Field
                label="ULD / BAG SORTING"
                value={uldBagSorting}
                onChange={setUldBagSorting}
                placeholder="Enter activity"
              />

              <Field
                label="NUMBER OF BAGS"
                value={numberOfBags}
                onChange={setNumberOfBags}
                placeholder="e.g. 120"
                type="number"
              />

              <Field
                label="ULD NUMBER"
                value={uldNumber}
                onChange={setUldNumber}
                placeholder="Enter ULD number"
              />

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


            <div className="capture-fields-grid">

              <Field
                label="BAG TRANSFER"
                value={bagTransfer}
                onChange={setBagTransfer}
                placeholder="Enter details"
              />

              <Field
                label="RUSH / PRIORITY"
                value={rushPriority}
                onChange={setRushPriority}
                placeholder="Enter details"
              />

              <Field
                label="MISROUTED BAGS"
                value={misroutedBags}
                onChange={setMisroutedBags}
                placeholder="e.g. 0"
              />

              <Field
                label="DAMAGED BAGS"
                value={damagedBags}
                onChange={setDamagedBags}
                placeholder="e.g. 0"
              />

              <Field
                label="MISSING BAGS"
                value={missingBags}
                onChange={setMissingBags}
                placeholder="e.g. 0"
              />

              <Field
                label="REMARKS"
                value={sortingRemarks}
                onChange={setSortingRemarks}
                placeholder="Enter remarks"
              />

            </div>


            <TextAreaField
              label="SORTING COMMENTS"
              value={sortingComments}
              onChange={setSortingComments}
              placeholder="Enter any additional comments..."
            />
          </>
        )}


        {/* =================================
            LOAD CONTROL / OPS
        ================================== */}

        {department ===
          "load_control_ops" && (
          <>
            <div className="department-section-title">
              <div className="section-color blue" />

              <div>
                <h2>
                  LOAD CONTROL / OPS
                </h2>

                <p>
                  Load Control & Operations
                </p>
              </div>
            </div>


            <div className="capture-fields-grid">

              <Field
                label="PAX"
                value={pax}
                onChange={setPax}
                placeholder="e.g. 78"
              />

              <Field
                label="BAGGAGES"
                value={baggages}
                onChange={setBaggages}
                placeholder="e.g. 60"
              />

              <Field
                label="CARGO"
                value={cargo}
                onChange={setCargo}
                placeholder="Enter cargo"
              />

              <Field
                label="PARKING BAY"
                value={parkingBay}
                onChange={setParkingBay}
                placeholder="Enter bay"
              />

              <Field
                label="LOAD / RAMP"
                value={loadRamp}
                onChange={setLoadRamp}
                placeholder="Enter details"
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
                onChange={setActualDeparture}
                type="time"
              />

              <Field
                label="ACTUAL ARRIVAL"
                value={actualArrival}
                onChange={setActualArrival}
                type="time"
              />

              <Field
                label="LOAD CONTROL / TRC NAME"
                value={loadControlTrcName}
                onChange={setLoadControlTrcName}
                placeholder="Enter name"
              />

              <Field
                label="SAL NAME"
                value={salName}
                onChange={setSalName}
                placeholder="Enter name"
              />

              <Field
                label="IATA DELAY CODE"
                value={iataDelayCode}
                onChange={setIataDelayCode}
                placeholder="e.g. 15"
              />

              <Field
                label="DELAY REASON"
                value={delayReason}
                onChange={setDelayReason}
                placeholder="Enter delay reason"
              />

            </div>


            <TextAreaField
              label="OPERATIONAL REMARKS"
              value={operationalRemarks}
              onChange={setOperationalRemarks}
              placeholder="Enter operational remarks..."
            />

            <TextAreaField
              label="COMMENTS"
              value={loadControlComments}
              onChange={setLoadControlComments}
              placeholder="Enter any additional comments..."
            />
          </>
        )}


        {/* =================================
            PASSENGER SERVICES
        ================================== */}

        {department ===
          "passenger_services" && (
          <>
            <div className="department-section-title">
              <div className="section-color red" />

              <div>
                <h2>
                  PASSENGER SERVICES
                </h2>

                <p>
                  Passenger & Gate Services
                </p>
              </div>
            </div>


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


            <div className="capture-fields-grid">

              <Field
                label="CHECK-IN AGENTS"
                value={checkInAgents}
                onChange={setCheckInAgents}
                placeholder="Number / names"
              />

              <Field
                label="BOARDING AGENTS"
                value={boardingAgents}
                onChange={setBoardingAgents}
                placeholder="Number / names"
              />

              <Field
                label="GATE NUMBER"
                value={gateNumber}
                onChange={setGateNumber}
                placeholder="e.g. 04"
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
                placeholder="e.g. 2"
              />

              <Field
                label="SPECIAL ASSISTANCE"
                value={specialAssistance}
                onChange={setSpecialAssistance}
                placeholder="Enter details"
              />

              <Field
                label="NO-SHOW"
                value={noShow}
                onChange={setNoShow}
                placeholder="e.g. 1"
              />

              <Field
                label="DENIED BOARDING"
                value={deniedBoarding}
                onChange={setDeniedBoarding}
                placeholder="e.g. 0"
              />

              <Field
                label="TRANSFER PAX"
                value={transferPax}
                onChange={setTransferPax}
                placeholder="e.g. 4"
              />

              <Field
                label="REMARKS"
                value={passengerRemarks}
                onChange={setPassengerRemarks}
                placeholder="Enter remarks"
              />

            </div>


            <TextAreaField
              label="PASSENGER SERVICES COMMENTS"
              value={passengerComments}
              onChange={setPassengerComments}
              placeholder="Enter any additional comments..."
            />
          </>
        )}


        {/* =================================
            CARGO
        ================================== */}

        {department === "cargo" && (
          <>
            <div className="department-section-title">
              <div className="section-color navy" />

              <div>
                <h2>
                  CARGO DEPARTMENT
                </h2>

                <p>
                  Cargo Operations
                </p>
              </div>
            </div>


            <div className="service-grid">

              <ServiceTime
                title="CARGO ACCEPTANCE"
                start={cargoAcceptanceStart}
                end={cargoAcceptanceEnd}
                setStart={setCargoAcceptanceStart}
                setEnd={setCargoAcceptanceEnd}
              />

              <ServiceTime
                title="LOADING"
                start={loadingStart}
                end={loadingEnd}
                setStart={setLoadingStart}
                setEnd={setLoadingEnd}
              />

            </div>


            <div className="capture-fields-grid">

              <Field
                label="CARGO TYPE"
                value={cargoType}
                onChange={setCargoType}
                placeholder="Enter cargo type"
              />

              <Field
                label="WEIGHT"
                value={cargoWeight}
                onChange={setCargoWeight}
                placeholder="e.g. 1250 KG"
              />

              <Field
                label="PIECES"
                value={cargoPieces}
                onChange={setCargoPieces}
                placeholder="e.g. 12"
              />

              <Field
                label="AWB"
                value={awb}
                onChange={setAwb}
                placeholder="Enter AWB"
              />

              <Field
                label="ULD NUMBER"
                value={cargoUldNumber}
                onChange={setCargoUldNumber}
                placeholder="Enter ULD"
              />

              <Field
                label="DANGEROUS GOODS"
                value={dangerousGoods}
                onChange={setDangerousGoods}
                placeholder="Yes / No"
              />

              <Field
                label="SPECIAL CARGO"
                value={specialCargo}
                onChange={setSpecialCargo}
                placeholder="Enter details"
              />

              <Field
                label="WAREHOUSE LOCATION"
                value={warehouseLocation}
                onChange={setWarehouseLocation}
                placeholder="Enter location"
              />

              <Field
                label="DO NAME"
                value={doName}
                onChange={setDoName}
                placeholder="Enter DO name"
              />

              <Field
                label="AGENT NAME"
                value={agentName}
                onChange={setAgentName}
                placeholder="Enter agent name"
              />

              <Field
                label="REMARKS"
                value={cargoRemarks}
                onChange={setCargoRemarks}
                placeholder="Enter remarks"
              />

            </div>


            <TextAreaField
              label="CARGO COMMENTS"
              value={cargoComments}
              onChange={setCargoComments}
              placeholder="Enter any additional comments..."
            />
          </>
        )}


        {/* =================================
            MESSAGE
        ================================== */}

        {message && (
          <div
            className={`capture-message ${
              message.includes("SUCCESSFULLY")
                ? "success"
                : "error"
            }`}
          >
            {message}
          </div>
        )}


        {/* =================================
            SAVE
        ================================== */}

        <div className="capture-save-area">

          <button
            className="save-capture-button"
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


        {/* =================================
            FOOTER
        ================================== */}

        <div className="capture-footer">

          <button
            className="capture-back-button"
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
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="capture-page">
          <div className="capture-loading">
            LOADING...
          </div>
        </main>
      }
    >
      <FlightCapturePage />
    </Suspense>
  );
}
