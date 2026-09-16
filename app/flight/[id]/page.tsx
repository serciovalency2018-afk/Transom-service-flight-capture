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

  // =========================
  // LOAD FLIGHT
  // =========================

  useEffect(() => {
    const loadFlight = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      const { data, error } = await supabase
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

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // =========================
  // SAVE SERVICE CAPTURE
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

    const serviceCapture = {
      flight_id: flightId,
      department: department,

      // =========================
      // LOAD CONTROL / OPS
      // =========================

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

      // =========================
      // RAMP
      // =========================

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

      // =========================
      // SORTING
      // =========================

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

      // =========================
      // PASSENGER SERVICES
      // =========================

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

      // =========================
      // CARGO
      // =========================

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

    const { error } = await supabase
      .from("flight_service_captures")
      .insert(serviceCapture);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      `${
        departmentNames[department] || department
      } service capture saved successfully!`
    );

    router.push(
      `/flights?department=${department}`
    );
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

      {/* =========================
          HEADER
      ========================= */}

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

        {/* =========================
            BACK + TITLE
        ========================= */}

        <div className="welcome-section">

          <button
            className="logout-button"
            onClick={() =>
              router.push(
                `/flights?department=${department}`
              )
            }
            style={{
              marginBottom: "20px",
            }}
          >
            ← BACK TO FLIGHTS
          </button>

          <h1>
            {flight.flight_number}
          </h1>

          <p>
            {departmentNames[department] ||
              department}
          </p>

        </div>

        {/* =========================
            FLIGHT INFORMATION
        ========================= */}

        <section className="flights-section">

          <div
            style={{
              padding: "30px",
              background: "#ffffff",
            }}
          >

            <h2
              style={{
                marginBottom: "20px",
                color: "#071d41",
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
                  {flight.status}
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            RAMP
        ================================================== */}

        {department === "ramp" && (

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

                <div>
                  <label>
                    GPU Time
                  </label>

                  <input
                    type="text"
                    value={gpuTime}
                    onChange={(e) =>
                      setGpuTime(
                        e.target.value
                      )
                    }
                    placeholder="GPU time"
                  />
                </div>

                <div>
                  <label>
                    ACU
                  </label>

                  <input
                    type="text"
                    value={acu}
                    onChange={(e) =>
                      setAcu(
                        e.target.value
                      )
                    }
                    placeholder="ACU"
                  />
                </div>

                <div>
                  <label>
                    COBUS
                  </label>

                  <input
                    type="text"
                    value={cobus}
                    onChange={(e) =>
                      setCobus(
                        e.target.value
                      )
                    }
                    placeholder="COBUS"
                  />
                </div>

                <div>
                  <label>
                    Towing
                  </label>

                  <input
                    type="text"
                    value={towing}
                    onChange={(e) =>
                      setTowing(
                        e.target.value
                      )
                    }
                    placeholder="Towing"
                  />
                </div>

                <div>
                  <label>
                    Cleaning
                  </label>

                  <input
                    type="text"
                    value={cleaning}
                    onChange={(e) =>
                      setCleaning(
                        e.target.value
                      )
                    }
                    placeholder="Cleaning"
                  />
                </div>

                <div>
                  <label>
                    Pushback
                  </label>

                  <input
                    type="text"
                    value={pushback}
                    onChange={(e) =>
                      setPushback(
                        e.target.value
                      )
                    }
                    placeholder="Pushback"
                  />
                </div>

                <div>
                  <label>
                    Lavatory Service
                  </label>

                  <input
                    type="text"
                    value={lavatoryService}
                    onChange={(e) =>
                      setLavatoryService(
                        e.target.value
                      )
                    }
                    placeholder="Lavatory service"
                  />
                </div>

                <div>
                  <label>
                    Portable Water
                  </label>

                  <input
                    type="text"
                    value={portableWater}
                    onChange={(e) =>
                      setPortableWater(
                        e.target.value
                      )
                    }
                    placeholder="Portable water"
                  />
                </div>

                <div>
                  <label>
                    PAX Stairs
                  </label>

                  <input
                    type="text"
                    value={paxStairs}
                    onChange={(e) =>
                      setPaxStairs(
                        e.target.value
                      )
                    }
                    placeholder="PAX stairs"
                  />
                </div>

                <div>
                  <label>
                    Ambulift
                  </label>

                  <input
                    type="text"
                    value={ambulift}
                    onChange={(e) =>
                      setAmbulift(
                        e.target.value
                      )
                    }
                    placeholder="Ambulift"
                  />
                </div>

                <div>
                  <label>
                    ASU
                  </label>

                  <input
                    type="text"
                    value={asu}
                    onChange={(e) =>
                      setAsu(
                        e.target.value
                      )
                    }
                    placeholder="ASU"
                  />
                </div>

                <div>
                  <label>
                    PAX Step
                  </label>

                  <input
                    type="text"
                    value={paxStep}
                    onChange={(e) =>
                      setPaxStep(
                        e.target.value
                      )
                    }
                    placeholder="PAX step"
                  />
                </div>

                <div>
                  <label>
                    Chocks In
                  </label>

                  <input
                    type="text"
                    value={chocksIn}
                    onChange={(e) =>
                      setChocksIn(
                        e.target.value
                      )
                    }
                    placeholder="Chocks in"
                  />
                </div>

                <div>
                  <label>
                    Chocks Out
                  </label>

                  <input
                    type="text"
                    value={chocksOut}
                    onChange={(e) =>
                      setChocksOut(
                        e.target.value
                      )
                    }
                    placeholder="Chocks out"
                  />
                </div>

                <div>
                  <label>
                    Vomiting
                  </label>

                  <input
                    type="text"
                    value={vomiting}
                    onChange={(e) =>
                      setVomiting(
                        e.target.value
                      )
                    }
                    placeholder="Vomiting"
                  />
                </div>

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
                  placeholder="Enter ramp comments"
                  rows={4}
                />

              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >

                <button
                  type="button"
                  className="logout-button"
                  onClick={() =>
                    router.push(
                      `/flights?department=${department}`
                    )
                  }
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="new-flight-button"
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE RAMP CAPTURE"}
                </button>

              </div>

            </form>

          </section>

        )}

        {/* ==================================================
            SORTING
        ================================================== */}

        {department === "sorting" && (

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
                  Baggage & ULD Sorting Service Capture
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

                <div>
                  <label>
                    ULD / Bag Sorting
                  </label>

                  <input
                    type="text"
                    value={uldBagSorting}
                    onChange={(e) =>
                      setUldBagSorting(
                        e.target.value
                      )
                    }
                    placeholder="ULD / Bag Sorting"
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
                    placeholder="Number of bags"
                  />
                </div>

                <div>
                  <label>
                    ULD Number
                  </label>

                  <input
                    type="text"
                    value={uldNumber}
                    onChange={(e) =>
                      setUldNumber(
                        e.target.value
                      )
                    }
                    placeholder="ULD number"
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
                    type="text"
                    value={bagTransfer}
                    onChange={(e) =>
                      setBagTransfer(
                        e.target.value
                      )
                    }
                    placeholder="Bag transfer"
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
                    placeholder="Rush / priority bags"
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
                    placeholder="Misrouted bags"
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
                    placeholder="Damaged bags"
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
                    placeholder="Missing bags"
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
                  placeholder="Enter sorting remarks"
                  rows={4}
                />

              </div>

              <div>

                <label>
                  Comments
                </label>

                <textarea
                  value={sortingComments}
                  onChange={(e) =>
                    setSortingComments(
                      e.target.value
                    )
                  }
                  placeholder="Additional comments"
                  rows={4}
                />

              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >

                <button
                  type="button"
                  className="logout-button"
                  onClick={() =>
                    router.push(
                      `/flights?department=${department}`
                    )
                  }
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="new-flight-button"
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE SORTING CAPTURE"}
                </button>

              </div>

            </form>

          </section>

        )}

        {/* ==================================================
            PASSENGER SERVICES
        ================================================== */}

        {department === "passenger_services" && (

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
                  Passenger & Gate Services Capture
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

              <h3
                style={{
                  color: "#071d41",
                  marginBottom: "0",
                }}
              >
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
                    value={checkInStartTime}
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
                    value={checkInEndTime}
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
                    placeholder="Number of agents"
                  />
                </div>

              </div>

              <h3
                style={{
                  color: "#071d41",
                  marginBottom: "0",
                  marginTop: "10px",
                }}
              >
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
                    value={boardingStartTime}
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
                    value={boardingEndTime}
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
                    placeholder="Number of agents"
                  />
                </div>

                <div>
                  <label>
                    Gate Number
                  </label>

                  <input
                    type="text"
                    value={gateNumber}
                    onChange={(e) =>
                      setGateNumber(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Gate 4"
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

              <h3
                style={{
                  color: "#071d41",
                  marginBottom: "0",
                  marginTop: "10px",
                }}
              >
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
                    placeholder="Number assisted"
                  />
                </div>

                <div>
                  <label>
                    Special Assistance
                  </label>

                  <input
                    type="text"
                    value={specialAssistance}
                    onChange={(e) =>
                      setSpecialAssistance(
                        e.target.value
                      )
                    }
                    placeholder="Special assistance details"
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
                    placeholder="No-show passengers"
                  />
                </div>

                <div>
                  <label>
                    Denied Boarding PAX
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={deniedBoardingPax}
                    onChange={(e) =>
                      setDeniedBoardingPax(
                        e.target.value
                      )
                    }
                    placeholder="Denied boarding"
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
                    placeholder="Transfer passengers"
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
                  placeholder="Enter passenger services remarks"
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
                  placeholder="Additional comments"
                  rows={4}
                />

              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >

                <button
                  type="button"
                  className="logout-button"
                  onClick={() =>
                    router.push(
                      `/flights?department=${department}`
                    )
                  }
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="new-flight-button"
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE PASSENGER SERVICES"}
                </button>

              </div>

            </form>

          </section>

        )}

        {/* ==================================================
            LOAD CONTROL / OPS
        ================================================== */}

        {department === "load_control_ops" && (

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
                    placeholder="Passenger count"
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
                    placeholder="Baggage count"
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
                    placeholder="Cargo"
                  />
                </div>

                <div>
                  <label>
                    Parking Bay
                  </label>

                  <input
                    type="text"
                    value={parkingBay}
                    onChange={(e) =>
                      setParkingBay(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Bay 04"
                  />
                </div>

                <div>
                  <label>
                    Load / Ramp
                  </label>

                  <input
                    type="text"
                    value={loadRamp}
                    onChange={(e) =>
                      setLoadRamp(
                        e.target.value
                      )
                    }
                    placeholder="Load / Ramp"
                  />
                </div>

                <div>
                  <label>
                    STD / ETD
                  </label>

                  <input
                    type="text"
                    value={stdEtd}
                    onChange={(e) =>
                      setStdEtd(
                        e.target.value
                      )
                    }
                    placeholder="e.g. 15:00 / 15:20"
                  />
                </div>

                <div>
                  <label>
                    STA / ETA
                  </label>

                  <input
                    type="text"
                    value={staEta}
                    onChange={(e) =>
                      setStaEta(
                        e.target.value
                      )
                    }
                    placeholder="e.g. 16:00 / 16:15"
                  />
                </div>

                <div>
                  <label>
                    Actual Departure
                  </label>

                  <input
                    type="datetime-local"
                    value={actualDeparture}
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
                    value={actualArrival}
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
                    type="text"
                    value={loadControlTrcName}
                    onChange={(e) =>
                      setLoadControlTrcName(
                        e.target.value
                      )
                    }
                    placeholder="Name"
                  />
                </div>

                <div>
                  <label>
                    SAL Name
                  </label>

                  <input
                    type="text"
                    value={salName}
                    onChange={(e) =>
                      setSalName(
                        e.target.value
                      )
                    }
                    placeholder="Name"
                  />
                </div>

                <div>
                  <label>
                    IATA Delay Code
                  </label>

                  <input
                    type="text"
                    value={iataDelayCode}
                    onChange={(e) =>
                      setIataDelayCode(
                        e.target.value
                      )
                    }
                    placeholder="Enter IATA delay code"
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
                  placeholder="Enter delay reason"
                  rows={4}
                />

              </div>

              <div>

                <label>
                  Operational Remarks
                </label>

                <textarea
                  value={operationalRemarks}
                  onChange={(e) =>
                    setOperationalRemarks(
                      e.target.value
                    )
                  }
                  placeholder="Enter operational remarks"
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
                  placeholder="Additional comments"
                  rows={4}
                />

              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >

                <button
                  type="button"
                  className="logout-button"
                  onClick={() =>
                    router.push(
                      `/flights?department=${department}`
                    )
                  }
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="new-flight-button"
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE SERVICE CAPTURE"}
                </button>

              </div>

            </form>

          </section>

        )}

        {/* ==================================================
            CARGO
        ================================================== */}

        {department === "cargo" && (

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
                  Cargo Operations Service Capture
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

              {/* CARGO ACCEPTANCE */}

              <h3
                style={{
                  color: "#071d41",
                  marginBottom: "0",
                }}
              >
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
                    placeholder="Weight"
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
                    placeholder="Number of pieces"
                  />

                </div>

                <div>

                  <label>
                    AWB Number
                  </label>

                  <input
                    type="text"
                    value={awbNumber}
                    onChange={(e) =>
                      setAwbNumber(
                        e.target.value
                      )
                    }
                    placeholder="AWB number"
                  />

                </div>

                <div>

                  <label>
                    Cargo ULD Number
                  </label>

                  <input
                    type="text"
                    value={cargoUldNumber}
                    onChange={(e) =>
                      setCargoUldNumber(
                        e.target.value
                      )
                    }
                    placeholder="ULD number"
                  />

                </div>

              </div>

              {/* SPECIAL CARGO */}

              <h3
                style={{
                  color: "#071d41",
                  marginBottom: "0",
                  marginTop: "10px",
                }}
              >
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
                    type="text"
                    value={dangerousGoods}
                    onChange={(e) =>
                      setDangerousGoods(
                        e.target.value
                      )
                    }
                    placeholder="Dangerous goods details"
                  />

                </div>

                <div>

                  <label>
                    Special Cargo
                  </label>

                  <input
                    type="text"
                    value={specialCargo}
                    onChange={(e) =>
                      setSpecialCargo(
                        e.target.value
                      )
                    }
                    placeholder="Special cargo details"
                  />

                </div>

                <div>

                  <label>
                    Warehouse Location
                  </label>

                  <input
                    type="text"
                    value={warehouseLocation}
                    onChange={(e) =>
                      setWarehouseLocation(
                        e.target.value
                      )
                    }
                    placeholder="Warehouse location"
                  />

                </div>

              </div>

              {/* CARGO LOADING */}

              <h3
                style={{
                  color: "#071d41",
                  marginBottom: "0",
                  marginTop: "10px",
                }}
              >
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

              {/* REMARKS */}

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
                  placeholder="Enter cargo remarks"
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
                  placeholder="Additional cargo comments"
                  rows={4}
                />

              </div>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >

                <button
                  type="button"
                  className="logout-button"
                  onClick={() =>
                    router.push(
                      `/flights?department=${department}`
                    )
                  }
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="new-flight-button"
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE CARGO CAPTURE"}
                </button>

              </div>

            </form>

          </section>

        )}

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="dashboard-footer">

        <p>
          TRANSOM Flight Service Capture
        </p>

        <span>
          Authorized Personnel Only
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
