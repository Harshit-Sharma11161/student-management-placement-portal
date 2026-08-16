import { useEffect, useState } from "react";
import Jobs from "./Jobs";
import MyApplications from "./MyApplications";
import StudentProfile from "./StudentProfile";
import "../App.css";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);

  const [showJobs, setShowJobs] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);


  // ================= LOAD USER =================

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    fetchStudentProfile();
  }, []);


  // ================= GET STUDENT PROFILE =================

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/students/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStudent(data);
      }

    } catch (error) {
      console.error(
        "Failed to fetch student profile:",
        error
      );
    }
  };


  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };


  // ================= PAGE NAVIGATION =================

  // ---------- JOBS ----------

  if (showJobs) {
    return (
      <Jobs
        onBack={() => {
          setShowJobs(false);
        }}
      />
    );
  }


  // ---------- APPLICATIONS ----------

  if (showApplications) {
    return (
      <MyApplications
        onBack={() => {
          setShowApplications(false);
        }}
      />
    );
  }


  // ---------- PROFILE ----------

  if (showProfile) {
    return (
      <StudentProfile
        onBack={() => {
          setShowProfile(false);
          fetchStudentProfile();
        }}
      />
    );
  }


  // ================= DASHBOARD =================

  return (
    <div className="dashboard">


      {/* ================= NAVBAR ================= */}

      <nav className="dashboard-navbar">

        <h2>
          Student Placement Portal
        </h2>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>


      {/* ================= MAIN CONTENT ================= */}

      <main className="dashboard-content">

        <h1>
          Welcome, {user?.name || "Student"} 👋
        </h1>

        <p className="dashboard-subtitle">
          Manage your profile, explore jobs
          and track your applications.
        </p>


        {/* ================= PROFILE SUMMARY ================= */}

        {student && (

          <div className="profile-card">

            <h2>
              My Profile
            </h2>

            <div className="profile-grid">


              <div>

                <strong>
                  Roll Number
                </strong>

                <span>
                  {student.rollNumber || "Not added"}
                </span>

              </div>


              <div>

                <strong>
                  Branch
                </strong>

                <span>
                  {student.branch || "Not added"}
                </span>

              </div>


              <div>

                <strong>
                  Year
                </strong>

                <span>
                  {student.year || "Not added"}
                </span>

              </div>


              <div>

                <strong>
                  CGPA
                </strong>

                <span>
                  {student.cgpa || "Not added"}
                </span>

              </div>


              <div>

                <strong>
                  Phone
                </strong>

                <span>
                  {student.phone || "Not added"}
                </span>

              </div>


              <div>

                <strong>
                  Placement Status
                </strong>

                <span>
                  {student.placementStatus ||
                    "Not Placed"}
                </span>

              </div>


            </div>

          </div>

        )}


        {/* ================= DASHBOARD CARDS ================= */}

        <div className="dashboard-cards">


          {/* ================= JOBS ================= */}

          <div className="dashboard-card">

            <h3>
              💼 Available Jobs
            </h3>

            <p>
              Browse jobs and find placement
              opportunities.
            </p>

            <button
              className="primary-btn"
              onClick={() => {

                setShowJobs(true);

                setShowApplications(false);

                setShowProfile(false);

              }}
            >
              View Jobs
            </button>

          </div>


          {/* ================= APPLICATIONS ================= */}

          <div className="dashboard-card">

            <h3>
              📄 My Applications
            </h3>

            <p>
              Track the status of your job
              applications.
            </p>

            <button
              className="primary-btn"
              onClick={() => {

                setShowApplications(true);

                setShowJobs(false);

                setShowProfile(false);

              }}
            >
              View Applications
            </button>

          </div>


          {/* ================= PROFILE ================= */}

          <div className="dashboard-card">

            <h3>
              👤 My Profile
            </h3>

            <p>
              View and update your student
              information.
            </p>

            <button
              className="primary-btn"
              onClick={() => {

                setShowProfile(true);

                setShowJobs(false);

                setShowApplications(false);

              }}
            >
              View Profile
            </button>

          </div>


        </div>

      </main>

    </div>
  );
}

export default StudentDashboard;