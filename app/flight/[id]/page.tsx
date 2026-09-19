* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  font-family: Arial, Helvetica, sans-serif;
}

body {
  color: #071d3b;
  background: #071d3b;
}

/* =========================================================
   MAIN PAGE
========================================================= */

.dashboard-page {
  min-height: 100vh;
  background:
    linear-gradient(
      135deg,
      rgba(4, 28, 61, 0.98),
      rgba(8, 45, 91, 0.96)
    );
  padding: 0;
}

/* =========================================================
   HEADER
========================================================= */

.dashboard-header {
  width: 100%;
  min-height: 82px;
  padding: 18px 28px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #061d3b;
  border-bottom: 4px solid #e31837;

  position: sticky;
  top: 0;
  z-index: 20;
}

.dashboard-logo {
  color: white;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 2px;
}

.dashboard-subtitle {
  margin-top: 3px;
  color: #b9c7d8;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
}

.logout-button {
  border: 1px solid rgba(255,255,255,0.25);
  background: transparent;
  color: white;

  padding: 11px 18px;
  border-radius: 8px;

  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;

  cursor: pointer;
}

.logout-button:hover {
  background: rgba(255,255,255,0.08);
}

/* =========================================================
   CONTENT
========================================================= */

.dashboard-content {
  width: min(1180px, calc(100% - 32px));
  margin: 28px auto 50px;
}

/* =========================================================
   WELCOME
========================================================= */

.welcome-section {
  background: #f4f6f9;
  border-radius: 26px 26px 0 0;
  padding: 34px 42px 26px;
}

