import { useEffect, useState } from "react";
import "../App.css";

function MyApplications({ onBack }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  // ================= GET MY APPLICATIONS =================

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/applications/my",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("My applications:", data);

      if (!response.ok) {
        setError(
          data.message || "Unable to load applications."
        );
        setLoading(false);
        return;
      }

      setApplications(data);

    } catch (error) {
      console.error("Applications error:", error);
      setError("Unable to connect to server.");
    }

    setLoading(false);
  };


  // ================= LOADING =================

  if (loading) {
    return (
      <div className="applications-page">
        <h2>Loading applications...</h2>
      </div>
    );
  }


  // ================= PAGE =================

  return (
    <div className="applications-page">

      <div className="applications-header">

        <button
          className="secondary-btn"
          onClick={onBack}
          style={{
            marginBottom: "20px",
          }}
        >
          ← Back to Dashboard
        </button>


        <h1>
          My Applications
        </h1>

        <p>
          Track the status of your job applications.
        </p>

      </div>


      {/* ================= ERROR ================= */}

      {error && (
        <div className="login-error">
          {error}
        </div>
      )}


      {/* ================= NO APPLICATIONS ================= */}

      {!error && applications.length === 0 && (
        <div className="no-applications">

          <h2>
            No Applications Yet
          </h2>

          <p>
            You have not applied for any jobs yet.
          </p>

        </div>
      )}


      {/* ================= APPLICATIONS ================= */}

      <div className="applications-list">

        {applications.map((application) => (

          <div
            className="application-card"
            key={application._id}
          >

            <div className="application-info">

              <h2>
                {application.job?.role}
              </h2>

              <h3>
                {application.job?.company}
              </h3>

              <p>
                📍 {application.job?.location}
              </p>

              <p>
                💰 ₹{application.job?.salary}
              </p>

              <p>
                📅 Applied on:{" "}
                {new Date(
                  application.createdAt
                ).toLocaleDateString()}
              </p>

            </div>


            <div className="application-status">

              <span
                className={`status-${application.status.toLowerCase()}`}
              >
                {application.status}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default MyApplications;