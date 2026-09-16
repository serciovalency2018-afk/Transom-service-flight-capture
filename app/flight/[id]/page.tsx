"use client";

import {
  Suspense,
  useEffect,
  useState,
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

  const department =
    searchParams.get("department") || "";

  const [flight, setFlight] =
    useState<Flight | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // LOAD CONTROL / OPS
  const [pax, setPax] = useState("");
  const [baggages, setBaggages] = useState("");
  const [cargo, setCargo] = useState("");
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

  // RAMP
  const [gpuTime, setGpuTime] =
    useState("");
  const [acu, setAcu] =
    useState("");
  const [cobus, setCobus] =
    useState("");
  const [towing, setTowing] =
    useState("");
  const [cleaning, setCleaning] =
    useState("");
  const [pushback, setPushback] =
    useState("");
  const [
    lavatoryService,
    setLavatoryService,
  ] = useState("");
  const [
    portableWater,
    setPortableWater,
  ] = useState("");
  const [paxStairs, setPaxStairs] =
    useState("");
  const [ambulift, setAmbulift] =
    useState("");
  const [asu, setAsu] =
    useState("");
  const [paxStep, setPaxStep] =
    useState("");
  const [chocksIn, setChocksIn] =
    useState("");
  const [chocksOut, setChocksOut] =
    useState("");
  const [vomiting, setVomiting] =
    useState("");
  const [rampComments, setRampComments] =
    useState("");

  useEffect(() => {
    const loadFlight = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      const { data, error } =
        await supabase
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

    const serviceCapture: Record<
      string,
      string | number | null
    > = {
      flight_id: flightId,
      department: department,

      // LOAD CONTROL / OPS
      pax: pax ? Number(pax) : null,
      baggages: baggages
        ? Number(baggages)
        : null,
      cargo: cargo
        ? Number(cargo)
        : null,

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

      // RAMP
      gpu_time:
        gpuTime || null,

      acu:
        acu || null,

      cobus:
        cobus || null,

      towing:
        towing || null,

      cleaning:
        cleaning || null,

      pushback:
        pushback || null,

      lavatory_service:
        lavatoryService || null,

      portable_water:
        portableWater || null,

      pax_stairs:
        paxStairs || null,

      ambulift:
        ambulift || null,

      asu:
        asu || null,

      pax_step:
        paxStep || null,

      chocks_in:
        chocksIn || null,

      chocks_out:
        chocksOut || null,

      vomiting:
        vomiting || null,

      ramp_comments:
        rampComments || null,

      created_by: user.id,
    };

    const { error } =
      await supabase
        .from("flight_service_captures")
        .insert(serviceCapture);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      `${
        departmentNames[department] ||
        department
      } service capture saved successfully!`
    );

    router.push(
      `/flights?department=${department}`
    );
  };

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="empty-state">
          <h3>
            Loading flight...
          </h3>
        </div>
      </main>
    );
  }

  if (!flight) {
    return (
      <main className="dashboard-page">
        <div className="empty-state">
          <h3>
            Flight not found
          </h3>

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
