"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  [key: string]: any;
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
  value: any;
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
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "15px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: 800,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#071d41",
          wordBreak: "break-word",
        }}
      >
        {String(value)}
      </div>
    </div>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: "30px",
        marginBottom: "15px",
        paddingBottom: "10px",
        borderBottom: "2px solid #d71920",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#071d41",
          fontSize: "20px",
          fontWeight: 900,
        }}
      >
        {children}
      </h2>
    </div>
  );
}

function CaptureContent({
  capture,
}: {
  capture: Capture;
}) {
  const department = capture.department;

  if (department === "ramp") {
    return (
      <>
        <SectionTitle>
          Ramp Operation Status
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <Field
            label="Opening Status"
            value={capture.ramp_opening_status}
          />

          <Field
            label="Closing Status"
            value={capture.ramp_closing_status}
          />

          <Field
            label="Supervisor Name"
            value={capture.supervisor_name}
          />
        </div>

        <SectionTitle>
          GPU
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <Field
            label="GPU Start Time"
            value={capture.gpu_start_time}
          />

          <Field
            label="GPU End Time"
            value={capture.gpu_end_time}
          />

          <Field
            label="GPU Duration"
            value={capture.gpu_duration}
          />
        </div>

        <SectionTitle>
          ACU
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <Field
            label="ACU Start Time"
            value={capture.acu_start_time}
          />

          <Field
            label="ACU End Time"
            value={capture.acu_end_time}
          />

          <Field
            label="ACU Duration"
            value={capture.acu_duration}
          />
        </div>

        <SectionTitle>
          Cleaning
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <Field
            label="Cleaning Start Time"
            value={capture.cleaning_start_time}
          />

          <Field
            label="Cleaning End Time"
            value={capture.cleaning_end_time}
          />

          <Field
            label="Cleaning Duration"
            value={capture.cleaning_duration}
          />
        </div>

        <SectionTitle>
          Conveyor
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <Field
            label="Conveyor Start Time"
            value={capture.conveyor_start_time}
          />

          <Field
            label="Conveyor End Time"
            value={capture.conveyor_end_time}
          />

          <Field
            label="Conveyor Duration"
            value={capture.conveyor_duration}
          />
        </div>

        <SectionTitle>
          Vomiting Service
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <Field
            label="Vomiting Start Time"
            value={capture.vomiting_start_time}
          />

          <Field
            label="Vomiting End Time"
            value={capture.vomiting_end_time}
          />

          <Field
            label="Vomiting Duration"
            value={capture.vomiting_duration}
          />
        </div>

        <SectionTitle>
          Ground Services
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <Field
            label="COBUS Trip Number"
            value={capture.cobus_trip_number}
          />

          <Field
            label="Towing"
            value={capture.towing_status}
          />

          <Field
            label="ASU"
            value={capture.asu_status}
          />

          <Field
            label="Pax Stairs"
            value={capture.pax_stairs}
          />

          <Field
            label="Pax Step"
            value={capture.pax_step}
          />

          <Field
            label="Pushback"
            value={capture.pushback}
          />

          <Field
            label="Lavatory Service"
            value={capture.lavatory_service}
          />

          <Field
            label="Portable Water"
            value={capture.portable_water}
          />

          <Field
            label="Ambulift"
            value={capture.ambulift}
          />
        </div>

        <SectionTitle>
          Ramp Comments
        </SectionTitle>

        <Field
          label="Comments"
          value={capture.ramp_comments}
        />
      </>
    );
  }

  if (department === "sorting") {
    return (
      <>
        <SectionTitle>
          Sorting Operation
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <Field
            label="ULD / Bag Sorting"
            value={capture.uld_bag_sorting}
          />

          <Field
            label="Number of Bags"
            value={capture.number_of_bags}
          />

          <Field
            label="ULD Number"
            value={capture.uld_number}
          />

          <Field
            label="Sorting Start Time"
            value={capture.sorting_start_time}
          />

          <Field
            label="Sorting End Time"
            value={capture.sorting_end_time}
          />

          <Field
            label="Bag Transfer"
            value={capture.bag_transfer}
          />

          <Field
            label="Rush / Priority Bags"
            value={capture.rush_priority_bags}
          />

          <Field
            label="Misrouted Bags"
            value={capture.misrouted_bags}
          />

          <Field
            label="Damaged Bags"
            value={capture.damaged_bags}
          />

          <Field
            label="Missing Bags"
            value={capture.missing_bags}
          />
        </div>

        <SectionTitle>
          Sorting Remarks
        </SectionTitle>

        <Field
          label="Remarks"
          value={capture.sorting_remarks}
        />

        <Field
          label="Comments"
          value={capture.sorting_comments}
        />
      </>
    );
  }

  if (department === "load_control_ops") {
    return (
      <>
        <SectionTitle>
          Load Control / Operations
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
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
            label="Load Ramp"
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
            value={capture.load_control_trc_name}
          />

          <Field
            label="SAL Name"
            value={capture.sal_name}
          />

          <Field
            label="IATA Delay Code"
            value={capture.iata_delay_code}
          />
        </div>

        <SectionTitle>
          Delay & Remarks
        </SectionTitle>

        <Field
          label="Delay Reason"
          value={capture.delay_reason}
        />

        <Field
          label="Operational Remarks"
          value={capture.operational_remarks}
        />

        <Field
          label="Comments"
          value={capture.comments}
        />
      </>
    );
  }

  if (department === "passenger_services") {
    return (
      <>
        <SectionTitle>
          Check-in
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <Field
            label="Check-in Start Time"
            value={capture.check_in_start_time}
          />

          <Field
            label="Check-in End Time"
            value={capture.check_in_end_time}
          />

          <Field
            label="Check-in Agents"
            value={capture.check_in_agents}
          />
        </div>

        <SectionTitle>
          Boarding
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <Field
            label="Boarding Start Time"
            value={capture.boarding_start_time}
          />

          <Field
            label="Boarding End Time"
            value={capture.boarding_end_time}
          />

          <Field
            label="Boarding Agents"
            value={capture.boarding_agents}
          />
        </div>

        <SectionTitle>
          Gate
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <Field
            label="Gate Number"
            value={capture.gate_number}
          />

          <Field
            label="Gate Open Time"
            value={capture.gate_open_time}
          />

          <Field
            label="Gate Close Time"
            value={capture.gate_close_time}
          />
        </div>

        <SectionTitle>
          Passenger Assistance
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <Field
            label="Wheelchair Assistance"
            value={capture.wheelchair_assistance}
          />

          <Field
            label="Special Assistance"
            value={capture.special_assistance}
          />

          <Field
            label="No-show PAX"
            value={capture.no_show_pax}
          />

          <Field
            label="Denied Boarding PAX"
            value={capture.denied_boarding_pax}
          />

          <Field
            label="Transfer PAX"
            value={capture.transfer_pax}
          />
        </div>

        <SectionTitle>
          Passenger Services Remarks
        </SectionTitle>

        <Field
          label="Remarks"
          value={
            capture.passenger_services_remarks
          }
        />

        <Field
          label="Comments"
          value={
            capture.passenger_services_comments
          }
        />
      </>
    );
  }

  if (department === "cargo") {
    return (
      <>
        <SectionTitle>
          Cargo Acceptance
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <Field
            label="Acceptance Start Time"
            value={
              capture.cargo_acceptance_start_time
            }
          />

          <Field
            label="Acceptance End Time"
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
            value={capture.cargo_uld_number}
          />

          <Field
            label="Dangerous Goods"
            value={capture.dangerous_goods}
          />

          <Field
            label="Special Cargo"
            value={capture.special_cargo}
          />

          <Field
            label="Warehouse Location"
            value={
              capture.warehouse_location
            }
          />
        </div>

        <SectionTitle>
          Cargo Loading
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <Field
            label="Loading Start Time"
            value={
              capture.cargo_loading_start_time
            }
          />

          <Field
            label="Loading End Time"
            value={
              capture.cargo_loading_end_time
            }
          />
        </div>

        <SectionTitle>
          Cargo Remarks
        </SectionTitle>

        <Field
          label="Remarks"
          value={capture.cargo_remarks}
        />

        <Field
          label="Comments"
          value={capture.cargo_comments}
        />
      </>
    );
  }

  return (
    <div className="empty-state">
      <h3>Unknown department</h3>
    </div>
  );
}

