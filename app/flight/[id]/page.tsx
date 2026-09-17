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
          border: "1px solid #d0d5dd",
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
          border: "1px solid #d0d5dd",
          fontSize: "15px",
          resize: "vertical",
        }}
      />
    </div>
  );
}

/* =========================================
   RAMP SERVICE TIME CARD
========================================= */

function ServiceTimeCard({
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
  duration: number | null;
  setStart: (value: string) => void;
  setEnd: (value: string) => void;
}) {
  function calculateDuration(
    startTime: string,
    endTime: string
  ) {
    if (!startTime || !endTime) {
      return null;
    }

    const [startHour, startMinute] =
      startTime.split(":").map(Number);

    const [endHour, endMinute] =
      endTime.split(":").map(Number);

    let startTotal =
      startHour * 60 + startMinute;

    let endTotal =
      endHour * 60 + endMinute;

    if (endTotal < startTotal) {
      endTotal += 24 * 60;
    }

    return endTotal - startTotal;
  }

  const calculatedDuration =
    calculateDuration(start, end);

  return (
    <div
      style={{
        border: "1px solid #d9e2ef",
        borderRadius: "12px",
        padding: "18px",
        background:
          "linear-gradient(145deg, #ffffff, #f7faff)",
        boxShadow:
          "0 5px 15px rgba(7,29,65,0.06)",
      }}
    >
      <div
        style={{
          color: "#071d41",
          fontWeight: 900,
          fontSize: "15px",
          marginBottom: "15px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: "12px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#667085",
            }}
          >
            START TIME
          </label>

          <input
            type="time"
            value={start}
            onChange={(e) =>
              setStart(e.target.value)
            }
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "11px",
              borderRadius: "7px",
              border:
                "1px solid #cbd5e1",
              fontSize: "14px",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#667085",
            }}
          >
            END TIME
          </label>

          <input
            type="time"
            value={end}
            onChange={(e) =>
              setEnd(e.target.value)
            }
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "11px",
              borderRadius: "7px",
              border:
                "1px solid #cbd5e1",
              fontSize: "14px",
            }}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: "13px",
          padding: "10px",
          borderRadius: "7px",
          background: "#071d41",
          color: "#ffffff",
          textAlign: "center",
          fontSize: "12px",
          fontWeight: 800,
        }}
      >
        TOTAL TIME:{" "}
        {calculatedDuration !== null
          ? `${calculatedDuration} min`
          : duration !== null
          ? `${duration} min`
          : "--"}
      </div>
    </div>
  );
}

/* =========================================
   DONE / N/A CARD
========================================= */

