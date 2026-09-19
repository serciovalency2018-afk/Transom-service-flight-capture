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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: 700,
          color: "#071d41",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "13px",
          borderRadius: "8px",
          border: "1px solid #cfd6df",
          fontSize: "15px",
          background: "#ffffff",
        }}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: 700,
          color: "#071d41",
        }}
      >
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "13px",
          borderRadius: "8px",
          border: "1px solid #cfd6df",
          fontSize: "15px",
          resize: "vertical",
        }}
      />
    </div>
  );
}

function StatusButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "13px 18px",
        borderRadius: "8px",
        border: active
          ? "2px solid #d71920"
          : "1px solid #cfd6df",
        background: active ? "#d71920" : "#ffffff",
        color: active ? "#ffffff" : "#071d41",
        fontWeight: 800,
        cursor: "pointer",
        minWidth: "120px",
      }}
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
    <div
      style={{
        border: "1px solid #d9e0ea",
        borderRadius: "12px",
        padding: "18px",
        background: "#f9fafb",
      }}
    >
      <h3
        style={{
          margin: "0 0 15px",
          color: "#071d41",
          fontSize: "16px",
        }}
      >
        {title}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
        }}
      >
        <Field
          label="Start Time"
          type="time"
          value={start}
          onChange={setStart}
        />

        <Field
          label="End Time"
          type="time"
          value={end}
          onChange={setEnd}
        />

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 700,
              color: "#071d41",
            }}
          >
            Service Duration
          </label>

          <div
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px",
              borderRadius: "8px",
              border: "1px solid #cfd6df",
              background: "#eef2f7",
              color: "#071d41",
              fontWeight: 800,
            }}
          >
            {duration || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateDuration(
  start: string,
  end: string
): string {
  if (!start || !end) {
    return "";
  }

  const [startHour, startMinute] =
    start.split(":").map(Number);

  const [endHour, endMinute] =
    end.split(":").map(Number);

  let startTotal =
    startHour * 60 + startMinute;

  let endTotal =
    endHour * 60 + endMinute;

  if (endTotal < startTotal) {
    endTotal += 24 * 60;
  }

  const difference =
    endTotal - startTotal;

  const hours = Math.floor(
    difference / 60
  );

  const minutes = difference % 60;

  return `${hours}h ${minutes
    .toString()
    .padStart(2, "0")}m`;
}

function FlightDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const flightId = String(params.id || "");

  const department =
    searchParams.get("department") || "";

  const [flight, setFlight] =
    useState<Flight | null>(null);

  const [captures, setCaptures] =
    useState<Capture[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [isManagement, setIsManagement] =
    useState(false);

  /* =========================
     RAMP SERVICES
  ========================= */

  const [gpuStartTime, setGpuStartTime] =
    useState("");

  const [gpuEndTime, setGpuEndTime] =
    useState("");

  const [acuStartTime, setAcuStartTime] =
    useState("");

  const [acuEndTime, setAcuEndTime] =
    useState("");

  const [cleaningStartTime, setCleaningStartTime] =
    useState("");

  const [cleaningEndTime, setCleaningEndTime] =
    useState("");

  const [conveyorStartTime, setConveyorStartTime] =
    useState("");

  const [conveyorEndTime, setConveyorEndTime] =
    useState("");

  const [vomitingStartTime, setVomitingStartTime] =
    useState("");

  const [vomitingEndTime, setVomitingEndTime] =
    useState("");

  const [cobusTripNumber, setCobusTripNumber] =
    useState("");

  const [towingStatus, setTowingStatus] =
    useState("");

  const [asuStatus, setAsuStatus] =
    useState("");

  const [paxStairs, setPaxStairs] =
    useState("");

  const [paxStep, setPaxStep] =
    useState("");

  const [pushback, setPushback] =
    useState("");

  const [lavatoryService, setLavatoryService] =
    useState("");

  const [portableWater, setPortableWater] =
    useState("");

  const [ambulift, setAmbulift] =
    useState("");

  const [supervisorName, setSupervisorName] =
    useState("");

  const [rampOpeningStatus, setRampOpeningStatus] =
    useState("");

  const [rampClosingStatus, setRampClosingStatus] =
    useState("");

  const [rampComments, setRampComments] =
    useState("");

  /* =========================
     OTHER DEPARTMENTS
  ========================= */

  const [pax, setPax] =
    useState("");

  const [baggages, setBaggages] =
    useState("");

  const [cargo, setCargo] =
    useState("");

  const [parkingBay, setParkingBay] =
    useState("");

  const [loadRamp, setLoadRamp] =
    useState("");

  const [stdEtd, setStdEtd] =
    useState("");

  const [staEta, setStaEta] =
    useState("");

  const [actualDeparture, setActualDeparture] =
    useState("");

  const [actualArrival, setActualArrival] =
    useState("");

  const [loadControlTrcName, setLoadControlTrcName] =
    useState("");

  const [salName, setSalName] =
    useState("");

  const [delayReason, setDelayReason] =
    useState("");

  const [iataDelayCode, setIataDelayCode] =
    useState("");

  const [operationalRemarks, setOperationalRemarks] =
    useState("");

  const [comments, setComments] =
    useState("");

  /* SORTING */

  const [uldBagSorting, setUldBagSorting] =
    useState("");

  const [numberOfBags, setNumberOfBags] =
    useState("");

  const [uldNumber, setUldNumber] =
    useState("");

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

  /* PASSENGER SERVICES */

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

  const [gateNumber, setGateNumber] =
    useState("");

  const [gateOpenTime, setGateOpenTime] =
    useState("");

  const [gateCloseTime, setGateCloseTime] =
    useState("");

  const [wheelchairAssistance, setWheelchairAssistance] =
    useState("");

  const [specialAssistance, setSpecialAssistance] =
    useState("");

  const [noShowPax, setNoShowPax] =
    useState("");

  const [deniedBoardingPax, setDeniedBoardingPax] =
    useState("");

  const [transferPax, setTransferPax] =
    useState("");

  const [
    passengerServicesRemarks,
    setPassengerServicesRemarks,
  ] = useState("");

  const [
    passengerServicesComments,
    setPassengerServicesComments,
  ] = useState("");

  /* CARGO */

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

  const [awbNumber, setAwbNumber] =
    useState("");

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

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/");
          return;
        }

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          alert(profileError.message);
          router.push("/");
          return;
        }

        const management =
          profile?.role === "management";

        setIsManagement(management);

        const {
          data: flightData,
          error: flightError,
        } = await supabase
          .from("flights")
          .select(
            "id, flight_number, aircraft, route, flight_date, status"
          )
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

        const {
          data: captureData,
          error: captureError,
        } = await supabase
          .from("flight_service_captures")
          .select(
            "id, flight_id, department, created_at"
          )
          .eq("flight_id", flightId)
          .order("created_at", {
            ascending: false,
          });

        if (captureError) {
          alert(captureError.message);
          return;
        }

        setCaptures(captureData || []);
      } finally {
        setLoading(false);
      }
    }

    if (flightId) {
      loadData();
    }
  }, [flightId, router]);

  /* =========================
     LOGOUT
  ========================= */

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  /* =========================
     SAVE
  ========================= */

  async function handleSave(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!department) {
      alert("Please select a department.");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert(
          "Your session has expired. Please login again."
        );

        router.push("/");
        return;
      }

      const captureData = {
        flight_id: flightId,
        department,

        /* BASIC */
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

        /* =====================
           RAMP
        ===================== */

        gpu_start_time:
          gpuStartTime || null,

        gpu_end_time:
          gpuEndTime || null,

        gpu_duration:
          calculateDuration(
            gpuStartTime,
            gpuEndTime
          ) || null,

        acu_start_time:
          acuStartTime || null,

        acu_end_time:
          acuEndTime || null,

        acu_duration:
          calculateDuration(
            acuStartTime,
            acuEndTime
          ) || null,

        cleaning_start_time:
          cleaningStartTime || null,

        cleaning_end_time:
          cleaningEndTime || null,

        cleaning_duration:
          calculateDuration(
            cleaningStartTime,
            cleaningEndTime
          ) || null,

        conveyor_start_time:
          conveyorStartTime || null,

        conveyor_end_time:
          conveyorEndTime || null,

        conveyor_duration:
          calculateDuration(
            conveyorStartTime,
            conveyorEndTime
          ) || null,

        vomiting_start_time:
          vomitingStartTime || null,

        vomiting_end_time:
          vomitingEndTime || null,

        vomiting_duration:
          calculateDuration(
            vomitingStartTime,
            vomitingEndTime
          ) || null,

        cobus_trip_number:
          cobusTripNumber || null,

        towing_status:
          towingStatus || null,

        asu_status:
          asuStatus || null,

        pax_stairs:
          paxStairs || null,

        pax_step:
          paxStep || null,

        pushback:
          pushback || null,

        lavatory_service:
          lavatoryService || null,

        portable_water:
          portableWater || null,

        ambulift:
          ambulift || null,

        supervisor_name:
          supervisorName || null,

        ramp_opening_status:
          rampOpeningStatus || null,

        ramp_closing_status:
          rampClosingStatus || null,

        ramp_comments:
          rampComments || null,

        /* =====================
           SORTING
        ===================== */

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

        /* =====================
           PASSENGER SERVICES
        ===================== */

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

        /* =====================
           CARGO
        ===================== */

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

      const { error } =
        await supabase
          .from("flight_service_captures")
          .insert(captureData);

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        `${
          departmentNames[department] ||
          department
        } capture saved successfully.`
      );

      router.push(
        `/flights?department=${encodeURIComponent(
          department
        )}`
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================
     STATUS
  ========================= */

  function getStatusClass(status: string) {
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
  }

  /* =========================
     LOADING
  ========================= */

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
          <h3>Flight not found.</h3>
        </div>
      </main>
    );
  }

  /* =========================
     PAGE
  ========================= */

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
          onClick={logout}
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
                isManagement
                  ? "/management"
                  : `/flights?department=${encodeURIComponent(
                      department
                    )}`
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
              : departmentNames[
                  department
                ] || department}
          </p>

        </div>

        {/* ======================
            FLIGHT INFORMATION
        ====================== */}

        <section className="flights-section">

          <div
            style={{
              padding: "30px",
            }}
          >

            <h2
              style={{
                color: "#071d41",
                marginBottom: "25px",
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

        {/* ======================
            MANAGEMENT
        ====================== */}

        {isManagement && (
          <section className="flights-section">

            <div
              style={{
                padding: "30px",
              }}
            >

              <h2
                style={{
                  color: "#071d41",
                  marginBottom: "8px",
                }}
              >
                Service Captures
              </h2>

              <p
                style={{
                  color: "#667085",
                  marginBottom: "25px",
                }}
              >
                All service captures submitted
                for this flight.
              </p>

              {captures.length === 0 ? (

                <div className="empty-state">
                  <h3>
                    No service captures yet
                  </h3>
                </div>

              ) : (

                <div
                  style={{
                    display: "grid",
                    gap: "15px",
                  }}
                >

                  {captures.map(
                    (capture) => (
                      <div
                        key={capture.id}
                        style={{
                          border:
                            "1px solid #d9e0ea",
                          borderRadius:
                            "12px",
                          padding:
                            "20px",
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          gap: "20px",
                          flexWrap:
                            "wrap",
                        }}
                      >

                        <div>
                          <strong>
                            {
                              departmentNames[
                                capture.department
                              ] ||
                              capture.department
                            }
                          </strong>

                          <p
                            style={{
                              color:
                                "#667085",
                              fontSize:
                                "13px",
                            }}
                          >
                            {
                              capture.id
                            }
                          </p>
                        </div>

                        <button
                          type="button"
                          className="action-button view"
                          onClick={() =>
                            router.push(
                              `/capture/${capture.id}`
                            )
                          }
                        >
                          VIEW CAPTURE
                        </button>

                      </div>
                    )
                  )}

                </div>

              )}

            </div>

          </section>
        )}

        {/* ======================
            RAMP
        ====================== */}

        {!isManagement &&
          department === "ramp" && (

          <section className="flights-section">

            <div
              style={{
                padding: "30px",
              }}
            >

              <h2
                style={{
                  color: "#071d41",
                  marginBottom: "5px",
                }}
              >
                RAMP DEPARTMENT
              </h2>

              <p
                style={{
                  color: "#667085",
                  marginBottom: "25px",
                }}
              >
                Ramp & Ground Services
              </p>

              <form
                onSubmit={handleSave}
                style={{
                  display: "grid",
                  gap: "18px",
                }}
              >

                {/* OPEN / CLOSE */}

                <div
                  style={{
                    border:
                      "1px solid #d9e0ea",
                    borderRadius:
                      "12px",
                    padding: "20px",
                    background:
                      "#f9fafb",
                  }}
                >

                  <h3
                    style={{
                      margin:
                        "0 0 15px",
                      color:
                        "#071d41",
                    }}
                  >
                    Ramp Operation Status
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >

                    <StatusButton
                      label="OPEN"
                      active={
                        rampOpeningStatus ===
                        "OPEN"
                      }
                      onClick={() =>
                        setRampOpeningStatus(
                          "OPEN"
                        )
                      }
                    />

                    <StatusButton
                      label="CLOSED"
                      active={
                        rampClosingStatus ===
                        "CLOSED"
                      }
                      onClick={() =>
                        setRampClosingStatus(
                          "CLOSED"
                        )
                      }
                    />

                  </div>

                </div>

                {/* SERVICE TIMES */}

                <ServiceTime
                  title="GPU"
                  start={gpuStartTime}
                  end={gpuEndTime}
                  duration={calculateDuration(
                    gpuStartTime,
                    gpuEndTime
                  )}
                  setStart={
                    setGpuStartTime
                  }
                  setEnd={
                    setGpuEndTime
                  }
                />

                <ServiceTime
                  title="ACU"
                  start={acuStartTime}
                  end={acuEndTime}
                  duration={calculateDuration(
                    acuStartTime,
                    acuEndTime
                  )}
                  setStart={
                    setAcuStartTime
                  }
                  setEnd={
                    setAcuEndTime
                  }
                />

                <ServiceTime
                  title="CLEANING"
                  start={cleaningStartTime}
                  end={cleaningEndTime}
                  duration={calculateDuration(
                    cleaningStartTime,
                    cleaningEndTime
                  )}
                  setStart={
                    setCleaningStartTime
                  }
                  setEnd={
                    setCleaningEndTime
                  }
                />

                <ServiceTime
                  title="CONVEYOR"
                  start={conveyorStartTime}
                  end={conveyorEndTime}
                  duration={calculateDuration(
                    conveyorStartTime,
                    conveyorEndTime
                  )}
                  setStart={
                    setConveyorStartTime
                  }
                  setEnd={
                    setConveyorEndTime
                  }
                />

                <ServiceTime
                  title="VOMITING"
                  start={vomitingStartTime}
                  end={vomitingEndTime}
                  duration={calculateDuration(
                    vomitingStartTime,
                    vomitingEndTime
                  )}
                  setStart={
                    setVomitingStartTime
                  }
                  setEnd={
                    setVomitingEndTime
                  }
                />

                {/* COBUS */}

                <section
                  style={{
                    border:
                      "1px solid #d9e0ea",
                    borderRadius:
                      "12px",
                    padding: "20px",
                    background:
                      "#f9fafb",
                  }}
                >

                  <h3
                    style={{
                      margin:
                        "0 0 15px",
                      color:
                        "#071d41",
                    }}
                  >
                    COBUS
                  </h3>

                  <Field
                    label="Trip Number"
                    value={
                      cobusTripNumber
                    }
                    onChange={
                      setCobusTripNumber
                    }
                  />

                </section>

                {/* TOWING + ASU */}

                <section
                  style={{
                    border:
                      "1px solid #d9e0ea",
                    borderRadius:
                      "12px",
                    padding: "20px",
                    background:
                      "#f9fafb",
                  }}
                >

                  <h3
                    style={{
                      margin:
                        "0 0 15px",
                      color:
                        "#071d41",
                    }}
                  >
                    Ground Equipment
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "25px",
                    }}
                  >

                    <div>
                      <strong>
                        Towing
                      </strong>

                      <div
                        style={{
                          display:
                            "flex",
                          gap: "10px",
                          marginTop:
                            "12px",
                        }}
                      >

                        <StatusButton
                          label="✓ USED"
                          active={
                            towingStatus ===
                            "USED"
                          }
                          onClick={() =>
                            setTowingStatus(
                              "USED"
                            )
                          }
                        />

                        <StatusButton
                          label="N/A"
                          active={
                            towingStatus ===
                            "N/A"
                          }
                          onClick={() =>
                            setTowingStatus(
                              "N/A"
                            )
                          }
                        />

                      </div>
                    </div>

                    <div>
                      <strong>
                        ASU
                      </strong>

                      <div
                        style={{
                          display:
                            "flex",
                          gap: "10px",
                          marginTop:
                            "12px",
                        }}
                      >

                        <StatusButton
                          label="✓ USED"
                          active={
                            asuStatus ===
                            "USED"
                          }
                          onClick={() =>
                            setAsuStatus(
                              "USED"
                            )
                          }
                        />

                        <StatusButton
                          label="N/A"
                          active={
                            asuStatus ===
                            "N/A"
                          }
                          onClick={() =>
                            setAsuStatus(
                              "N/A"
                            )
                          }
                        />

                      </div>
                    </div>

                  </div>

                </section>

                {/* OTHER RAMP SERVICES */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                  }}
                >

                  <Field
                    label="PAX Stairs"
                    value={
                      paxStairs
                    }
                    onChange={
                      setPaxStairs
                    }
                  />

                  <Field
                    label="PAX Step"
                    value={
                      paxStep
                    }
                    onChange={
                      setPaxStep
                    }
                  />

                  <Field
                    label="Pushback"
                    value={
                      pushback
                    }
                    onChange={
                      setPushback
                    }
                  />

                  <Field
                    label="Lavatory Service"
                    value={
                      lavatoryService
                    }
                    onChange={
                      setLavatoryService
                    }
                  />

                  <Field
                    label="Portable Water"
                    value={
                      portableWater
                    }
                    onChange={
                      setPortableWater
                    }
                  />

                  <Field
                    label="Ambulift"
                    value={
                      ambulift
                    }
                    onChange={
                      setAmbulift
                    }
                  />

                </div>

                {/* SUPERVISOR */}

                <section
                  style={{
                    border:
                      "1px solid #d9e0ea",
                    borderRadius:
                      "12px",
                    padding: "20px",
                    background:
                      "#f9fafb",
                  }}
                >

                  <h3
                    style={{
                      margin:
                        "0 0 15px",
                      color:
                        "#071d41",
                    }}
                  >
                    Supervision
                  </h3>

                  <Field
                    label="Supervisor Name"
                    value={
                      supervisorName
                    }
                    onChange={
                      setSupervisorName
                    }
                  />

                </section>

                <TextAreaField
                  label="Ramp Comments"
                  value={
                    rampComments
                  }
                  onChange={
                    setRampComments
                  }
                />

                <button
                  type="submit"
                  className="new-flight-button"
                  disabled={saving}
                  style={{
                    marginTop:
                      "10px",
                  }}
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE RAMP CAPTURE"}
                </button>

              </form>

            </div>

          </section>
        )}

        {/* ======================
            SORTING
        ====================== */}

        {!isManagement &&
          department === "sorting" && (

          <section className="flights-section">

            <div
              style={{
                padding: "30px",
              }}
            >

              <h2
                style={{
                  color: "#071d41",
                }}
              >
                SORTING DEPARTMENT
              </h2>

              <p
                style={{
                  color: "#667085",
                  marginBottom: "25px",
                }}
              >
                Baggage & ULD Sorting
              </p>

              <form
                onSubmit={handleSave}
                style={{
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

                  <Field
                    label="ULD / Bag Sorting"
                    value={
                      uldBagSorting
                    }
                    onChange={
                      setUldBagSorting
                    }
                  />

                  <Field
                    label="Number of Bags"
                    type="number"
                    value={
                      numberOfBags
                    }
                    onChange={
                      setNumberOfBags
                    }
                  />

                  <Field
                    label="ULD Number"
                    value={
                      uldNumber
                    }
                    onChange={
                      setUldNumber
                    }
                  />

                  <Field
                    label="Sorting Start Time"
                    type="time"
                    value={
                      sortingStartTime
                    }
                    onChange={
                      setSortingStartTime
                    }
                  />

                  <Field
                    label="Sorting End Time"
                    type="time"
                    value={
                      sortingEndTime
                    }
                    onChange={
                      setSortingEndTime
                    }
                  />

                  <Field
                    label="Bag Transfer"
                    value={
                      bagTransfer
                    }
                    onChange={
                      setBagTransfer
                    }
                  />

                  <Field
                    label="Rush / Priority Bags"
                    type="number"
                    value={
                      rushPriorityBags
                    }
                    onChange={
                      setRushPriorityBags
                    }
                  />

                  <Field
                    label="Misrouted Bags"
                    type="number"
                    value={
                      misroutedBags
                    }
                    onChange={
                      setMisroutedBags
                    }
                  />

                  <Field
                    label="Damaged Bags"
                    type="number"
                    value={
                      damagedBags
                    }
                    onChange={
                      setDamagedBags
                    }
                  />

                  <Field
                    label="Missing Bags"
                    type="number"
                    value={
                      missingBags
                    }
                    onChange={
                      setMissingBags
                    }
                  />

                </div>

                <TextAreaField
                  label="Sorting Remarks"
                  value={
                    sortingRemarks
                  }
                  onChange={
                    setSortingRemarks
                  }
                />

                <TextAreaField
                  label="Sorting Comments"
                  value={
                    sortingComments
                  }
                  onChange={
                    setSortingComments
                  }
                />

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

            </div>

          </section>
        )}

        {/* ======================
            LOAD CONTROL
        ====================== */}

        {!isManagement &&
          department ===
            "load_control_ops" && (

          <section className="flights-section">

            <div
              style={{
                padding: "30px",
              }}
            >

              <h2
                style={{
                  color: "#071d41",
                }}
              >
                LOAD CONTROL / OPS
              </h2>

              <p
                style={{
                  color: "#667085",
                  marginBottom: "25px",
                }}
              >
                Load Control & Operations
              </p>

              <form
                onSubmit={handleSave}
                style={{
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

                  <Field
                    label="PAX"
                    type="number"
                    value={pax}
                    onChange={setPax}
                  />

                  <Field
                    label="Baggages"
                    type="number"
                    value={baggages}
                    onChange={
                      setBaggages
                    }
                  />

                  <Field
                    label="Cargo"
                    type="number"
                    value={cargo}
                    onChange={setCargo}
                  />

                  <Field
                    label="Parking Bay"
                    value={
                      parkingBay
                    }
                    onChange={
                      setParkingBay
                    }
                  />

                  <Field
                    label="Load / Ramp"
                    value={
                      loadRamp
                    }
                    onChange={
                      setLoadRamp
                    }
                  />

                  <Field
                    label="STD / ETD"
                    value={stdEtd}
                    onChange={setStdEtd}
                  />

                  <Field
                    label="STA / ETA"
                    value={staEta}
                    onChange={setStaEta}
                  />

                  <Field
                    label="Actual Departure"
                    type="datetime-local"
                    value={
                      actualDeparture
                    }
                    onChange={
                      setActualDeparture
                    }
                  />

                  <Field
                    label="Actual Arrival"
                    type="datetime-local"
                    value={
                      actualArrival
                    }
                    onChange={
                      setActualArrival
                    }
                  />

                  <Field
                    label="Load Control / TRC Name"
                    value={
                      loadControlTrcName
                    }
                    onChange={
                      setLoadControlTrcName
                    }
                  />

                  <Field
                    label="SAL Name"
                    value={
                      salName
                    }
                    onChange={
                      setSalName
                    }
                  />

                  <Field
                    label="IATA Delay Code"
                    value={
                      iataDelayCode
                    }
                    onChange={
                      setIataDelayCode
                    }
                  />

                </div>

                <TextAreaField
                  label="Delay Reason"
                  value={
                    delayReason
                  }
                  onChange={
                    setDelayReason
                  }
                />

                <TextAreaField
                  label="Operational Remarks"
                  value={
                    operationalRemarks
                  }
                  onChange={
                    setOperationalRemarks
                  }
                />

                <TextAreaField
                  label="Comments"
                  value={
                    comments
                  }
                  onChange={
                    setComments
                  }
                />

                <button
                  type="submit"
                  className="new-flight-button"
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE LOAD CONTROL / OPS"}
                </button>

              </form>

            </div>

          </section>
        )}

        {/* ======================
            PASSENGER SERVICES
        ====================== */}

        {!isManagement &&
          department ===
            "passenger_services" && (

          <section className="flights-section">

            <div
              style={{
                padding: "30px",
              }}
            >

              <h2
                style={{
                  color: "#071d41",
                }}
              >
                PASSENGER SERVICES
              </h2>

              <p
                style={{
                  color: "#667085",
                  marginBottom: "25px",
                }}
              >
                Passenger & Gate Services
              </p>

              <form
                onSubmit={handleSave}
                style={{
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

                  <Field
                    label="Check-in Start Time"
                    type="time"
                    value={
                      checkInStartTime
                    }
                    onChange={
                      setCheckInStartTime
                    }
                  />

                  <Field
                    label="Check-in End Time"
                    type="time"
                    value={
                      checkInEndTime
                    }
                    onChange={
                      setCheckInEndTime
                    }
                  />

                  <Field
                    label="Check-in Agents"
                    type="number"
                    value={
                      checkInAgents
                    }
                    onChange={
                      setCheckInAgents
                    }
                  />

                  <Field
                    label="Boarding Start Time"
                    type="time"
                    value={
                      boardingStartTime
                    }
                    onChange={
                      setBoardingStartTime
                    }
                  />

                  <Field
                    label="Boarding End Time"
                    type="time"
                    value={
                      boardingEndTime
                    }
                    onChange={
                      setBoardingEndTime
                    }
                  />

                  <Field
                    label="Boarding Agents"
                    type="number"
                    value={
                      boardingAgents
                    }
                    onChange={
                      setBoardingAgents
                    }
                  />

                  <Field
                    label="Gate Number"
                    value={
                      gateNumber
                    }
                    onChange={
                      setGateNumber
                    }
                  />

                  <Field
                    label="Gate Open Time"
                    type="time"
                    value={
                      gateOpenTime
                    }
                    onChange={
                      setGateOpenTime
                    }
                  />

                  <Field
                    label="Gate Close Time"
                    type="time"
                    value={
                      gateCloseTime
                    }
                    onChange={
                      setGateCloseTime
                    }
                  />

                  <Field
                    label="Wheelchair Assistance"
                    type="number"
                    value={
                      wheelchairAssistance
                    }
                    onChange={
                      setWheelchairAssistance
                    }
                  />

                  <Field
                    label="Special Assistance"
                    value={
                      specialAssistance
                    }
                    onChange={
                      setSpecialAssistance
                    }
                  />

                  <Field
                    label="No-show PAX"
                    type="number"
                    value={
                      noShowPax
                    }
                    onChange={
                      setNoShowPax
                    }
                  />

                  <Field
                    label="Denied Boarding PAX"
                    type="number"
                    value={
                      deniedBoardingPax
                    }
                    onChange={
                      setDeniedBoardingPax
                    }
                  />

                  <Field
                    label="Transfer PAX"
                    type="number"
                    value={
                      transferPax
                    }
                    onChange={
                      setTransferPax
                    }
                  />

                </div>

                <TextAreaField
                  label="Passenger Services Remarks"
                  value={
                    passengerServicesRemarks
                  }
                  onChange={
                    setPassengerServicesRemarks
                  }
                />

                <TextAreaField
                  label="Passenger Services Comments"
                  value={
                    passengerServicesComments
                  }
                  onChange={
                    setPassengerServicesComments
                  }
                />

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

            </div>

          </section>
        )}

        {/* ======================
            CARGO
        ====================== */}

        {!isManagement &&
          department === "cargo" && (

          <section className="flights-section">

            <div
              style={{
                padding: "30px",
              }}
            >

              <h2
                style={{
                  color: "#071d41",
                }}
              >
                CARGO DEPARTMENT
              </h2>

              <p
                style={{
                  color: "#667085",
                  marginBottom: "25px",
                }}
              >
                Cargo Operations
              </p>

              <form
                onSubmit={handleSave}
                style={{
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

                  <Field
                    label="Cargo Acceptance Start Time"
                    type="time"
                    value={
                      cargoAcceptanceStartTime
                    }
                    onChange={
                      setCargoAcceptanceStartTime
                    }
                  />

                  <Field
                    label="Cargo Acceptance End Time"
                    type="time"
                    value={
                      cargoAcceptanceEndTime
                    }
                    onChange={
                      setCargoAcceptanceEndTime
                    }
                  />

                  <Field
                    label="Cargo Weight"
                    type="number"
                    value={
                      cargoWeight
                    }
                    onChange={
                      setCargoWeight
                    }
                  />

                  <Field
                    label="Cargo Pieces"
                    type="number"
                    value={
                      cargoPieces
                    }
                    onChange={
                      setCargoPieces
                    }
                  />

                  <Field
                    label="AWB Number"
                    value={
                      awbNumber
                    }
                    onChange={
                      setAwbNumber
                    }
                  />

                  <Field
                    label="Cargo ULD Number"
                    value={
                      cargoUldNumber
                    }
                    onChange={
                      setCargoUldNumber
                    }
                  />

                  <Field
                    label="Dangerous Goods"
                    value={
                      dangerousGoods
                    }
                    onChange={
                      setDangerousGoods
                    }
                  />

                  <Field
                    label="Special Cargo"
                    value={
                      specialCargo
                    }
                    onChange={
                      setSpecialCargo
                    }
                  />

                  <Field
                    label="Warehouse Location"
                    value={
                      warehouseLocation
                    }
                    onChange={
                      setWarehouseLocation
                    }
                  />

                  <Field
                    label="Cargo Loading Start Time"
                    type="time"
                    value={
                      cargoLoadingStartTime
                    }
                    onChange={
                      setCargoLoadingStartTime
                    }
                  />

                  <Field
                    label="Cargo Loading End Time"
                    type="time"
                    value={
                      cargoLoadingEndTime
                    }
                    onChange={
                      setCargoLoadingEndTime
                    }
                  />

                </div>

                <TextAreaField
                  label="Cargo Remarks"
                  value={
                    cargoRemarks
                  }
                  onChange={
                    setCargoRemarks
                  }
                />

                <TextAreaField
                  label="Cargo Comments"
                  value={
                    cargoComments
                  }
                  onChange={
                    setCargoComments
                  }
                />

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

            </div>

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
