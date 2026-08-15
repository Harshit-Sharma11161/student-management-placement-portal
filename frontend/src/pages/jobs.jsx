import { useEffect, useState } from "react";
import "../App.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  // ================= GET ALL JOBS =================

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/jobs",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load jobs.");
        setLoading(false);
        return;
      }

      setJobs(data);
    } catch (error) {
      console.error("Jobs error:", error);
      setError("Unable to connect to server.");
    }

    setLoading(false);
  };


  // ================= APPLY FOR JOB =================

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            jobId: jobId,
          }),
        }
      );

      const data = await response.json();

      console.log("Application response:", data);

      if (!response.ok) {
        alert(data.message || "Unable to apply for this job.");
        return;
      }

      alert("Application submitted successfully!");

    } catch (error) {
      console.error("Application error:", error);
      alert("Unable to connect to server.");
    }
  };


  // ================= LOADING =================

  if (loading) {
    return (
      <div className="jobs-page">
        <h2>Loading jobs...</h2>
      </div>
    );
  }


  // ================= PAGE =================

  return (
    <div className="jobs-page">

      <div className="jobs-header">

        <h1>Available Jobs</h1>

        <p>
          Explore placement opportunities available for you.
        </p>

      </div>


      {/* ERROR */}

      {error && (
        <div className="login-error">
          {error}
        </div>
      )}


      {/* NO JOBS */}

      {!error && jobs.length === 0 && (
        <div className="no-jobs">

          <h2>No jobs available</h2>

          <p>
            There are currently no open job opportunities.
          </p>

        </div>
      )}


      {/* JOBS */}

      <div className="jobs-grid">

        {jobs.map((job) => (

          <div
            className="job-card"
            key={job._id}
          >

            {/* JOB HEADER */}

            <div className="job-card-header">

              <div>

                <h2>
                  {job.role}
                </h2>

                <h3>
                  {job.company}
                </h3>

              </div>


              <span className="job-status">
                {job.status}
              </span>

            </div>


            {/* DESCRIPTION */}

            <p className="job-description">
              {job.description}
            </p>


            {/* JOB DETAILS */}

            <div className="job-details">

              <div>

                <strong>
                  📍 Location
                </strong>

                <span>
                  {job.location}
                </span>

              </div>


              <div>

                <strong>
                  💰 Salary
                </strong>

                <span>
                  ₹{job.salary}
                </span>

              </div>


              <div>

                <strong>
                  📅 Deadline
                </strong>

                <span>
                  {new Date(
                    job.deadline
                  ).toLocaleDateString()}
                </span>

              </div>

            </div>


            {/* SKILLS */}

            <div className="skills-section">

              <strong>
                Required Skills
              </strong>


              <div className="skills-list">

                {job.skillsRequired?.map(
                  (skill, index) => (

                    <span
                      key={index}
                      className="skill-tag"
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            </div>


            {/* ELIGIBILITY */}

            <div className="eligibility">

              <strong>
                Eligibility
              </strong>


              <p>
                Minimum CGPA:{" "}
                {job.eligibility?.minCGPA || 0}
              </p>


              <p>
                Branches:{" "}
                {job.eligibility?.branches?.length
                  ? job.eligibility.branches.join(", ")
                  : "All"}
              </p>


              <p>
                Graduation Year:{" "}
                {job.eligibility?.graduationYear ||
                  "Any"}
              </p>

            </div>


            {/* APPLY BUTTON */}

            <button
              className="primary-btn apply-btn"

              disabled={job.status !== "Open"}

              onClick={() =>
                handleApply(job._id)
              }
            >
              {job.status === "Open"
                ? "Apply Now"
                : "Job Closed"}
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Jobs;