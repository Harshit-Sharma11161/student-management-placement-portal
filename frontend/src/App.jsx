import { useState } from "react";
import Login from "./pages/Login";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <Login />;
  }

  return (
    <div className="app">

      <nav className="navbar">

        <div className="logo">
          Student Placement Portal
        </div>

        <div className="nav-buttons">

          <button
            className="secondary-btn"
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>

          <button className="primary-btn">
            Register
          </button>

        </div>

      </nav>


      <section className="hero-section">

        <div className="hero-content">

          <h1>
            Student Management & Placement Portal
          </h1>

          <p>
            A centralized platform for students and administrators
            to manage student profiles, job opportunities and
            placement applications.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => setShowLogin(true)}
            >
              Student Login
            </button>

            <button
              className="secondary-btn"
              onClick={() => setShowLogin(true)}
            >
              Admin Login
            </button>

          </div>

        </div>

      </section>


      <section className="features">

        <div className="feature-card">

          <h3>
            Student Profiles
          </h3>

          <p>
            Manage academic information, skills,
            resumes and projects.
          </p>

        </div>


        <div className="feature-card">

          <h3>
            Job Opportunities
          </h3>

          <p>
            Browse available placement opportunities
            and eligibility requirements.
          </p>

        </div>


        <div className="feature-card">

          <h3>
            Applications
          </h3>

          <p>
            Apply for jobs and track your
            application status.
          </p>

        </div>

      </section>

    </div>
  );
}

export default App;