export default function CapturePage() {
  const router = useRouter();
  const params = useParams();

  const captureId =
    typeof params.id === "string"
      ? params.id
      : "";

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

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        alert(profileError.message);
        router.push("/");
        return;
      }

      if (profile.role !== "management") {
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
        setLoading(false);
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

      if (!flightError) {
        setFlight(flightData);
      }

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

          <button
            className="action-button view"
            onClick={() =>
              router.push("/management")
            }
          >
            BACK TO MANAGEMENT
          </button>
        </div>
      </main>
    );
  }

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
          onClick={handleLogout}
        >
          LOGOUT
        </button>
      </header>

      <section className="dashboard-content">
        <div className="welcome-section">
          <button
            className="logout-button"
            onClick={() =>
              router.push("/management")
            }
            style={{
              marginBottom: "20px",
            }}
          >
            ← BACK TO MANAGEMENT
          </button>

          <h1>
            Service Capture Details
          </h1>

          <p>
            {departmentNames[
              capture.department
            ] || capture.department}
          </p>
        </div>

        <section className="flights-section">
          <div
            style={{
              padding: "30px",
            }}
          >
            <SectionTitle>
              Flight Information
            </SectionTitle>

            {flight ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                }}
              >
                <Field
                  label="Flight Number"
                  value={
                    flight.flight_number
                  }
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
              </div>
            ) : (
              <p>
                Flight information unavailable.
              </p>
            )}

            <SectionTitle>
              Department
            </SectionTitle>

            <Field
              label="Department"
              value={
                departmentNames[
                  capture.department
                ] || capture.department
              }
            />

            <SectionTitle>
              Service Capture
            </SectionTitle>

            <CaptureContent
              capture={capture}
            />

            <SectionTitle>
              Record Information
            </SectionTitle>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
              }}
            >
              <Field
                label="Capture ID"
                value={capture.id}
              />

              <Field
                label="Created By"
                value={capture.created_by}
              />

              <Field
                label="Created At"
                value={
                  capture.created_at
                    ? new Date(
                        capture.created_at
                      ).toLocaleString()
                    : ""
                }
              />

              <Field
                label="Updated At"
                value={
                  capture.updated_at
                    ? new Date(
                        capture.updated_at
                      ).toLocaleString()
                    : ""
                }
              />
            </div>

            <div
              style={{
                marginTop: "35px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                className="logout-button"
                style={{
                  background: "#071d41",
                  color: "#fff",
                }}
                onClick={() =>
                  router.push("/management")
                }
              >
                ← MANAGEMENT
              </button>

              {flight && (
                <button
                  className="action-button view"
                  onClick={() =>
                    router.push(
                      `/flight/${flight.id}`
                    )
                  }
                >
                  VIEW FLIGHT
                </button>
              )}
            </div>
          </div>
        </section>
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
