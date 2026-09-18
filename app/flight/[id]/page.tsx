"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Flight = {
  id: string;
  flight_number: string;
  aircraft: string | null;
  route: string | null;
  flight_date: string | null;
  status: string | null;
};

type Capture = {
  id: string;
  department: string;
  created_at: string;
  created_by: string | null;
  [key: string]: any;
};

const departmentNames: Record<string, string> = {
  ramp: "RAMP DEPARTMENT",
  sorting: "SORTING DEPARTMENT",
  load_control_ops: "LOAD CONTROL / OPS",
  passenger_services: "PASSENGER SERVICES",
  cargo: "CARGO DEPARTMENT",
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="form-group">
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
    <div className="form-group">
      <label>{label}</label>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
      />
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
      className={`status-option ${active ? "active-status" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function ServiceTime({
  title,
  start,
  end,
  duration,
  setStart,
  setEnd,
}: {
  title: string;
  start: string;
  end: string;
  duration: string;
  setStart: (value: string) => void;
  setEnd: (value: string) => void;
}) {
  return (
    <div className="service-time-card">
      <h4>{title}</h4>

      <div className="form-grid">
        <Field
          label="START TIME"
          type="time"
          value={start}
          onChange={setStart}
        />

        <Field
          label="END TIME"
          type="time"
          value={end}
          onChange={setEnd}
        />

        <Field
          label="DURATION"
          value={duration}
          onChange={() => {}}
        />
      </div>
    </div>
  );
}

function calculateDuration(start: string, end: string) {
  if (!start || !end) return "";

  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  let startTotal = startHour * 60 + startMinute;
  let endTotal = endHour * 60 + endMinute;

  if (endTotal < startTotal) {
    endTotal += 24 * 60;
  }

  const difference = endTotal - startTotal;

  const hours = Math.floor(difference / 60);
  const minutes = difference % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

function FlightPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const flightId = params.id as string;
  const department = searchParams.get("department") || "";

  const [flight, setFlight] = useState<Flight | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  const [captures, setCaptures] = useState<Capture[]>([]);

  // =========================================================
  // BASIC / LOAD CONTROL / OPS
  // =========================================================

  const [pax, setPax] = useState("");
  const [baggages, setBaggages] = useState("");
  const [cargo, setCargo] = useState("");
  const [parkingBay, setParkingBay] = useState("");
  const [loadRamp, setLoadRamp] = useState("");

  const [stdEtd, setStdEtd] = useState("");
  const [staEta, setStaEta] = useState("");
  const [actualDeparture, setActualDeparture] = useState("");
  const [actualArrival, setActualArrival] = useState("");

  const [loadControlTrcName, setLoadControlTrcName] = useState("");
  const [salName, setSalName] = useState("");
  const [delayReason, setDelayReason] = useState("");
  const [iataDelayCode, setIataDelayCode] = useState("");
  const [operationalRemarks, setOperationalRemarks] = useState("");
  const [comments, setComments] = useState("");

  // =========================================================
  // RAMP
  // =========================================================

  const [gpuStartTime, setGpuStartTime] = useState("");
  const [gpuEndTime, setGpuEndTime] = useState("");

  const [acuStartTime, setAcuStartTime] = useState("");
  const [acuEndTime, setAcuEndTime] = useState("");

  const [cleaningStartTime, setCleaningStartTime] = useState("");
  const [cleaningEndTime, setCleaningEndTime] = useState("");

  const [conveyorStartTime, setConveyorStartTime] = useState("");
  const [conveyorEndTime, setConveyorEndTime] = useState("");

  const [vomitingStartTime, setVomitingStartTime] = useState("");
  const [vomitingEndTime, setVomitingEndTime] = useState("");

  const [cobusTripNumber, setCobusTripNumber] = useState("");
  const [towingStatus, setTowingStatus] = useState("");
  const [asuStatus, setAsuStatus] = useState("");

  const [paxStairs, setPaxStairs] = useState("");
  const [paxStep, setPaxStep] = useState("");
  const [pushback, setPushback] = useState("");
  const [lavatoryService, setLavatoryService] = useState("");
  const [portableWater, setPortableWater] = useState("");
  const [ambulift, setAmbulift] = useState("");

  const [supervisorName, setSupervisorName] = useState("");
  const [rampOpeningStatus, setRampOpeningStatus] = useState("");
  const [rampClosingStatus, setRampClosingStatus] = useState("");
  const [rampComments, setRampComments] = useState("");

  // =========================================================
  // SORTING
  // =========================================================

  const [uldBagSorting, setUldBagSorting] = useState("");
  const [numberOfBags, setNumberOfBags] = useState("");
  const [uldNumber, setUldNumber] = useState("");

  const [sortingStartTime, setSortingStartTime] = useState("");
  const [sortingEndTime, setSortingEndTime] = useState("");

  const [bagTransfer, setBagTransfer] = useState("");
  const [rushPriorityBags, setRushPriorityBags] = useState("");
  const [misroutedBags, setMisroutedBags] = useState("");
  const [damagedBags, setDamagedBags] = useState("");
  const [missingBags, setMissingBags] = useState("");

  const [sortingRemarks, setSortingRemarks] = useState("");
  const [sortingComments, setSortingComments] = useState("");

  // =========================================================
  // PASSENGER SERVICES
  // =========================================================

  const [checkInStartTime, setCheckInStartTime] = useState("");
  const [checkInEndTime, setCheckInEndTime] = useState("");
  const [checkInAgents, setCheckInAgents] = useState("");

  const [boardingStartTime, setBoardingStartTime] = useState("");
  const [boardingEndTime, setBoardingEndTime] = useState("");
  const [boardingAgents, setBoardingAgents] = useState("");

  const [gateNumber, setGateNumber] = useState("");
  const [gateOpenTime, setGateOpenTime] = useState("");
  const [gateCloseTime, setGateCloseTime] = useState("");

  const [wheelchairAssistance, setWheelchairAssistance] = useState("");
  const [specialAssistance, setSpecialAssistance] = useState("");
  const [noShowPax, setNoShowPax] = useState("");
  const [deniedBoardingPax, setDeniedBoardingPax] = useState("");
  const [transferPax, setTransferPax] = useState("");

  const [passengerServicesRemarks, setPassengerServicesRemarks] =
    useState("");
  const [passengerServicesComments, setPassengerServicesComments] =
    useState("");

  // =========================================================
  // CARGO
  // =========================================================

  const [cargoAcceptanceStartTime, setCargoAcceptanceStartTime] = useState("");
  const [cargoAcceptanceEndTime, setCargoAcceptanceEndTime] = useState("");

  const [cargoWeight, setCargoWeight] = useState("");
  const [cargoPieces, setCargoPieces] = useState("");

  const [awbNumber, setAwbNumber] = useState("");
  const [cargoUldNumber, setCargoUldNumber] = useState("");

  const [dangerousGoods, setDangerousGoods] = useState("");
  const [specialCargo, setSpecialCargo] = useState("");

  const [warehouseLocation, setWarehouseLocation] = useState("");

  const [cargoLoadingStartTime, setCargoLoadingStartTime] = useState("");
  const [cargoLoadingEndTime, setCargoLoadingEndTime] = useState("");

  const [cargoRemarks, setCargoRemarks] = useState("");
  const [cargoComments, setCargoComments] = useState("");

  // =========================================================
  // CALCULATED DURATIONS
  // =========================================================

  const gpuDuration = calculateDuration(gpuStartTime, gpuEndTime);
  const acuDuration = calculateDuration(acuStartTime, acuEndTime);
  const cleaningDuration = calculateDuration(
    cleaningStartTime,
    cleaningEndTime
  );
  const conveyorDuration = calculateDuration(
    conveyorStartTime,
    conveyorEndTime
  );
  const vomitingDuration = calculateDuration(
    vomitingStartTime,
    vomitingEndTime
  );

  // =========================================================
  // USER / FLIGHT LOAD
  // =========================================================

  useEffect(() => {
    loadPage();
  }, [flightId]);

  async function loadPage() {
    try {
      setLoading(true);

      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !currentUser) {
        router.replace("/");
        return;
      }

      setUser(currentUser);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name, role, department")
        .eq("id", currentUser.id)
        .maybeSingle();

      setProfile(profileData);

      const { data: flightData, error: flightError } = await supabase
        .from("flights")
        .select(
          "id, flight_number, aircraft, route, flight_date, status"
        )
        .eq("id", flightId)
        .single();

      if (flightError || !flightData) {
        console.error(flightError);

        if (profileData?.role === "management") {
          router.replace("/management");
        } else {
          router.replace("/departments");
        }

        return;
      }

      setFlight(flightData);

      if (profileData?.role === "management") {
        const { data: captureData, error: captureError } = await supabase
          .from("flight_service_captures")
          .select("*")
          .eq("flight_id", flightId)
          .order("created_at", { ascending: false });

        if (!captureError && captureData) {
          setCaptures(captureData);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // FLIGHT OPEN / CLOSE
  // =========================================================

  async function updateFlightStatus(newStatus: string) {
    if (!flight) return;

    try {
      setChangingStatus(true);

      const { error } = await supabase
        .from("flights")
        .update({
          status: newStatus,
        })
        .eq("id", flight.id);

      if (error) {
        console.error(error);
        alert(`Failed to update flight status: ${error.message}`);
        return;
      }

      setFlight({
        ...flight,
        status: newStatus,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to update flight status.");
    } finally {
      setChangingStatus(false);
    }
  }

  async function handleOpenFlight() {
    await updateFlightStatus("Open");
  }

  async function handleCloseFlight() {
    const hasDelay =
      delayReason.trim() !== "" ||
      iataDelayCode.trim() !== "";

    const newStatus = hasDelay
      ? "Closed - With Delay"
      : "Closed - No Delay";

    await updateFlightStatus(newStatus);
  }

  async function handleInProgress() {
    await updateFlightStatus("In Progress");
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  // =========================================================
  // SAVE SERVICE CAPTURE
  // =========================================================

  async function handleSave() {
    if (!user || !flight) {
      alert("User or flight information is missing.");
      return;
    }

    if (!department) {
      alert("Department is missing.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        flight_id: flight.id,
        department,

        // -----------------------------------------------------
        // BASIC / LOAD CONTROL
        // -----------------------------------------------------

        pax: pax ? Number(pax) : null,
        baggages: baggages ? Number(baggages) : null,
        cargo: cargo ? Number(cargo) : null,

        parking_bay: parkingBay || null,
        load_ramp: loadRamp || null,

        std_etd: stdEtd || null,
        sta_eta: staEta || null,
        actual_departure: actualDeparture || null,
        actual_arrival: actualArrival || null,

        load_control_trc_name: loadControlTrcName || null,
        sal_name: salName || null,

        delay_reason: delayReason || null,
        iata_delay_code: iataDelayCode || null,

        operational_remarks: operationalRemarks || null,
        comments: comments || null,

        // -----------------------------------------------------
        // RAMP
        // -----------------------------------------------------

        gpu_start_time: gpuStartTime || null,
        gpu_end_time: gpuEndTime || null,
        gpu_duration: gpuDuration || null,

        acu_start_time: acuStartTime || null,
        acu_end_time: acuEndTime || null,
        acu_duration: acuDuration || null,

        cleaning_start_time: cleaningStartTime || null,
        cleaning_end_time: cleaningEndTime || null,
        cleaning_duration: cleaningDuration || null,

        conveyor_start_time: conveyorStartTime || null,
        conveyor_end_time: conveyorEndTime || null,
        conveyor_duration: conveyorDuration || null,

        vomiting_start_time: vomitingStartTime || null,
        vomiting_end_time: vomitingEndTime || null,
        vomiting_duration: vomitingDuration || null,

        cobus_trip_number: cobusTripNumber || null,
        towing_status: towingStatus || null,
        asu_status: asuStatus || null,

        pax_stairs: paxStairs || null,
        pax_step: paxStep || null,
        pushback: pushback || null,
        lavatory_service: lavatoryService || null,
        portable_water: portableWater || null,
        ambulift: ambulift || null,

        supervisor_name: supervisorName || null,

        ramp_opening_status: rampOpeningStatus || null,
        ramp_closing_status: rampClosingStatus || null,

        ramp_comments: rampComments || null,

        // -----------------------------------------------------
        // SORTING
        // -----------------------------------------------------

        uld_bag_sorting: uldBagSorting || null,
        number_of_bags: numberOfBags
          ? Number(numberOfBags)
          : null,

        uld_number: uldNumber || null,

        sorting_start_time: sortingStartTime || null,
        sorting_end_time: sortingEndTime || null,

        bag_transfer: bagTransfer || null,
        rush_priority_bags: rushPriorityBags || null,
        misrouted_bags: misroutedBags || null,
        damaged_bags: damagedBags || null,
        missing_bags: missingBags || null,

        sorting_remarks: sortingRemarks || null,
        sorting_comments: sortingComments || null,

        // -----------------------------------------------------
        // PASSENGER SERVICES
        // -----------------------------------------------------

        check_in_start_time: checkInStartTime || null,
        check_in_end_time: checkInEndTime || null,
        check_in_agents: checkInAgents || null,

        boarding_start_time: boardingStartTime || null,
        boarding_end_time: boardingEndTime || null,
        boarding_agents: boardingAgents || null,

        gate_number: gateNumber || null,
        gate_open_time: gateOpenTime || null,
        gate_close_time: gateCloseTime || null,

        wheelchair_assistance: wheelchairAssistance || null,
        special_assistance: specialAssistance || null,

        no_show_pax: noShowPax ? Number(noShowPax) : null,
        denied_boarding_pax: deniedBoardingPax
          ? Number(deniedBoardingPax)
          : null,
        transfer_pax: transferPax
          ? Number(transferPax)
          : null,

        passenger_services_remarks:
          passengerServicesRemarks || null,

        passenger_services_comments:
          passengerServicesComments || null,

        // -----------------------------------------------------
        // CARGO
        // -----------------------------------------------------

        cargo_acceptance_start_time:
          cargoAcceptanceStartTime || null,

        cargo_acceptance_end_time:
          cargoAcceptanceEndTime || null,

        cargo_weight: cargoWeight
          ? Number(cargoWeight)
          : null,

        cargo_pieces: cargoPieces
          ? Number(cargoPieces)
          : null,

        awb_number: awbNumber || null,
        cargo_uld_number: cargoUldNumber || null,

        dangerous_goods: dangerousGoods || null,
        special_cargo: specialCargo || null,

        warehouse_location: warehouseLocation || null,

        cargo_loading_start_time:
          cargoLoadingStartTime || null,

        cargo_loading_end_time:
          cargoLoadingEndTime || null,

        cargo_remarks: cargoRemarks || null,
        cargo_comments: cargoComments || null,

        created_by: user.id,
      };

      const { error } = await supabase
        .from("flight_service_captures")
        .insert(payload);

      if (error) {
        console.error(error);
        alert(`Failed to save capture: ${error.message}`);
        return;
      }

      alert("Service capture saved successfully.");

      router.push(
        `/flights?department=${encodeURIComponent(department)}`
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-content">
          <h2>Loading flight...</h2>
        </div>
      </main>
    );
  }

  if (!flight) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-content">
          <h2>Flight not found.</h2>
        </div>
      </main>
    );
  }

  const isManagement = profile?.role === "management";

  // =========================================================
  // STATUS CLASS
  // =========================================================

  function getStatusClass(status: string | null) {
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
        return "flight-status open-status";
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="dashboard-page">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="dashboard-header">
        <div>
          <div className="dashboard-logo">TRANSOM</div>
          <div className="dashboard-subtitle">
            FLIGHT SERVICE CAPTURE
          </div>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          LOGOUT
        </button>
      </header>

      <div className="dashboard-content">
        {/* ===================================================
            FLIGHT INFORMATION
        ==================================================== */}

        <section className="welcome-section">
          <h1>
            FLIGHT {flight.flight_number}
          </h1>

          <p>
            {departmentNames[department] ||
              department.toUpperCase()}
          </p>
        </section>

        <section className="flights-section">
          <div className="flight-info-card">
            <div className="flight-info-grid">
              <div>
                <span>FLIGHT</span>
                <strong>{flight.flight_number}</strong>
              </div>

              <div>
                <span>AIRCRAFT</span>
                <strong>{flight.aircraft || "-"}</strong>
              </div>

              <div>
                <span>ROUTE</span>
                <strong>{flight.route || "-"}</strong>
              </div>

              <div>
                <span>DATE</span>
                <strong>
                  {flight.flight_date
                    ? new Date(
                        flight.flight_date
                      ).toLocaleDateString()
                    : "-"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            OPEN / CLOSE
        ==================================================== */}

        <section className="flights-section">
          <div className="flight-status-panel">
            <div className="status-panel-header">
              <div>
                <h2>FLIGHT STATUS</h2>
                <p>
                  Control the operational status of this
                  flight.
                </p>
              </div>

              <span className={getStatusClass(flight.status)}>
                {flight.status || "Open"}
              </span>
            </div>

            <div className="status-actions">
              <button
                type="button"
                className="open-flight-button"
                onClick={handleOpenFlight}
                disabled={changingStatus}
              >
                OPEN
              </button>

              <button
                type="button"
                className="progress-flight-button"
                onClick={handleInProgress}
                disabled={changingStatus}
              >
                IN PROGRESS
              </button>

              <button
                type="button"
                className="close-flight-button"
                onClick={handleCloseFlight}
                disabled={changingStatus}
              >
                CLOSE
              </button>
            </div>

            <p className="status-help">
              CLOSE automatically uses{" "}
              <strong>Closed - With Delay</strong> when a
              Delay Reason or IATA Delay Code has been entered.
              Otherwise it uses{" "}
              <strong>Closed - No Delay</strong>.
            </p>
          </div>
        </section>

        {/* ===================================================
            MANAGEMENT VIEW
        ==================================================== */}

        {isManagement && (
          <section className="flights-section">
            <div className="section-heading">
              <h2>SERVICE CAPTURES</h2>
              <p>
                Management view of all service captures for
                this flight.
              </p>
            </div>

            {captures.length === 0 ? (
              <div className="empty-state">
                No service captures have been submitted for
                this flight.
              </div>
            ) : (
              <div className="capture-list">
                {captures.map((capture) => (
                  <div
                    className="capture-card"
                    key={capture.id}
                  >
                    <div>
                      <strong>
                        {departmentNames[
                          capture.department
                        ] ||
                          capture.department.toUpperCase()}
                      </strong>

                      <span>
                        {capture.created_at
                          ? new Date(
                              capture.created_at
                            ).toLocaleString()
                          : ""}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="select-flight-button"
                      onClick={() =>
                        router.push(
                          `/capture/${capture.id}`
                        )
                      }
                    >
                      VIEW CAPTURE
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ===================================================
            LOAD CONTROL / OPS
        ==================================================== */}

        {!isManagement &&
          department === "load_control_ops" && (
            <section className="form-section">
              <div className="section-heading">
                <h2>LOAD CONTROL / OPS</h2>
                <p>Flight operational information.</p>
              </div>

              <div className="form-grid">
                <Field
                  label="PAX"
                  type="number"
                  value={pax}
                  onChange={setPax}
                />

                <Field
                  label="BAGGAGES"
                  type="number"
                  value={baggages}
                  onChange={setBaggages}
                />

                <Field
                  label="CARGO"
                  type="number"
                  value={cargo}
                  onChange={setCargo}
                />

                <Field
                  label="PARKING BAY"
                  value={parkingBay}
                  onChange={setParkingBay}
                />

                <Field
                  label="LOAD RAMP"
                  value={loadRamp}
                  onChange={setLoadRamp}
                />

                <Field
                  label="STD / ETD"
                  type="datetime-local"
                  value={stdEtd}
                  onChange={setStdEtd}
                />

                <Field
                  label="STA / ETA"
                  type="datetime-local"
                  value={staEta}
                  onChange={setStaEta}
                />

                <Field
                  label="ACTUAL DEPARTURE"
                  type="datetime-local"
                  value={actualDeparture}
                  onChange={setActualDeparture}
                />

                <Field
                  label="ACTUAL ARRIVAL"
                  type="datetime-local"
                  value={actualArrival}
                  onChange={setActualArrival}
                />

                <Field
                  label="LOADCONTROL / TRC NAME"
                  value={loadControlTrcName}
                  onChange={setLoadControlTrcName}
                />

                <Field
                  label="SAL NAME"
                  value={salName}
                  onChange={setSalName}
                />

                <Field
                  label="IATA DELAY CODE"
                  value={iataDelayCode}
                  onChange={setIataDelayCode}
                  placeholder="Example: 93"
                />
              </div>

              <TextAreaField
                label="DELAY REASON"
                value={delayReason}
                onChange={setDelayReason}
              />

              <TextAreaField
                label="OPERATIONAL REMARKS"
                value={operationalRemarks}
                onChange={setOperationalRemarks}
              />

              <TextAreaField
                label="COMMENTS"
                value={comments}
                onChange={setComments}
              />

              <button
                type="button"
                className="save-button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "SAVING..."
                  : "SAVE LOAD CONTROL / OPS CAPTURE"}
              </button>
            </section>
          )}

        {/* ===================================================
            RAMP
        ==================================================== */}

        {!isManagement && department === "ramp" && (
          <section className="form-section">
            <div className="section-heading">
              <h2>RAMP DEPARTMENT</h2>
              <p>Ground handling service capture.</p>
            </div>

            {/* RAMP OPEN / CLOSE */}
            <div className="mini-status-section">
              <h3>RAMP OPERATION STATUS</h3>

              <div className="status-button-row">
                <StatusButton
                  label="OPEN"
                  active={rampOpeningStatus === "Open"}
                  onClick={() =>
                    setRampOpeningStatus("Open")
                  }
                />

                <StatusButton
                  label="CLOSED"
                  active={
                    rampClosingStatus === "Closed"
                  }
                  onClick={() =>
                    setRampClosingStatus("Closed")
                  }
                />
              </div>
            </div>

            {/* GPU */}
            <ServiceTime
              title="GPU"
              start={gpuStartTime}
              end={gpuEndTime}
              duration={gpuDuration}
              setStart={setGpuStartTime}
              setEnd={setGpuEndTime}
            />

            {/* ACU */}
            <ServiceTime
              title="ACU"
              start={acuStartTime}
              end={acuEndTime}
              duration={acuDuration}
              setStart={setAcuStartTime}
              setEnd={setAcuEndTime}
            />

            {/* CLEANING */}
            <ServiceTime
              title="CLEANING"
              start={cleaningStartTime}
              end={cleaningEndTime}
              duration={cleaningDuration}
              setStart={setCleaningStartTime}
              setEnd={setCleaningEndTime}
            />

            {/* CONVEYOR */}
            <ServiceTime
              title="CONVEYOR"
              start={conveyorStartTime}
              end={conveyorEndTime}
              duration={conveyorDuration}
              setStart={setConveyorStartTime}
              setEnd={setConveyorEndTime}
            />

            {/* VOMITING */}
            <ServiceTime
              title="VOMITING"
              start={vomitingStartTime}
              end={vomitingEndTime}
              duration={vomitingDuration}
              setStart={setVomitingStartTime}
              setEnd={setVomitingEndTime}
            />

            <div className="form-grid">
              <Field
                label="COBUS TRIP NUMBER"
                value={cobusTripNumber}
                onChange={setCobusTripNumber}
              />

              <Field
                label="GROUND EQUIPMENT TOWING"
                value={towingStatus}
                onChange={setTowingStatus}
                placeholder="Status / Details"
              />

              <Field
                label="ASU"
                value={asuStatus}
                onChange={setAsuStatus}
                placeholder="Status / Details"
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
                label="AMBULIFT"
                value={ambulift}
                onChange={setAmbulift}
              />

              <Field
                label="SUPERVISOR NAME"
                value={supervisorName}
                onChange={setSupervisorName}
              />
            </div>

            <TextAreaField
              label="RAMP COMMENTS"
              value={rampComments}
              onChange={setRampComments}
            />

            <button
              type="button"
              className="save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "SAVING..." : "SAVE RAMP CAPTURE"}
            </button>
          </section>
        )}

        {/* ===================================================
            SORTING
        ==================================================== */}

        {!isManagement && department === "sorting" && (
          <section className="form-section">
            <div className="section-heading">
              <h2>SORTING DEPARTMENT</h2>
              <p>Baggage sorting and transfer capture.</p>
            </div>

            <div className="form-grid">
              <Field
                label="ULD BAG SORTING"
                value={uldBagSorting}
                onChange={setUldBagSorting}
                placeholder="Pallet / Container"
              />

              <Field
                label="NUMBER OF BAGS"
                type="number"
                value={numberOfBags}
                onChange={setNumberOfBags}
              />

              <Field
                label="ULD NUMBER"
                value={uldNumber}
                onChange={setUldNumber}
              />

              <Field
                label="SORTING START TIME"
                type="time"
                value={sortingStartTime}
                onChange={setSortingStartTime}
              />

              <Field
                label="SORTING END TIME"
                type="time"
                value={sortingEndTime}
                onChange={setSortingEndTime}
              />

              <Field
                label="BAG TRANSFER"
                value={bagTransfer}
                onChange={setBagTransfer}
              />

              <Field
                label="RUSH / PRIORITY BAGS"
                value={rushPriorityBags}
                onChange={setRushPriorityBags}
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
            </div>

            <TextAreaField
              label="SORTING REMARKS"
              value={sortingRemarks}
              onChange={setSortingRemarks}
            />

            <TextAreaField
              label="COMMENTS"
              value={sortingComments}
              onChange={setSortingComments}
            />

            <button
              type="button"
              className="save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "SAVING..."
                : "SAVE SORTING CAPTURE"}
            </button>
          </section>
        )}

        {/* ===================================================
            PASSENGER SERVICES
        ==================================================== */}

        {!isManagement &&
          department === "passenger_services" && (
            <section className="form-section">
              <div className="section-heading">
                <h2>PASSENGER SERVICES</h2>
                <p>
                  Check-in, boarding and passenger
                  assistance capture.
                </p>
              </div>

              <div className="service-time-card">
                <h4>CHECK-IN</h4>

                <div className="form-grid">
                  <Field
                    label="CHECK-IN START"
                    type="time"
                    value={checkInStartTime}
                    onChange={setCheckInStartTime}
                  />

                  <Field
                    label="CHECK-IN END"
                    type="time"
                    value={checkInEndTime}
                    onChange={setCheckInEndTime}
                  />

                  <Field
                    label="CHECK-IN AGENTS"
                    value={checkInAgents}
                    onChange={setCheckInAgents}
                  />
                </div>
              </div>

              <div className="service-time-card">
                <h4>BOARDING</h4>

                <div className="form-grid">
                  <Field
                    label="BOARDING START"
                    type="time"
                    value={boardingStartTime}
                    onChange={setBoardingStartTime}
                  />

                  <Field
                    label="BOARDING END"
                    type="time"
                    value={boardingEndTime}
                    onChange={setBoardingEndTime}
                  />

                  <Field
                    label="BOARDING AGENTS"
                    value={boardingAgents}
                    onChange={setBoardingAgents}
                  />
                </div>
              </div>

              <div className="service-time-card">
                <h4>GATE</h4>

                <div className="form-grid">
                  <Field
                    label="GATE NUMBER"
                    value={gateNumber}
                    onChange={setGateNumber}
                  />

                  <Field
                    label="GATE OPEN TIME"
                    type="time"
                    value={gateOpenTime}
                    onChange={setGateOpenTime}
                  />

                  <Field
                    label="GATE CLOSE TIME"
                    type="time"
                    value={gateCloseTime}
                    onChange={setGateCloseTime}
                  />
                </div>
              </div>

              <div className="form-grid">
                <Field
                  label="WHEELCHAIR ASSISTANCE"
                  value={wheelchairAssistance}
                  onChange={setWheelchairAssistance}
                />

                <Field
                  label="SPECIAL ASSISTANCE"
                  value={specialAssistance}
                  onChange={setSpecialAssistance}
                />

                <Field
                  label="NO-SHOW PAX"
                  type="number"
                  value={noShowPax}
                  onChange={setNoShowPax}
                />

                <Field
                  label="DENIED BOARDING PAX"
                  type="number"
                  value={deniedBoardingPax}
                  onChange={setDeniedBoardingPax}
                />

                <Field
                  label="TRANSFER PAX"
                  type="number"
                  value={transferPax}
                  onChange={setTransferPax}
                />
              </div>

              <TextAreaField
                label="REMARKS"
                value={passengerServicesRemarks}
                onChange={setPassengerServicesRemarks}
              />

              <TextAreaField
                label="COMMENTS"
                value={passengerServicesComments}
                onChange={
                  setPassengerServicesComments
                }
              />

              <button
                type="button"
                className="save-button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "SAVING..."
                  : "SAVE PASSENGER SERVICES CAPTURE"}
              </button>
            </section>
          )}

        {/* ===================================================
            CARGO
        ==================================================== */}

        {!isManagement && department === "cargo" && (
          <section className="form-section">
            <div className="section-heading">
              <h2>CARGO DEPARTMENT</h2>
              <p>Cargo acceptance and loading capture.</p>
            </div>

            <div className="service-time-card">
              <h4>CARGO ACCEPTANCE</h4>

              <div className="form-grid">
                <Field
                  label="ACCEPTANCE START"
                  type="time"
                  value={cargoAcceptanceStartTime}
                  onChange={setCargoAcceptanceStartTime}
                />

                <Field
                  label="ACCEPTANCE END"
                  type="time"
                  value={cargoAcceptanceEndTime}
                  onChange={setCargoAcceptanceEndTime}
                />
              </div>
            </div>

            <div className="form-grid">
              <Field
                label="CARGO TYPE"
                value={specialCargo}
                onChange={setSpecialCargo}
              />

              <Field
                label="CARGO WEIGHT"
                type="number"
                value={cargoWeight}
                onChange={setCargoWeight}
                placeholder="kg"
              />

              <Field
                label="CARGO PIECES"
                type="number"
                value={cargoPieces}
                onChange={setCargoPieces}
              />

              <Field
                label="AWB NUMBER"
                value={awbNumber}
                onChange={setAwbNumber}
              />

              <Field
                label="ULD NUMBER"
                value={cargoUldNumber}
                onChange={setCargoUldNumber}
              />

              <Field
                label="DANGEROUS GOODS"
                value={dangerousGoods}
                onChange={setDangerousGoods}
              />

              <Field
                label="SPECIAL CARGO"
                value={specialCargo}
                onChange={setSpecialCargo}
              />

              <Field
                label="WAREHOUSE LOCATION"
                value={warehouseLocation}
                onChange={setWarehouseLocation}
              />
            </div>

            <div className="service-time-card">
              <h4>CARGO LOADING</h4>

              <div className="form-grid">
                <Field
                  label="LOADING START"
                  type="time"
                  value={cargoLoadingStartTime}
                  onChange={setCargoLoadingStartTime}
                />

                <Field
                  label="LOADING END"
                  type="time"
                  value={cargoLoadingEndTime}
                  onChange={setCargoLoadingEndTime}
                />
              </div>
            </div>

            <Field
              label="DO NAME"
              value={cargoRemarks}
              onChange={setCargoRemarks}
            />

            <Field
              label="AGENT NAME"
              value={cargoComments}
              onChange={setCargoComments}
            />

            <TextAreaField
              label="CARGO REMARKS"
              value={cargoRemarks}
              onChange={setCargoRemarks}
            />

            <TextAreaField
              label="COMMENTS"
              value={cargoComments}
              onChange={setCargoComments}
            />

            <button
              type="button"
              className="save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "SAVING..." : "SAVE CARGO CAPTURE"}
            </button>
          </section>
        )}

        {/* ===================================================
            NAVIGATION
        ==================================================== */}

        <div className="bottom-actions">
          <button
            type="button"
            className="back-button"
            onClick={() =>
              router.push(
                `/flights?department=${encodeURIComponent(
                  department
                )}`
              )
            }
          >
            ← BACK TO FLIGHTS
          </button>
        </div>
      </div>

      <footer className="dashboard-footer">
        TRANSOM — FLIGHT SERVICE CAPTURE
      </footer>
    </main>
  );
}

export default function FlightPage() {
  return (
    <Suspense
      fallback={
        <main className="dashboard-page">
          <div className="dashboard-content">
            <h2>Loading...</h2>
          </div>
        </main>
      }
    >
      <FlightPageContent />
    </Suspense>
  );
}
