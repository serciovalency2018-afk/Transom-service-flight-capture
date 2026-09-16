"use client";

import {
  Suspense,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
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

/* =========================================================
   REUSABLE FIELD
========================================================= */

function InputField({
  label,
  value,
  onChange,
  type = "text",
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
  step?: string;
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
        min={min}
        step={step}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "13px",
          borderRadius: "8px",
          border: "1px solid #d0d5dd",
          fontSize: "15px",
        }}
      />
    </div>
  );
}

/* =========================================================
   REUSABLE TEXTAREA
========================================================= */

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
        onChange={(e) =>
          onChange(e.target.value)
        }
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

/* =========================================================
   SECTION
========================================================= */

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        marginTop: "10px",
      }}
    >
      <h3
        style={{
          color: "#071d41",
          marginBottom: "18px",
          borderBottom: "1px solid #eaecf0",
          paddingBottom: "10px",
        }}
      >
        {title}
      </h3>

      {children}
    </section>
  );
}

/* =========================================================
   MAIN CONTENT
========================================================= */

function FlightDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const flightId = params.id as string;

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

  /* =======================================================
     LOAD CONTROL / OPS
  ======================================================= */

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

  /* =======================================================
     RAMP
  ======================================================= */

  const [gpuTime, setGpuTime] =
    useState("");

  const [acu, setAcu
