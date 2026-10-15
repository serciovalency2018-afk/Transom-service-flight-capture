"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Department = {
  id: "ramp" | "sorting" | "load_control_ops" | "passenger_services" | "cargo";
  title: string;
  description: string;
  icon: string;
  tone: "red" | "navy" | "blue";
};

const departments: Department[] = [
  { id: "ramp", title: "RAMP", description: "Ramp & Ground Services", icon: "✈", tone: "red" },
  { id: "sorting", title: "SORTING", description: "Baggage & ULD Sorting", icon: "▤", tone: "navy" },
  { id: "load_control_ops", title: "LOAD CONTROL / OPS", description: "Load Control & Operations", icon: "☑", tone: "blue" },
  { id: "passenger_services", title: "PASSENGER SERVICES", description: "Passenger & Gate Services", icon: "♙", tone: "red" },
  { id: "cargo", title: "CARGO", description: "Cargo Operations", icon: "▥", tone: "navy" },
];

export default function DepartmentSelectionPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("Authorized User");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!cancelled) {
        setFullName(profile?.full_name || user.email || "Authorized User");
        setLoading(false);
      }
    }

    loadProfile();
    return () => { cancelled = true; };
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.replace("/");
  }

  function openDepartment(department: Department["id"]) {
    router.push(`/flights?department=${encodeURIComponent(department)}`);
  }

  return (
    <main className="transom-department-page">
      <header className="transom-header">
        <button className="brand" aria-label="TRANSOM home" onClick={() => router.push("/dashboard")}>
          <span className="brand-name">TR<span className="brand-a">A</span>NSOM</span>
          <span className="brand-subtitle">FLIGHT SERVICE CAPTURE</span>
        </button>

        <div className="header-actions">
          <div className="user-chip">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm-7.5 8.2c.5-3.7 3.4-5.7 7.5-5.7s7 2 7.5 5.7v.6h-15v-.6Z" fill="currentColor" /></svg>
            <span>{loading ? "Loading..." : fullName}</span>
            <span className="user-caret">⌄</span>
          </div>
          <span className="header-divider" />
          <button className="logout-button" onClick={handleLogout} disabled={loggingOut}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10M14 8l4 4-4 4M8 12h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>{loggingOut ? "LOGGING OUT..." : "LOGOUT"}</span>
          </button>
        </div>
      </header>

      <div className="page-content">
        <section className="welcome-block">
          <h1>WELCOME, {fullName}</h1>
          <span className="welcome-underline" />
          <p>SELECT DEPARTMENT</p>
        </section>

        <section className="department-panel" aria-labelledby="department-title">
          <div className="panel-heading">
            <div className="tile-mark" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <div>
              <h2 id="department-title">SELECT DEPARTMENT</h2>
              <p>Choose the department you want to access.</p>
            </div>
          </div>
          <div className="panel-rule"><span /></div>

          <div className="department-grid">
            {departments.map((department) => (
              <button
                className={`department-card ${department.tone}`}
                key={department.id}
                onClick={() => openDepartment(department.id)}
              >
                <span className="department-icon" aria-hidden="true">{department.icon}</span>
                <span className="department-copy">
                  <strong>{department.title}</strong>
                  <small>{department.description}</small>
                </span>
                <span className="department-arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </section>

        <footer className="transom-footer">
          <p>TRANSOM Flight Service Capture</p>
          <span />
          <small>Authorized Personnel Only</small>
        </footer>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; min-height: 100%; }
        body { font-family: Arial, Helvetica, sans-serif; }
        button { font: inherit; }
        .transom-department-page {
          min-height: 100vh;
          color: #102b4b;
          background:
            linear-gradient(180deg, rgba(3, 26, 55, .44) 0%, rgba(3, 24, 48, .55) 54%, rgba(1, 10, 19, .94) 100%),
            url('/transom-airport.jpg') center 43% / cover fixed,
            #092847;
          overflow: hidden;
          padding-bottom: 25px;
        }
        .transom-header {
          height: 80px;
          padding: 0 31px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #fff;
          background: rgba(4, 29, 59, .63);
          border-bottom: 4px solid #e51f35;
        }
        .brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          border: 0;
          padding: 0;
          color: white;
          background: transparent;
          cursor: pointer;
        }
        .brand-name { font-size: 34px; line-height: .92; letter-spacing: 2.8px; font-weight: 900; }
        .brand-a { position: relative; color: #fff; }
        .brand-a:after { content: ''; position: absolute; width: 14px; height: 3px; background: #e3263c; top: 14px; left: 2px; transform: rotate(-53deg); }
        .brand-subtitle { padding-top: 5px; font-size: 9px; letter-spacing: 3.1px; font-weight: 700; color: #d3ddea; }
        .header-actions { display: flex; align-items: center; gap: 21px; }
        .user-chip, .logout-button { display: flex; align-items: center; gap: 9px; color: #fff; font-size: 11px; font-weight: 700; }
        .user-chip svg { width: 18px; height: 18px; }
        .user-caret { padding-left: 1px; font-size: 17px; line-height: 10px; }
        .header-divider { width: 1px; height: 28px; background: rgba(255,255,255,.47); }
        .logout-button { border: 0; background: transparent; cursor: pointer; }
        .logout-button svg { width: 21px; height: 21px; }
        .logout-button:disabled { opacity: .65; cursor: wait; }
        .page-content { width: calc(100% - 64px); max-width: 1320px; margin: 49px auto 0; }
        .welcome-block { color: white; margin: 0 7px 28px; text-shadow: 0 1px 9px rgba(0,0,0,.16); }
        .welcome-block h1 { margin: 0; font-weight: 900; font-size: clamp(27px, 3vw, 35px); letter-spacing: .15px; line-height: 1.18; }
        .welcome-underline { width: 69px; height: 4px; display: block; background: #ee1e35; margin-top: 10px; }
        .welcome-block p { margin: 12px 0 0 3px; font-size: 13px; letter-spacing: 1.65px; font-weight: 800; color: #e3ebf5; }
        .department-panel { padding: 22px 21px 19px; border-radius: 9px; background: rgba(255,255,255,.97); box-shadow: 0 12px 35px rgba(0,0,0,.23); }
        .panel-heading { display: flex; align-items: center; gap: 16px; }
        .tile-mark { display: grid; grid-template-columns: repeat(3, 7px); grid-template-rows: repeat(3, 7px); gap: 3px; flex: 0 0 auto; }
        .tile-mark i { border-radius: 2px; background: #163657; }
        .tile-mark i:nth-child(3n), .tile-mark i:nth-child(5), .tile-mark i:nth-child(7) { background: #e3263c; }
        .panel-heading h2 { color: #132f51; font-size: 25px; font-weight: 900; margin: 0; letter-spacing: -.25px; line-height: 1.15; }
        .panel-heading p { margin: 6px 0 0; font-size: 12px; color: #77869a; }
        .panel-rule { height: 3px; margin: 13px 0 21px; background: #e0e4e9; }
        .panel-rule span { display: block; width: 58%; max-width: 560px; height: 3px; background: linear-gradient(90deg, #df2339 0%, #df2339 19%, #1c5f9a 19%, #1c5f9a 100%); }
        .department-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; align-items: stretch; }
        .department-card { position: relative; display: flex; min-width: 0; min-height: 150px; flex-direction: column; align-items: flex-start; text-align: left; padding: 11px 18px 16px; border-radius: 7px; border: 1px solid #d9dfe7; border-left: 7px solid var(--accent); background: linear-gradient(145deg, #fff 0%, #f7f8fa 100%); cursor: pointer; color: #102d50; transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease; }
        .department-card.red { --accent: #e21f36; }
        .department-card.navy { --accent: #082b50; }
        .department-card.blue { --accent: #1768aa; }
        .department-card:hover { transform: translateY(-3px); box-shadow: 0 8px 18px rgba(14,42,72,.13); border-color: #b7c5d5; }
        .department-card:focus-visible { outline: 3px solid #57a4e8; outline-offset: 3px; }
        .department-icon { width: 66px; height: 66px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; background: var(--accent); color: white; font-weight: 800; font-size: 31px; margin-bottom: 10px; }
        .department-copy { display: block; padding-right: 30px; max-width: 100%; }
        .department-copy strong { display: block; font-size: 16px; line-height: 1.2; font-weight: 900; white-space: normal; }
        .department-copy small { display: block; margin-top: 5px; font-size: 11px; color: #728095; line-height: 1.35; }
        .department-arrow { position: absolute; width: 32px; height: 32px; right: 12px; bottom: 14px; border-radius: 50%; background: #073769; color: white; display: grid; place-items: center; font-size: 23px; font-weight: 400; line-height: 1; }
        .transom-footer { display: flex; align-items: center; flex-direction: column; color: rgba(255,255,255,.86); margin-top: 70px; text-align: center; text-shadow: 0 1px 6px rgba(0,0,0,.45); }
        .transom-footer p { margin: 0; font-size: 10px; font-weight: 700; }
        .transom-footer span { width: 95px; height: 3px; margin: 7px 0 8px; background: #e3263c; }
        .transom-footer small { font-size: 10px; color: #d4dce8; }
        @media (max-width: 980px) {
          .page-content { margin-top: 34px; }
          .department-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .department-card { min-height: 145px; }
          .transom-footer { margin-top: 45px; }
        }
        @media (max-width: 600px) {
          .transom-department-page { background-attachment: scroll; }
          .transom-header { height: 72px; padding: 0 15px; }
          .brand-name { font-size: 23px; letter-spacing: 1.6px; }
          .brand-subtitle { font-size: 7px; letter-spacing: 1.9px; }
          .header-actions { gap: 10px; }
          .user-chip { max-width: 105px; gap: 5px; font-size: 10px; }
          .user-chip span:nth-child(2) { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
          .user-chip svg { width: 15px; height: 15px; }
          .user-caret, .header-divider { display: none; }
          .logout-button { gap: 4px; font-size: 9px; }
          .logout-button svg { width: 17px; height: 17px; }
          .page-content { width: calc(100% - 24px); margin-top: 32px; }
          .welcome-block { margin: 0 3px 20px; }
          .welcome-block h1 { font-size: 26px; }
          .welcome-block p { font-size: 11px; }
          .department-panel { padding: 18px 13px 14px; }
          .panel-heading { gap: 11px; }
          .panel-heading h2 { font-size: 19px; }
          .panel-heading p { font-size: 10px; }
          .panel-rule { margin: 13px 0 15px; }
          .department-grid { grid-template-columns: 1fr; gap: 11px; }
          .department-card { min-height: 126px; padding: 10px 13px 12px; }
          .department-icon { width: 55px; height: 55px; font-size: 27px; margin-bottom: 8px; }
          .department-copy strong { font-size: 15px; }
          .department-copy small { font-size: 10px; }
          .department-arrow { width: 29px; height: 29px; right: 11px; bottom: 12px; }
          .transom-footer { margin-top: 34px; }
        }
      `}</style>
    </main>
  );
}