function StatusCard({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      style={{
        border: "1px solid #d9e2ef",
        borderRadius: "12px",
        padding: "18px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          color: "#071d41",
          fontWeight: 900,
          marginBottom: "14px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "10px",
        }}
      >
        <button
          type="button"
          onClick={() => onChange("Done")}
          style={{
            padding: "11px",
            borderRadius: "7px",
            border: "none",
            background:
              value === "Done"
                ? "#16a34a"
                : "#edf2f7",
            color:
              value === "Done"
                ? "#ffffff"
                : "#071d41",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          ✓ DONE
        </button>

        <button
          type="button"
          onClick={() => onChange("N/A")}
          style={{
            padding: "11px",
            borderRadius: "7px",
            border:
              "1px solid #cbd5e1",
            background:
              value === "N/A"
                ? "#071d41"
                : "#ffffff",
            color:
              value === "N/A"
                ? "#ffffff"
                : "#071d41",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          N/A
        </button>
      </div>
    </div>
  );
}

/* =========================================
   MAIN PAGE
========================================= */

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

  /* =========================================
     COMMON FIELDS
  ========================================= */

  const [pax, setPax] = useState("");
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

  const [
    loadControlTrcName,
    setLoadControlTrcName,
  ] = useState("");

  const [salName, setSalName] =
    useState("");

  const [delayReason, setDelayReason] =
    useState("");

  const [iataDelayCode, setIataDelayCode] =
    useState("");

  const [
    operationalRemarks,
    setOperationalRemarks,
  ] = useState("");

  const [comments, setComments] =
    useState("");

  /* =========================================
     RAMP TIME SERVICES
  ========================================= */

  const [gpuStartTime, setGpuStartTime] =
    useState("");

  const [gpuEndTime, setGpuEndTime] =
    useState("");

  const [acuStartTime, setAcuStartTime] =
    useState("");

  const [acuEndTime, setAcuEndTime] =
    useState("");

  const [
    cleaningStartTime,
    setCleaningStartTime,
  ] = useState("");

  const [
    cleaningEndTime,
    setCleaningEndTime,
  ] = useState("");

  const [
    vomitingStartTime,
    setVomitingStartTime,
  ] = useState("");

  const [
    vomitingEndTime,
    setVomitingEndTime,
  ] = useState("");

  const [
    conveyorStartTime,
    setConveyorStartTime,
  ] = useState("");

  const [
    conveyorEndTime,
    setConveyorEndTime,
  ] = useState("");

  /* =========================================
     OTHER RAMP SERVICES
  ========================================= */

  const [cobusTripNumber, setCobusTripNumber] =
    useState("");

  const [towingStatus, setTowingStatus] =
    useState("");

  const [asuStatus, setAsuStatus] =
    useState("");

  const [
    rampSupervisorName,
    setRampSupervisorName,
  ] = useState("");

  const [
    rampOpeningClosing,
    setRampOpeningClosing,
  ] = useState("");

  const [lavatoryService, setLavatoryService] =
    useState("");

  const [portableWater, setPortableWater] =
    useState("");

  const [paxStairs, setPaxStairs] =
    useState("");

  const [ambulift, setAmbulift] =
    useState("");

  const [paxStep, setPaxStep] =
    useState("");

  const [rampComments, setRampComments] =
    useState("");

  /* =========================================
     SORTING
  ========================================= */

  const [uldBagSorting, setUldBagSorting] =
    useState("");

  const [numberOfBags, setNumberOfBags] =
    useState("");

  const [uldNumber, setUldNumber] =
    useState("");

  const [
    sortingStartTime,
    setSortingStartTime,
  ] = useState("");

  const [
    sortingEndTime,
    setSortingEndTime,
  ] = useState("");

  const [bagTransfer, setBagTransfer] =
    useState("");

  const [
    rushPriorityBags,
    setRushPriorityBags,
  ] = useState("");

  const [
    misroutedBags,
    setMisroutedBags,
  ] = useState("");

  const [
    damagedBags,
    setDamagedBags,
  ] = useState("");

  const [
    missingBags,
    setMissingBags,
  ] = useState("");

  const [sortingRemarks, setSortingRemarks] =
    useState("");

  const [
    sortingComments,
    setSortingComments,
  ] = useState("");

  /* =========================================
     PASSENGER SERVICES
  ========================================= */

  const [
    checkInStartTime,
    setCheckInStartTime,
  ] = useState("");

  const [
    checkInEndTime,
    setCheckInEndTime,
  ] = useState("");

  const [checkInAgents, setCheckInAgents] =
    useState("");

  const [
    boardingStartTime,
    setBoardingStartTime,
  ] = useState("");

  const [
    boardingEndTime,
    setBoardingEndTime,
  ] = useState("");

  const [
    boardingAgents,
    setBoardingAgents,
  ] = useState("");

  const [gateNumber, setGateNumber] =
    useState("");

  const [gateOpenTime, setGateOpenTime] =
    useState("");

  const [gateCloseTime, setGateCloseTime] =
    useState("");

  const [
    wheelchairAssistance,
    setWheelchairAssistance,
  ] = useState("");

  const [
    specialAssistance,
    setSpecialAssistance,
  ] = useState("");

  const [noShowPax, setNoShowPax] =
    useState("");

  const [
    deniedBoardingPax,
    setDeniedBoardingPax,
  ] = useState("");

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

  /* =========================================
     CARGO
  ========================================= */

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

  const [
    warehouseLocation,
    setWarehouseLocation,
  ] = useState("");

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

  /* =========================================
     LOAD DATA
  ========================================= */

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

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  /* =========================================
     SAVE
  ========================================= */

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

      function getDuration(
        start: string,
        end: string
      ) {
        if (!start || !end) {
          return null;
        }

        const [sh, sm] =
          start.split(":").map(Number);

        const [eh, em] =
          end.split(":").map(Number);

        let startMinutes =
          sh * 60 + sm;

        let endMinutes =
          eh * 60 + em;

        if (endMinutes < startMinutes) {
          endMinutes += 1440;
        }

        return endMinutes - startMinutes;
      }

      const captureData = {
        flight_id: flightId,
        department,

        pax: pax ? Number(pax) : null,
        baggages: baggages
          ? Number(baggages)
          : null,
        cargo: cargo ? Number(cargo) : null,

        parking_bay:
          parkingBay || null,

        load_ramp:
          loadRamp || null,

        std_etd:
          stdEtd || null,

        sta_eta:
          staEta || null,

        actual_departure:
          actualDeparture || null,

        actual_arrival:
          actualArrival || null,

        load_control_trc_name:
          loadControlTrcName || null,

        sal_name:
          salName || null,

        delay_reason:
          delayReason || null,

        iata_delay_code:
          iataDelayCode || null,

        operational_remarks:
          operationalRemarks || null,

        comments:
          comments || null,

        /* ================================
           RAMP TIME SERVICES
        ================================= */

        gpu_start_time:
          gpuStartTime || null,

        gpu_end_time:
          gpuEndTime || null,

        gpu_duration_minutes:
          getDuration(
            gpuStartTime,
            gpuEndTime
          ),

        acu_start_time:
          acuStartTime || null,

        acu_end_time:
          acuEndTime || null,

        acu_duration_minutes:
          getDuration(
            acuStartTime,
            acuEndTime
          ),

        cleaning_start_time:
          cleaningStartTime || null,

        cleaning_end_time:
          cleaningEndTime || null,

        cleaning_duration_minutes:
          getDuration(
            cleaningStartTime,
            cleaningEndTime
          ),

        vomiting_start_time:
          vomitingStartTime || null,

        vomiting_end_time:
          vomitingEndTime || null,

        vomiting_duration_minutes:
          getDuration(
            vomitingStartTime,
            vomitingEndTime
          ),

        conveyor_start_time:
          conveyorStartTime || null,

        conveyor_end_time:
          conveyorEndTime || null,

        conveyor_duration_minutes:
          getDuration(
            conveyorStartTime,
            conveyorEndTime
          ),

        /* ================================
           RAMP OTHER
        ================================= */

        cobus_trip_number:
          cobusTripNumber || null,

        towing_status:
          towingStatus || null,

        asu_status:
          asuStatus || null,

        ramp_supervisor_name:
          rampSupervisorName || null,

        ramp_opening_closing:
          rampOpeningClosing || null,

        lavatory_service:
          lavatoryService || null,

        portable_water:
          portableWater || null,

        pax_stairs:
          paxStairs || null,

        ambulift:
          ambulift || null,

        pax_step:
          paxStep || null,

        ramp_comments:
          rampComments || null,

        /* ================================
           SORTING
        ================================= */

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

        /* ================================
           PASSENGER SERVICES
        ================================= */

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

        /* ================================
           CARGO
        ================================= */

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
          departmentNames[department]
