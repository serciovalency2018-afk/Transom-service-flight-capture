"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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

type Flight = {
  id: string;
  flight_number: string;
  aircraft: string;
  route: string;
  flight_date: string;
  status: string;
};

const departmentNames: Record<string, string> = {
  ramp: "RAMP",
  sorting: "SORTING",
  load_control_ops: "LOAD CONTROL / OPS",
  passenger_services: "PASSENGER SERVICES",
  cargo: "CARGO",
};

function Field({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  return (
    <div
      style={{
        padding: "15px",
        border: "1px solid #e4e7ec",
        borderRadius: "8px",
        background: "#f9fafb",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#667085",
          marginBottom: "6px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: "#071d41",
          wordBreak: "break-word",
        }}
      >
        {String(value)}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="flights-section"
      style={{
        marginBottom: "25px",
      }}
    >
      <div
        className="section-header"
        style={{
          padding: "22px 30px",
        }}
      >
        <div>
          <h2>{title}</h2>
        </div>
      </div>

      <div
        style={{
          padding: "30px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "15px",
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default function CaptureDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const captureId = params.id as string;

  const [capture, setCapture] =
    useState<Capture | null>(null);

  const [flight, setFlight] =
    useState<Flight | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadCapture() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

      if (
        profileError ||
        profile?.role !== "management"
      ) {
        alert("Management access only.");
        router.push("/departments");
        return;
      }

      const {
        data: captureData,
        error: captureError,
      } = await supabase
        .from("flight_service_captures")
        .select("*")
        .eq("id", captureId)
        .single();

      if (captureError) {
        alert(captureError.message);
        router.push("/management");
        return;
      }

      setCapture(captureData);

      const {
        data: flightData,
        error: flightError,
      } = await supabase
        .from("flights")
        .select(
          "id, flight_number, aircraft, route, flight_date, status"
        )
        .eq("id", captureData.flight_id)
        .single();

      if (flightError) {
        alert(flightError.message);
        setLoading(false);
        return;
      }

      setFlight(flightData);
      setLoading(false);
    }

    if (captureId) {
      loadCapture();
    }
  }, [captureId, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="empty-state">
          <h3>Loading capture...</h3>
        </div>
      </main>
    );
  }

  if (!capture) {
    return (
      <main className="dashboard-page">
        <div className="empty-state">
          <h3>Capture not found</h3>
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
                flight
                  ? `/flight/${flight.id}`
                  : "/management"
              )
            }
            style={{
              marginBottom: "20px",
            }}
          >
            ← BACK TO FLIGHT
          </button>

          <h1>
            Service Capture Details
          </h1>

          <p>
            Management view — full service
            capture record
          </p>

        </div>

        {/* FLIGHT INFORMATION */}

        {flight && (
          <Section title="Flight Information">

            <Field
              label="Flight Number"
              value={flight.flight_number}
            />

            <Field
              label="Aircraft"
              value={flight.aircraft}
            />

            <Field
              label="Route"
              value={flight.route}
            />

            <Field
              label="Flight Date"
              value={flight.flight_date}
            />

            <Field
              label="Flight Status"
              value={flight.status}
            />

            <Field
              label="Department"
              value={
                departmentNames[
                  capture.department
                ] || capture.department
              }
            />

            <Field
              label="Capture ID"
              value={capture.id}
            />

            <Field
              label="Created"
              value={new Date(
                capture.created_at
              ).toLocaleString()}
            />

          </Section>
        )}

        {/* LOAD CONTROL / OPS */}

        {capture.department ===
          "load_control_ops" && (
          <>
            <Section title="LOAD CONTROL / OPS">

              <Field
                label="PAX"
                value={capture.pax}
              />

              <Field
                label="Baggages"
                value={capture.baggages}
              />

              <Field
                label="Cargo"
                value={capture.cargo}
              />

              <Field
                label="Parking Bay"
                value={capture.parking_bay}
              />

              <Field
                label="Load / Ramp"
                value={capture.load_ramp}
              />

              <Field
                label="STD / ETD"
                value={capture.std_etd}
              />

              <Field
                label="STA / ETA"
                value={capture.sta_eta}
              />

              <Field
                label="Actual Departure"
                value={capture.actual_departure}
              />

              <Field
                label="Actual Arrival"
                value={capture.actual_arrival}
              />

              <Field
                label="Load Control / TRC Name"
                value={
                  capture.load_control_trc_name
                }
              />

              <Field
                label="SAL Name"
                value={capture.sal_name}
              />

              <Field
                label="IATA Delay Code"
                value={
                  capture.iata_delay_code
                }
              />

              <Field
                label="Delay Reason"
                value={capture.delay_reason}
              />

              <Field
                label="Operational Remarks"
                value={
                  capture.operational_remarks
                }
              />

              <Field
                label="Comments"
                value={capture.comments}
              />

            </Section>
          </>
        )}

        {/* RAMP */}

        {capture.department === "ramp" && (
          <Section title="RAMP">

            <Field
              label="GPU Time"
              value={capture.gpu_time}
            />

            <Field
              label="ACU"
              value={capture.acu}
            />

            <Field
              label="COBUS"
              value={capture.cobus}
            />

            <Field
              label="Towing"
              value={capture.towing}
            />

            <Field
              label="Cleaning"
              value={capture.cleaning}
            />

            <Field
              label="Pushback"
              value={capture.pushback}
            />

            <Field
              label="Lavatory Service"
              value={
                capture.lavatory_service
              }
            />

            <Field
              label="Portable Water"
              value={
                capture.portable_water
              }
            />

            <Field
              label="PAX Stairs"
              value={capture.pax_stairs}
            />

            <Field
              label="Ambulift"
              value={capture.ambulift}
            />

            <Field
              label="ASU"
              value={capture.asu}
            />

            <Field
              label="PAX Step"
              value={capture.pax_step}
            />

            <Field
              label="Chocks In"
              value={capture.chocks_in}
            />

            <Field
              label="Chocks Out"
              value={capture.chocks_out}
            />

            <Field
              label="Vomiting"
              value={capture.vomiting}
            />

            <Field
              label="Ramp Comments"
              value={
                capture.ramp_comments
              }
            />

          </Section>
        )}

        {/* SORTING */}

        {capture.department === "sorting" && (
          <Section title="SORTING">

            <Field
              label="ULD / Bag Sorting"
              value={
                capture.uld_bag_sorting
              }
            />

            <Field
              label="Number of Bags"
              value={
                capture.number_of_bags
              }
            />

            <Field
              label="ULD Number"
              value={capture.uld_number}
            />

            <Field
              label="Sorting Start Time"
              value={
                capture.sorting_start_time
              }
            />

            <Field
              label="Sorting End Time"
              value={
                capture.sorting_end_time
              }
            />

            <Field
              label="Bag Transfer"
              value={
                capture.bag_transfer
              }
            />

            <Field
              label="Rush / Priority Bags"
              value={
                capture.rush_priority_bags
              }
            />

            <Field
              label="Misrouted Bags"
              value={
                capture.misrouted_bags
              }
            />

            <Field
              label="Damaged Bags"
              value={
                capture.damaged_bags
              }
            />

            <Field
              label="Missing Bags"
              value={
                capture.missing_bags
              }
            />

            <Field
              label="Sorting Remarks"
              value={
                capture.sorting_remarks
              }
            />

            <Field
              label="Sorting Comments"
              value={
                capture.sorting_comments
              }
            />

          </Section>
        )}

        {/* PASSENGER SERVICES */}

        {capture.department ===
          "passenger_services" && (
          <Section title="PASSENGER SERVICES">

            <Field
              label="Check-in Start Time"
              value={
                capture.check_in_start_time
              }
            />

            <Field
              label="Check-in End Time"
              value={
                capture.check_in_end_time
              }
            />

            <Field
              label="Check-in Agents"
              value={
                capture.check_in_agents
              }
            />

            <Field
              label="Boarding Start Time"
              value={
                capture.boarding_start_time
              }
            />

            <Field
              label="Boarding End Time"
              value={
                capture.boarding_end_time
              }
            />

            <Field
              label="Boarding Agents"
              value={
                capture.boarding_agents
              }
            />

            <Field
              label="Gate Number"
              value={capture.gate_number}
            />

            <Field
              label="Gate Open Time"
              value={
                capture.gate_open_time
              }
            />

            <Field
              label="Gate Close Time"
              value={
                capture.gate_close_time
              }
            />

            <Field
              label="Wheelchair Assistance"
              value={
                capture.wheelchair_assistance
              }
            />

            <Field
              label="Special Assistance"
              value={
                capture.special_assistance
              }
            />

            <Field
              label="No-show PAX"
              value={
                capture.no_show_pax
              }
            />

            <Field
              label="Denied Boarding PAX"
              value={
                capture.denied_boarding_pax
              }
            />

            <Field
              label="Transfer PAX"
              value={
                capture.transfer_pax
              }
            />

            <Field
              label="Passenger Services Remarks"
              value={
                capture.passenger_services_remarks
              }
            />

            <Field
              label="Passenger Services Comments"
              value={
                capture.passenger_services_comments
              }
            />

          </Section>
        )}

        {/* CARGO */}

        {capture.department === "cargo" && (
          <Section title="CARGO">

            <Field
              label="Cargo Acceptance Start Time"
              value={
                capture.cargo_acceptance_start_time
              }
            />

            <Field
              label="Cargo Acceptance End Time"
              value={
                capture.cargo_acceptance_end_time
              }
            />

            <Field
              label="Cargo Weight"
              value={capture.cargo_weight}
            />

            <Field
              label="Cargo Pieces"
              value={capture.cargo_pieces}
            />

            <Field
              label="AWB Number"
              value={capture.awb_number}
            />

            <Field
              label="Cargo ULD Number"
              value={
                capture.cargo_uld_number
              }
            />

            <Field
              label="Dangerous Goods"
              value={
                capture.dangerous_goods
              }
            />

            <Field
              label="Special Cargo"
              value={
                capture.special_cargo
              }
            />

            <Field
              label="Warehouse Location"
              value={
                capture.warehouse_location
              }
            />

            <Field
              label="Cargo Loading Start Time"
              value={
                capture.cargo_loading_start_time
              }
            />

            <Field
              label="Cargo Loading End Time"
              value={
                capture.cargo_loading_end_time
              }
            />

            <Field
              label="Cargo Remarks"
              value={
                capture.cargo_remarks
              }
            />

            <Field
              label="Cargo Comments"
              value={
                capture.cargo_comments
              }
            />

          </Section>
        )}

      </section>

      <footer className="dashboard-footer">
        <p>
          TRANSOM Flight Service Capture
        </p>

        <span>
          Management — Authorized Personnel Only
        </span>
      </footer>

    </main>
  );
  }
