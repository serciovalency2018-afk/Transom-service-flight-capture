/* =========================================================
   TRANSOM DEPARTMENT PAGE
========================================================= */

.department-page {
  min-height: 100vh;

  background:
    linear-gradient(
      rgba(3, 25, 55, 0.78),
      rgba(3, 25, 55, 0.88)
    ),
    url("/transom-airport.jpg");

  background-size: cover;
  background-position: center;
  background-attachment: fixed;

  display: flex;
  flex-direction: column;

  color: #071d35;
}


/* =========================================================
   HEADER
========================================================= */

.department-header {
  min-height: 106px;

  padding: 17px 42px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background:
    linear-gradient(
      90deg,
      #061d3b,
      #082a52
    );

  border-bottom: 5px solid #ef233c;

  box-shadow:
    0 5px 18px rgba(0, 0, 0, 0.25);

  position: relative;
  z-index: 5;
}

.transom-logo {
  color: #ffffff;

  font-size: 43px;
  line-height: 0.95;

  font-weight: 900;

  letter-spacing: 4px;
}

.transom-tagline {
  margin-top: 7px;

  color: #ffffff;

  font-size: 11px;

  letter-spacing: 4px;

  font-weight: 600;
}

.header-user-area {
  display: flex;

  align-items: center;

  gap: 24px;

  color: #ffffff;
}

.user-display {
  display: flex;

  align-items: center;

  gap: 10px;

  font-size: 14px;

  font-weight: 700;
}

.user-icon {
  width: 25px;
  height: 25px;

  display: flex;
}

.user-icon svg {
  width: 100%;
  height: 100%;
}

.header-divider {
  width: 1px;
  height: 38px;

  background: rgba(
    255,
    255,
    255,
    0.5
  );
}

.department-logout {
  display: flex;

  align-items: center;

  gap: 10px;

  border: none;

  background: transparent;

  color: #ffffff;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;
}

.department-logout svg {
  width: 24px;
  height: 24px;
}

.department-logout:hover {
  color: #ef233c;
}


/* =========================================================
   HERO
========================================================= */

.department-hero {
  min-height: 195px;

  display: flex;

  align-items: flex-start;

  padding:
    58px 50px 35px;

  background:
    linear-gradient(
      rgba(4, 32, 67, 0.18),
      rgba(4, 32, 67, 0.28)
    );
}

.hero-content h1 {
  margin: 0;

  color: #ffffff;

  font-size: 38px;

  font-weight: 800;

  letter-spacing: -0.5px;

  text-shadow:
    0 2px 8px rgba(0, 0, 0, 0.25);
}

.hero-content h1 span {
  font-weight: 700;
}

.hero-red-line {
  width: 88px;
  height: 5px;

  margin-top: 15px;

  background: #ef233c;
}

.hero-content p {
  margin: 15px 0 0;

  color: #ffffff;

  font-size: 16px;

  font-weight: 700;

  letter-spacing: 2px;
}


/* =========================================================
   MAIN PANEL
========================================================= */

.department-panel {
  width: calc(100% - 84px);

  max-width: 1360px;

  margin:
    -8px auto 0;

  padding: 30px;

  background:
    rgba(255, 255, 255, 0.97);

  border-radius: 13px;

  box-shadow:
    0 15px 45px rgba(0, 0, 0, 0.22);

  position: relative;

  z-index: 2;
}


/* =========================================================
   PANEL HEADER
========================================================= */

.panel-title-row {
  display: flex;

  align-items: center;

  gap: 20px;
}

.panel-grid-icon {
  width: 40px;

  display: grid;

  grid-template-columns:
    repeat(3, 8px);

  gap: 5px;
}

.panel-grid-icon span {
  width: 8px;
  height: 8px;

  border-radius: 2px;

  background: #082b55;
}

.panel-grid-icon span:nth-child(2),
.panel-grid-icon span:nth-child(5),
.panel-grid-icon span:nth-child(8) {
  background: #ef233c;
}

.panel-title-row h2 {
  margin: 0;

  color: #082b55;

  font-size: 29px;

  font-weight: 900;
}

.panel-title-row p {
  margin: 5px 0 0;

  color: #718096;

  font-size: 14px;
}


/* =========================================================
   COLOR LINE
========================================================= */

.department-panel-line {
  display: flex;

  width: 100%;

  height: 4px;

  margin-top: 18px;

  background: #d8dee7;
}

.department-panel-line .red-line {
  width: 140px;

  background: #ef233c;
}

.department-panel-line .blue-line {
  width: 590px;

  background: #1976c9;
}

.department-panel-line .navy-line {
  flex: 1;

  background: #cfd6df;
}


/* =========================================================
   LOGGED USER
========================================================= */

.logged-user {
  margin:
    22px 20px 27px;

  display: flex;

  flex-direction: column;

  gap: 5px;
}

.logged-user span {
  color: #718096;

  font-size: 13px;

  font-weight: 600;
}

.logged-user strong {
  color: #24354d;

  font-size: 15px;
}


/* =========================================================
   DEPARTMENT GRID
========================================================= */

.department-grid {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 18px;
}


