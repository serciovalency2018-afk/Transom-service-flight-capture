"use client";

import { useState } from "react";

type Flight = {
  id: number;
  flightNo: string;
  date: string;
  regType: string;
  svcType: string;
  gate: string;
  sta: string;
  std: string;
  eta: string;
  etd: string;
  td: string;
  atd: string;
  ata: string;
  origin: string;
  destination: string;
  cd: boolean;
  pax: string;
};

const initialFlights: Flight[] = [
  {
    id: 1,
    flightNo: "ET 802",
    date: "02/07",
    regType: "B738",
    svcType: "J",
    gate: "-",
    sta: "1755",
    std: "1845",
    eta: "-",
    etd: "-",
    td: "-",
    atd: "-",
    ata: "-",
    origin: "DAR",
    destination: "ADD",
    cd: false,
    pax: "",
  },
  {
    id: 2,
    flightNo: "ET 804",
    date: "02/07",
    regType: "B738",
    svcType: "J",
    gate: "-",
    sta: "-",
    std: "-",
    eta: "-",
    etd: "-",
    td: "-",
    atd: "-",
    ata: "-",
    origin: "DAR",
    destination: "ADD",
    cd: false,
    pax: "",
  },
  {
    id: 3,
    flightNo: "",
    date: "",
    regType: "CRJ",
    svcType: "J",
    gate: "-",
    sta: "0050",
    std: "",
    eta: "-",
    etd: "-",
    td: "-",
    atd: "-",
    ata: "-",
    origin: "",
    destination: "EBB",
    cd: false,
    pax: "",
  },
];

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>(initialFlights);

  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const [location, setLocation] = useState("DAR Load Control");
  const [timeMode, setTimeMode] = useState("LT");
  const [view, setView] = useState("Table");

  const [date, setDate] = useState("2026-07-02");
  const [filter, setFilter] = useState("");

  const [showAddFlight, setShowAddFlight] = useState(false);
  const [showServices, setShowServices] = useState(false);

  const [newFlightNo, setNewFlightNo] = useState("");
  const [newDestination, setNewDestination] = useState("");

  const updateFlight = (
    id: number,
    field: keyof Flight,
    value: string | boolean
  ) => {
    setFlights((current) =>
      current.map((flight) =>
        flight.id === id ? { ...flight, [field]: value } : flight
      )
    );
  };

  const addFlight = () => {
    if (!newFlightNo.trim()) return;

    const newFlight: Flight = {
      id: Date.now(),
      flightNo: newFlightNo.toUpperCase(),
      date: "02/07",
      regType: "B738",
      svcType: "J",
      gate: "-",
      sta: "-",
      std: "-",
      eta: "-",
      etd: "-",
      td: "-",
      atd: "-",
      ata: "-",
      origin: "DAR",
      destination: newDestination.toUpperCase() || "ADD",
      cd: false,
      pax: "",
    };

    setFlights((current) => [...current, newFlight]);

    setNewFlightNo("");
    setNewDestination("");
    setShowAddFlight(false);
  };

  const filteredFlights = flights.filter((flight) => {
    const search = filter.toLowerCase();

    return (
      flight.flightNo.toLowerCase().includes(search) ||
      flight.origin.toLowerCase().includes(search) ||
      flight.destination.toLowerCase().includes(search)
    );
  });

  return (
    <main className="app">

      {/* ================= HEADER ================= */}

      <header className="topHeader">

        <div className="brand">

          <div className="planeLogo">
            ✈
          </div>

          <div className="brandText">
            <div className="brandName">TRANSOM</div>
            <div className="brandSub">
              FLIGHT SERVICE CAPTURE
            </div>
          </div>

        </div>

        <div className="motto">
          SAFE FLIGHTS
          <span>|</span>
          ON TIME
          <span>|</span>
          TOGETHER
        </div>

      </header>


      {/* ================= CONTROL BAR ================= */}

      <section className="controlArea">

        <div className="redPanel">

          <h1>FLIGHT SERVICE CAPTURE</h1>

          <div className="dateInfo">
            02-Jul-2026&nbsp;&nbsp;16:17 UTC
            <span>|</span>
            02-Jul-2026&nbsp;&nbsp;19:17 LT DAR
          </div>

          <div className="redMenu">

            <button onClick={() => alert("Menu opened")}>
              MENU
            </button>

            <button onClick={() => selectedFlight && alert(
              `Selected flight: ${selectedFlight.flightNo}`
            )}>
              {selectedFlight?.flightNo || "dm1216"}
            </button>

            <button onClick={() => alert("Logout clicked")}>
              LOGOUT
            </button>

          </div>

        </div>


        <div className="blueControls">

          <div className="controlRow">

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option>DAR Load Control</option>
              <option>DAR Ramp</option>
              <option>DAR Passenger Services</option>
              <option>DAR Baggage</option>
              <option>Zanzibar Operations</option>
            </select>


            <select
              className="timeSelect"
              value={timeMode}
              onChange={(e) => setTimeMode(e.target.value)}
            >
              <option>LT</option>
              <option>UTC</option>
            </select>


            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
            >
              <option>Table</option>
              <option>List</option>
              <option>Summary</option>
            </select>

          </div>


          <div className="controlRow second">

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button
              className="playButton"
              onClick={() => alert("Flight view started")}
            >
              ▶
            </button>

            <div className="searchBox">

              <input
                placeholder="Filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />

              <span>⌕</span>

            </div>

          </div>


          <div className="actionButtons">

            <button onClick={() => alert("Daily view")}>
              Daily
            </button>

            <button onClick={() => setShowServices(true)}>
              Gen Services
            </button>

            <button onClick={() => setShowAddFlight(true)}>
              Add Flight
            </button>

            <button
              onClick={() =>
                selectedFlight
                  ? alert(`Linking ${selectedFlight.flightNo}`)
                  : alert("Select a flight first")
              }
            >
              Link Flight
            </button>

          </div>

        </div>

      </section>


      {/* ================= FLIGHT TABLE ================= */}

      <section className="tableContainer">

        <table>

          <thead>

            <tr>

              <th className="plusColumn"></th>

              <th>Flight N° <b>*</b></th>
              <th>Date</th>
              <th>Reg.<br />Type <b>*</b></th>
              <th>S/VC<br />Type <b>*</b></th>
              <th>Gate</th>
              <th>STA<br />STD <b>*</b></th>
              <th>ETA<br />ETD</th>
              <th>TD<br />ATD <b>*</b></th>
              <th>ATA<br />TOT <b>*</b></th>
              <th>Orig<br />Dest <b>*</b></th>
              <th>CD<br />2-4</th>
              <th>PAX*/INF</th>

            </tr>

          </thead>


          <tbody>

            {filteredFlights.map((flight) => (

              <tr
                key={flight.id}
                className={
                  selectedFlight?.id === flight.id
                    ? "selectedRow"
                    : ""
                }
              >

                {/* PLUS */}

                <td className="plusCell">

                  <button
                    className="plusButton"
                    onClick={() => setSelectedFlight(flight)}
                  >
                    +
                  </button>

                </td>


                {/* FLIGHT NUMBER */}

                <td>

                  <input
                    value={flight.flightNo}
                    placeholder="Flight No"
                    onChange={(e) =>
                      updateFlight(
                        flight.id,
                        "flightNo",
                        e.target.value
                      )
                    }
                    onClick={() => setSelectedFlight(flight)}
                  />

                </td>


                {/* DATE */}

                <td>

                  <input
                    value={flight.date}
                    onChange={(e) =>
                      updateFlight(
                        flight.id,
                        "date",
                        e.target.value
                      )
                    }
                  />

                </td>


                {/* REG TYPE */}

                <td>

                  <select
                    value={flight.regType}
                    onChange={(e) =>
                      updateFlight(
                        flight.id,
                        "regType",
                        e.target.value
                      )
                    }
                  >
                    <option>B738</option>
                    <option>B737</option>
                    <option>B767</option>
                    <option>A320</option>
                    <option>A330</option>
                    <option>CRJ</option>
                    <option>Q400</option>
                  </select>

                </td>


                {/* SERVICE TYPE */}

                <td>

                  <select
                    value={flight.svcType}
                    onChange={(e) =>
                      updateFlight(
                        flight.id,
                        "svcType",
                        e.target.value
                      )
                    }
                  >
                    <option>J</option>
                    <option>C</option>
                    <option>Y</option>
                    <option>F</option>
                  </select>

                </td>


                {/* GATE */}

                <td>

                  <input
                    value={flight.gate}
                    onChange={(e) =>
                      updateFlight(
                        flight.id,
                        "gate",
                        e.target.value
                      )
                    }
                  />

                </td>


                {/* STA / STD */}

                <td>

                  <input
                    value={flight.sta}
                    onChange={(e) =>
                      updateFlight(
                        flight.id,
                        "sta",
                        e.target.value
                      )
                    }
                  />

                  <input
                    value={flight.std}
                    onChange={(e) =>
                      updateFlight(
                        flight.id,
                        "std",
                        e.target.value
                      )
                    }
                  />

                </td>


                {/* ETA / ETD */}

                <td>

                  <input
                    value={flight.eta}
                    onChange={(e) =>
                      updateFlight(
                        flight.id,
                        "eta",
                        e.target.value
                      )
                    }
                  />

                  <input
                    value={flight.etd}
                    onChange={(e) =>
                      updateFlight(
                        flight.id,
                        "etd",
                        e.target.value
                      )
                    }
                  />

                </td>


                {/* TD / ATD */}

                <td>

                  <input
                    value={flight.td}
                    onChange={(e) =>
                      updateFlight(
                        flight.id,
                        "td",
                        e.target.value
                      )
                    }
                  />

                  <input
                    value={flight.atd}
                    onChange={(e) =>
                      updateFlight(
                        flight.id,
                        "atd",
                        e.target.value
                      )
                    }
                  />

                </td>


                {/* ATA */}

                <td>

                  <input
                    value={flight.ata}
                    onChange={(e) =>
                      updateFlight(
                        flight.id,
                        "ata",
                        e.target.value
                      )
                    }
                  />

                  <input
                    value="-"
                    readOnly
                  />

                </td>


                {/* ORIGIN / DEST */}

                <td>

                  <button
                    className="addDestination"
                    onClick={() => {
                      setSelectedFlight(flight);
                      alert(
                        `Origin: ${flight.origin}\nDestination: ${flight.destination}`
                      );
                    }}
                  >
                    {flight.origin || "ADD"}
                  </button>

                  <button
                    className="addDestination"
                    onClick={() => setSelectedFlight(flight)}
                  >
                    {flight.destination || "ADD"}
                  </button>

                </td>


                {/* CD */}

                <td className="checkboxCell">

                  <input
                    type="checkbox"
                    checked={flight.cd}
                    onChange={(e) =>
                      updateFlight(
                        flight.id,
                        "cd",
                        e.target.checked
                      )
                    }
                  />

                </td>


                {/* PAX */}

                <td>

                  <input
                    value={flight.pax}
                    onChange={(e) =>
                      updateFlight(
                        flight.id,
                        "pax",
                        e.target.value
                      )
                    }
                  />

                </td>

              </tr>

            ))}

          </tbody>

        </table>


        {/* ================= SELECTED FLIGHT ================= */}

        {selectedFlight && (

          <div className="selectedFlightPanel">

            <div>
              <strong>
                Selected Flight:
              </strong>{" "}
              {selectedFlight.flightNo || "Unnamed Flight"}
            </div>

            <div>
              Route:{" "}
              {selectedFlight.origin} →{" "}
              {selectedFlight.destination}
            </div>

            <button
              onClick={() => setShowServices(true)}
            >
              OPEN SERVICE CAPTURE
            </button>

            <button
              className="closeSelected"
              onClick={() => setSelectedFlight(null)}
            >
              CLOSE
            </button>

          </div>

        )}

      </section>


      {/* ================= SUMMARY ================= */}

      <section className="summary">

        <div>
          <span>1</span>
          Flight on file
        </div>

        <div>
          <span>{flights.length}</span>
          Aircrafts
        </div>

        <div>
          <span>3</span>
          Departures
        </div>

        <div>
          <span>{flights.length}</span>
          Totals (on file)
        </div>

        <div>
          <span>{flights.length}</span>
          Total Flights
        </div>

        <div>
          <span>6</span>
          Flight on time view
        </div>

        <div>
          <span>7</span>
          Arrivals
        </div>

        <div>
          <span>8</span>
          Departures
        </div>

        <div>
          <span>9</span>
          Total Turnar.
        </div>

        <div>
          <span>0</span>
          Total Flights
        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer>

        <div className="footerBrand">
          ✈
          <span>
            TRANSOM FLIGHT SERVICE CAPTURE
          </span>
        </div>

        <div className="footerIcons">
          ⚙
          📊
          ?
        </div>

      </footer>


      {/* ================= ADD FLIGHT MODAL ================= */}

      {showAddFlight && (

        <div className="modalBackground">

          <div className="modal">

            <h2>Add Flight</h2>

            <input
              placeholder="Flight Number e.g. ET 802"
              value={newFlightNo}
              onChange={(e) =>
                setNewFlightNo(e.target.value)
              }
            />

            <input
              placeholder="Destination e.g. ADD"
              value={newDestination}
              onChange={(e) =>
                setNewDestination(e.target.value)
              }
            />

            <div className="modalButtons">

              <button onClick={addFlight}>
                ADD FLIGHT
              </button>

              <button
                onClick={() => setShowAddFlight(false)}
              >
                CANCEL
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ================= SERVICES MODAL ================= */}

      {showServices && (

        <div className="modalBackground">

          <div className="modal services">

            <h2>
              General Services
            </h2>

            <p>
              {selectedFlight
                ? `Flight: ${selectedFlight.flightNo}`
                : "Select a flight"}
            </p>

            <label>
              Service
            </label>

            <select>
              <option>Ramp</option>
              <option>Passenger Services</option>
              <option>Baggage</option>
              <option>Load Control</option>
              <option>Cleaning</option>
              <option>Security</option>
            </select>

            <label>
              Status
            </label>

            <select>
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed - No Delay</option>
              <option>Closed - With Delay</option>
            </select>

            <label>
              Notes
            </label>

            <textarea
              placeholder="Enter service notes..."
            />

            <div className="modalButtons">

              <button
                onClick={() => {
                  alert("Service saved");
                  setShowServices(false);
                }}
              >
                SAVE SERVICE
              </button>

              <button
                onClick={() => setShowServices(false)}
              >
                CANCEL
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}
