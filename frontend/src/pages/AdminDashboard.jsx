import { useEffect, useState } from "react";
import AdminJobs from "./AdminJobs";
import "../App.css";

function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJobs, setShowJobs] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  // ================= GET ALL APPLICATIONS =================

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Admin applications:", data);

      if (!response.ok) {
        setError(
          data.message || "Unable to load applications."
        );
        setLoading(false);
        return;
      }

      setApplications(data);
    } catch (error) {
      console.error("Admin applications error:", error);
      setError("Unable to connect to server.");
    }

    setLoading(false);
  };


  // ================= UPDATE APPLICATION STATUS =================

  const updateStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications/${applicationId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to update application status."
        );
        return;
      }

      alert(
        "Application status updated successfully!"
      );

      fetchApplications();

    } catch (error) {
      console.error("Status update error:", error);

      alert("Unable to connect to server.");
    }
  };


  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };


  // ================= SHOW JOB MANAGEMENT =================

  if (showJobs) {
    return <AdminJobs />;
  }


  // ================= LOADING =================

  if (loading) {
    return (
      <div className="admin-page">
        <h2>Loading admin dashboard...</h2>
      </div>
    );
  }


  // ================= DASHBOARD =================

  return (
    <div className="admin-page">

      {/* ================= NAVBAR ================= */}

      <nav className="admin-navbar">

        <h2>
          Admin Placement Portal
        </h2>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>


      {/* ================= MAIN CONTENT ================= */}

      <main className="admin-content">

        <h1>
          Admin Dashboard
        </h1>

        <p className="admin-subtitle">
          Manage student placement applications
          and job opportunities.
        </p>


        {/* ERROR */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        {/* ================= STATISTICS ================= */}

        <div className="admin-stats">

          <div className="admin-stat-card">

            <h3>
              Total Applications
            </h3>

            <strong>
              {applications.length}
            </strong>

          </div>


          <div className="admin-stat-card">

            <h3>
              Shortlisted
            </h3>

            <strong>
              {
                applications.filter(
                  (application) =>
                    application.status ===
                    "Shortlisted"
                ).length
              }
            </strong>

          </div>


          <div className="admin-stat-card">

            <h3>
              Selected
            </h3>

            <strong>
              {
                applications.filter(
                  (application) =>
                    application.status ===
                    "Selected"
                ).length
              }
            </strong>

          </div>

        </div>


        {/* ================= JOB MANAGEMENT ================= */}

        <div className="admin-job-management">

          <h2>
            Job Management
          </h2>

          <p>
            Create and manage placement
            opportunities.
          </p>

          <button
            className="primary-btn"
            onClick={() => setShowJobs(true)}
          >
            Manage Jobs
          </button>

        </div>


        {/* ================= APPLICATIONS ================= */}

        <div className="admin-applications">

          <h2>
            All Applications
          </h2>


          {applications.length === 0 ? (

            <div className="no-applications">

              <h3>
                No applications found.
              </h3>

            </div>

          ) : (

            applications.map((application) => (

              <div
                className="admin-application-card"
                key={application._id}
              >

                {/* STUDENT INFORMATION */}

                <div className="admin-student-info">

                  <h3>
                    {application.student?.user?.name ||
                      "Unknown Student"}
                  </h3>

                  <p>
                    Email:{" "}
                    {application.student?.user?.email ||
                      "N/A"}
                  </p>

                  <p>
                    Roll Number:{" "}
                    {application.student?.rollNumber ||
                      "N/A"}
                  </p>

                  <p>
                    Branch:{" "}
                    {application.student?.branch ||
                      "N/A"}
                  </p>

                  <p>
                    CGPA:{" "}
                    {application.student?.cgpa ||
                      "N/A"}
                  </p>

                </div>


                {/* JOB INFORMATION */}

                <div className="admin-job-info">

                  <h3>
                    {application.job?.role ||
                      "Unknown Job"}
                  </h3>

                  <p>
                    Company:{" "}
                    {application.job?.company ||
                      "N/A"}
                  </p>

                  <p>
                    Location:{" "}
                    {application.job?.location ||
                      "N/A"}
                  </p>

                </div>


                {/* STATUS */}

                <div className="admin-status">

                  <strong>
                    Current Status
                  </strong>

                  <span
                    className={`status-${application.status.toLowerCase()}`}
                  >
                    {application.status}
                  </span>


                  <select
                    value={application.status}
                    onChange={(e) =>
                      updateStatus(
                        application._id,
                        e.target.value
                      )
                    }
                  >

                    <option value="Applied">
                      Applied
                    </option>

                    <option value="Shortlisted">
                      Shortlisted
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>

                    <option value="Selected">
                      Selected
                    </option>

                  </select>

                </div>

              </div>

            ))

          )}

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;