/* =========================================================
   DEPARTMENT CARD
========================================================= */

.department-card {
  min-height: 195px;

  position: relative;

  display: flex;

  flex-direction: column;

  align-items: flex-start;

  justify-content: flex-start;

  padding: 18px 22px;

  text-align: left;

  background: #ffffff;

  border: 1px solid #d9e0e8;

  border-radius: 10px;

  cursor: pointer;

  overflow: hidden;

  box-shadow:
    0 3px 8px rgba(0, 25, 55, 0.04);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.department-card::before {
  content: "";

  position: absolute;

  left: 0;
  top: 0;
  bottom: 0;

  width: 7px;

  background: #082b55;
}

.department-card.red::before {
  background: #ef233c;
}

.department-card.blue::before {
  background: #1976c9;
}

.department-card.navy::before {
  background: #082b55;
}

.department-card:hover {
  transform: translateY(-3px);

  border-color: #aebdcd;

  box-shadow:
    0 10px 25px rgba(
      0,
      25,
      55,
      0.12
    );
}


/* =========================================================
   ICON
========================================================= */

.department-icon-wrapper {
  width: 82px;
  height: 82px;

  border-radius: 50%;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-bottom: 14px;

  background: #082b55;

  color: #ffffff;
}

.department-card.red
.department-icon-wrapper {
  background: #ef233c;
}

.department-card.blue
.department-icon-wrapper {
  background: #1976c9;
}

.department-card.navy
.department-icon-wrapper {
  background: #082b55;
}

.department-svg {
  width: 46px;
  height: 46px;
}


/* =========================================================
   CARD TEXT
========================================================= */

.department-card-content {
  padding-right: 42px;
}

.department-card-content h3 {
  margin: 0;

  color: #082b55;

  font-size: 19px;

  font-weight: 900;

  line-height: 1.2;
}

.department-card-content p {
  margin: 7px 0 0;

  color: #718096;

  font-size: 13px;

  line-height: 1.35;
}


/* =========================================================
   ARROW
========================================================= */

.department-arrow {
  position: absolute;

  right: 16px;
  bottom: 20px;

  width: 43px;
  height: 43px;

  border-radius: 50%;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #082b55;

  color: #ffffff;
}

.department-arrow svg {
  width: 22px;
  height: 22px;
}

.department-card:hover .department-arrow {
  background: #ef233c;
}


/* =========================================================
   CARGO — SECOND ROW
========================================================= */

.department-card:nth-child(5) {
  grid-column: 1;
}


/* =========================================================
   FOOTER
========================================================= */

.department-footer {
  margin-top: auto;

  padding:
    28px 20px 22px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  color: #ffffff;

  font-size: 11px;

  font-weight: 600;

  text-align: center;

  text-shadow:
    0 1px 5px rgba(0, 0, 0, 0.5);
}

.footer-red-line {
  width: 40px;
  height: 3px;

  margin: 7px 0;

  background: #ef233c;
}

.department-footer span {
  font-size: 10px;

  color: #d5deea;
}


/* =========================================================
   LOADING
========================================================= */

.department-loading {
  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #ffffff;

  font-size: 18px;

  font-weight: 700;

  background:
    linear-gradient(
      rgba(4, 24, 53, 0.86),
      rgba(4, 24, 53, 0.92)
    ),
    url("/transom-airport.jpg");

  background-size: cover;

  background-position: center;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1000px) {

  .department-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .department-card:nth-child(5) {
    grid-column: auto;
  }

  .department-header {
    padding-left: 25px;
    padding-right: 25px;
  }

  .department-panel {
    width: calc(100% - 40px);
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 650px) {

  .department-header {
    min-height: auto;

    padding: 15px;

    align-items: flex-start;
  }

  .transom-logo {
    font-size: 28px;

    letter-spacing: 2px;
  }

  .transom-tagline {
    font-size: 7px;

    letter-spacing: 2px;
  }

  .header-user-area {
    gap: 8px;
  }

  .user-display span:not(.user-icon) {
    display: none;
  }

  .header-divider {
    height: 28px;
  }

  .department-logout {
    font-size: 10px;
  }

  .department-logout svg {
    width: 19px;
    height: 19px;
  }

  .department-hero {
    min-height: 155px;

    padding:
      35px 20px 25px;
  }

  .hero-content h1 {
    font-size: 27px;
  }

  .hero-content p {
    font-size: 12px;
  }

  .department-panel {
    width: calc(100% - 24px);

    padding: 20px 15px;

    margin-top: -5px;
  }

  .panel-title-row {
    align-items: flex-start;

    gap: 12px;
  }

  .panel-title-row h2 {
    font-size: 21px;
  }

  .panel-title-row p {
    font-size: 12px;
  }

  .department-panel-line .red-line {
    width: 70px;
  }

  .department-panel-line .blue-line {
    width: 120px;
  }

  .logged-user {
    margin-left: 5px;
    margin-right: 5px;
  }

  .department-grid {
    grid-template-columns: 1fr;

    gap: 14px;
  }

  .department-card {
    min-height: 160px;
  }

  .department-footer {
    padding-top: 22px;
  }

}
