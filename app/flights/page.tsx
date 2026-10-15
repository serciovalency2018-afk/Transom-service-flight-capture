}

          .flight-card {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .flight-card > div {
            border-right: none;

            border-bottom: 1px solid #e1e6ec;
          }

          .service-grid {
            grid-template-columns: 1fr;
          }

          .field-grid {
            grid-template-columns: 1fr;
          }

          .status-buttons {
            display: grid;

            grid-template-columns: 1fr 1fr;
          }

          .status-control {
            width: 100%;
          }

          .save-area {
            justify-content: stretch;
          }

          .save-button {
            width: 100%;
          }

          .bottom-area {
            flex-direction: column;

            text-align: center;

            gap: 10px;
          }

          .back-button {
            width: 100%;
          }
        }

      `}</style>
    </>
  );
}

/* =========================================================
   DEPARTMENT HEADING
========================================================= */

function DepartmentHeading({
  icon,
  title,
  description,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  color: "red" | "navy" | "blue";
}) {
  return (
    <div className="department-heading">

      <div
        className={`department-heading-icon ${color}`}
      >
        {icon}
      </div>

      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="transom-loading">
          <div className="loading-card">
            <div className="loading-logo">
              TRANSOM
            </div>
            LOADING...
          </div>
        </div>
      }
    >
      <FlightCapturePage />
    </Suspense>
  );
}