.welcome-section h1 {
  margin: 0;
  color: #08264b;
  font-size: 30px;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.welcome-section p {
  margin: 8px 0 0;
  color: #737d8c;
  font-size: 17px;
  font-weight: 500;
}

/* =========================================================
   FLIGHT INFORMATION
========================================================= */

.flights-section {
  margin-top: 16px;
}

.flight-info-card,
.flight-status-panel,
.form-section,
.capture-card,
.empty-state {
  background: #f4f6f9;
  border-radius: 24px;
  padding: 28px;
  border: 1px solid rgba(7, 29, 59, 0.08);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
}

.flight-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.flight-info-grid > div {
  background: white;
  border: 1px solid #dfe4eb;
  border-radius: 14px;
  padding: 18px;
}

.flight-info-grid span {
  display: block;
  color: #7a8493;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.flight-info-grid strong {
  display: block;
  color: #08264b;
  font-size: 18px;
}

/* =========================================================
   FLIGHT STATUS
========================================================= */

.flight-status-panel {
  background: white;
}

.status-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.status-panel-header h2 {
  margin: 0;
  color: #08264b;
  font-size: 20px;
  font-weight: 900;
}

.status-panel-header p {
  margin: 6px 0 0;
  color: #778190;
  font-size: 14px;
}

.flight-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 145px;
  padding: 11px 16px;

  border-radius: 10px;

  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.open-status {
  background: white;
  color: #071d3b;
  border: 2px solid #071d3b;
}

.progress-status {
  background: #071d3b;
  color: white;
}

.no-delay-status {
  background: #1b9b59;
  color: white;
}

.delay-status {
  background: #e31837;
  color: white;
}

.status-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.status-actions button {
  min-width: 150px;
  min-height: 46px;

  border-radius: 9px;

  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.8px;

  cursor: pointer;
}

.open-flight-button {
  background: white;
  color: #071d3b;
  border: 2px solid #071d3b;
}

.progress-flight-button {
  background: #071d3b;
  color: white;
  border: 2px solid #071d3b;
}

.close-flight-button {
  background: #e31837;
  color: white;
  border: 2px solid #e31837;
}

.status-actions button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.status-help {
  margin: 18px 0 0;
  color: #7a8493;
  font-size: 12px;
  line-height: 1.6;
}

/* =========================================================
   FORM SECTION
========================================================= */

.form-section {
  background: #f1f3f7;
  padding: 32px;
}

.section-heading {
  margin-bottom: 24px;
}

.section-heading h2 {
  margin: 0;
  color: #08264b;
  font-size: 28px;
  font-weight: 900;
}

.section-heading p {
  margin: 8px 0 0;
  color: #7a8493;
  font-size: 16px;
}

/* =========================================================
   FORM GRID
========================================================= */

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

/* =========================================================
   FORM GROUP
========================================================= */

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin: 0 0 8px 2px;

  color: #112c50;
  font-size: 13px;
  font-weight: 800;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;

  border: 1px solid #d9dee6;
  background: white;

  color: #102947;

  border-radius: 12px;

  padding: 14px 15px;

  font-size: 15px;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input {
  min-height: 52px;
}

.form-group textarea {
  resize: vertical;
  min-height: 105px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #0b3a70;
  box-shadow: 0 0 0 3px rgba(11, 58, 112, 0.10);
}

/* =========================================================
   SERVICE TIME CARD
========================================================= */

.service-time-card {
  background: white;

  border: 1px solid #dfe4eb;
  border-radius: 18px;

  padding: 24px;

  margin-top: 20px;
  margin-bottom: 20px;

  box-shadow: 0 3px 12px rgba(7,29,59,0.06);
}

.service-time-card h4 {
  margin: 0 0 20px;

  color: #08264b;

  font-size: 21px;
  font-weight: 900;
  letter-spacing: 0.3px;
}

.service-time-card .form-grid {
  align-items: start;
}

.service-time-card .form-grid > .form-group:last-child {
  max-width: 360px;
}

.service-time-card .form-grid > .form-group:last-child input {
  background: #edf1f7;
  color: #102947;
  font-weight: 800;
}

/* =========================================================
   RAMP STATUS
========================================================= */

.mini-status-section {
  background: white;

  border: 1px solid #dfe4eb;
  border-radius: 18px;

  padding: 24px;

  margin-bottom: 20px;

  box-shadow: 0 3px 12px rgba(7,29,59,0.06);
}

.mini-status-section h3 {
  margin: 0 0 20px;

  color: #08264b;

  font-size: 20px;
  font-weight: 900;
}

.status-button-row {
  display: flex;
  gap: 16px;
}

.status-option {
  min-width: 185px;
  min-height: 48px;

  background: white;
  color: #112c50;

  border: 2px solid #d8dde5;
  border-radius: 10px;

  font-size: 14px;
  font-weight: 900;

  cursor: pointer;
}

.status-option:hover {
  border-color: #08264b;
}

.status-option.active-status {
  background: #08264b;
  color: white;
  border-color: #08264b;
}

/* =========================================================
   SAVE BUTTON
========================================================= */

.save-button {
  width: 100%;

  margin-top: 26px;

  min-height: 55px;

  border: none;
  border-radius: 11px;

  background: #08264b;
  color: white;

  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.7px;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.save-button:hover {
  background: #0b3768;
}

.save-button:active {
  transform: scale(0.99);
}

.save-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* =========================================================
   MANAGEMENT CAPTURES
========================================================= */

.capture-list {
  display: grid;
  gap: 12px;
}

.capture-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  padding: 20px;

  background: white;
}

.capture-card > div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.capture-card strong {
  color: #08264b;
}

.capture-card span {
  color: #7a8493;
  font-size: 12px;
}

.select-flight-button {
  border: 1px solid #08264b;
  background: #08264b;
  color: white;

  padding: 11px 16px;

  border-radius: 8px;

  font-size: 11px;
  font-weight: 900;

  cursor: pointer;
}

/* =========================================================
   EMPTY STATE
========================================================= */

.empty-state {
  color: #6e7887;
  text-align: center;
}

/* =========================================================
   BOTTOM ACTIONS
========================================================= */

.bottom-actions {
  margin-top: 24px;
}

.back-button {
  width: 100%;

  min-height: 48px;

  background: rgba(255,255,255,0.96);
  color: #08264b;

  border: none;
  border-radius: 10px;

  font-size: 13px;
  font-weight: 900;

  cursor: pointer;
}

.back-button:hover {
  background: white;
}

/* =========================================================
   FOOTER
========================================================= */

.dashboard-footer {
  padding: 25px 20px 35px;

  text-align: center;

  color: #aebbd0;

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

/* =========================================================
   MOBILE / TABLET
========================================================= */

@media (max-width: 800px) {
  .dashboard-header {
    min-height: 72px;
    padding: 14px 18px;
  }

  .dashboard-logo {
    font-size: 22px;
  }

  .dashboard-subtitle {
    font-size: 9px;
  }

  .logout-button {
    padding: 9px 12px;
    font-size: 10px;
  }

  .dashboard-content {
    width: calc(100% - 20px);
    margin-top: 15px;
  }

  .welcome-section {
    padding: 28px 22px 22px;
    border-radius: 22px 22px 0 0;
  }

  .welcome-section h1 {
    font-size: 25px;
  }

  .welcome-section p {
    font-size: 14px;
  }

  .flight-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .flight-info-card,
  .flight-status-panel,
  .form-section {
    padding: 20px;
    border-radius: 20px;
  }

  .status-panel-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .status-actions {
    flex-direction: column;
  }

  .status-actions button {
    width: 100%;
  }

  .form-section {
    padding: 18px;
  }

  .section-heading h2 {
    font-size: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .service-time-card {
    padding: 20px;
    border-radius: 17px;
  }

  .service-time-card .form-grid > .form-group:last-child {
    max-width: 100%;
  }

  .status-button-row {
    flex-direction: column;
  }

  .status-option {
    width: 100%;
  }

  .capture-card {
    flex-direction: column;
    align-items: stretch;
  }

  .select-flight-button {
    width: 100%;
  }
}

/* =========================================================
   SMALL PHONES
========================================================= */

@media (max-width: 480px) {
  .dashboard-content {
    width: calc(100% - 12px);
  }

  .flight-info-grid {
    grid-template-columns: 1fr;
  }

  .welcome-section h1 {
    font-size: 22px;
  }

  .section-heading h2 {
    font-size: 22px;
  }

  .service-time-card h4 {
    font-size: 19px;
  }
}
