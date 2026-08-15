import { useEffect, useState } from "react";
import "../App.css";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/students/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStudent(data);
      }
    } catch (error) {
      console.error("Failed to fetch student profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };

  return (
    <div className="dashboard">

      <nav className="dashboard-navbar">

        <h2>Student Placement Portal</h2>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>


      <main className="dashboard-content">

        <h1>
          Welcome, {user?.name || "Student"} 👋
        </h1>

        <p className="dashboard-subtitle">
          Manage your profile, explore jobs and track your applications.
        </p>


        {student && (
          <div className="profile-card">

            <h2>My Profile</h2>

            <div className="profile-grid">

              <div>
                <strong>Roll Number</strong>
                <span>{student.rollNumber}</span>
              </div>

              <div>
                <strong>Branch</strong>
                <span>{student.branch}</span>
              </div>

              <div>
                <strong>Year</strong>
                <span>{student.year}</span>
              </div>

              <div>
                <strong>CGPA</strong>
                <span>{student.cgpa}</span>
              </div>

              <div>
                <strong>Phone</strong>
                <span>{student.phone}</span>
              </div>

              <div>
                <strong>Placement Status</strong>
                <span>{student.placementStatus}</span>
              </div>

            </div>

          </div>
        )}


        <div className="dashboard-cards">

          <div className="dashboard-card">
            <h3>💼 Available Jobs</h3>
            <p>
              Browse jobs and find placement opportunities.
            </p>

            <button className="primary-btn">
              View Jobs
            </button>
          </div>


          <div className="dashboard-card">
            <h3>📄 My Applications</h3>
            <p>
              Track the status of your job applications.
            </p>

            <button className="primary-btn">
              View Applications
            </button>
          </div>


          <div className="dashboard-card">
            <h3>👤 My Profile</h3>
            <p>
              View and update your student information.
            </p>

            <button className="primary-btn">
              View Profile
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}

export default StudentDashboard;