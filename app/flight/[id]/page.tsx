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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // LOAD CONTROL / OPS
  const [pax, setPax] = useState("");
  const [baggages, setBaggages] = useState("");
  const [cargo, setCargo] = useState("");
  const [parkingBay, setParkingBay] = useState("");
  const [loadRamp, setLoadRamp] = useState("");
  const [stdEtd, setStdEtd] = useState("");
  const [staEta, setStaEta] = useState("");
  const [actualDeparture, setActualDeparture] = useState("");
  const [actualArrival, setActualArrival] = useState("");
  const [loadControlTrcName, setLoadControlTrcName] =
    useState("");
  const [salName, setSalName] = useState("");
  const [delayReason, setDelayReason] = useState("");
  const [iataDelayCode, setIataDelayCode] = useState("");
  const [operationalRemarks, setOperationalRemarks] =
    useState("");
  const [comments, setComments] = useState("");

  // RAMP
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

  useEffect(()
