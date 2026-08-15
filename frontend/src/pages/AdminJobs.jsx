import { useEffect, useState } from "react";
import "../App.css";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    description: "",
    location: "",
    salary: "",
    skillsRequired: "",
    minCGPA: "",
    branches: "",
    graduationYear: "",
    deadline: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  // ================= GET JOBS =================

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/jobs",
        {
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

  // ================= FORM INPUT =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= RESET FORM =================

  const resetForm = () => {
    setFormData({
      company: "",
      role: "",
      description: "",
      location: "",
      salary: "",
      skillsRequired: "",
      minCGPA: "",
      branches: "",
      graduationYear: "",
      deadline: "",
    });

    setEditingJob(null);
    setShowForm(false);
  };

  // ================= CREATE / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const jobData = {
        company: formData.company,
        role: formData.role,
        description: formData.description,
        location: formData.location,
        salary: Number(formData.salary),

        skillsRequired: formData.skillsRequired
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        eligibility: {
          minCGPA: Number(formData.minCGPA),
          branches: formData.branches
            .split(",")
            .map((branch) => branch.trim())
            .filter(Boolean),
          graduationYear: Number(
            formData.graduationYear
          ),
        },

        deadline: formData.deadline,
      };

      let url = "http://localhost:5000/api/jobs";
      let method = "POST";

      if (editingJob) {
        url = `http://localhost:5000/api/jobs/${editingJob._id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to save job."
        );
        return;
      }

      alert(
        editingJob
          ? "Job updated successfully!"
          : "Job created successfully!"
      );

      resetForm();
      fetchJobs();

    } catch (error) {
      console.error("Save job error:", error);
      alert("Unable to connect to server.");
    }
  };

  // ================= EDIT JOB =================

  const handleEdit = (job) => {
    setEditingJob(job);

    setFormData({
      company: job.company || "",
      role: job.role || "",
      description: job.description || "",
      location: job.location || "",
      salary: job.salary || "",

      skillsRequired:
        job.skillsRequired?.join(", ") || "",

      minCGPA:
        job.eligibility?.minCGPA || "",

      branches:
        job.eligibility?.branches?.join(", ") || "",

      graduationYear:
        job.eligibility?.graduationYear || "",

      deadline: job.deadline
        ? job.deadline.split("T")[0]
        : "",
    });

    setShowForm(true);
  };

  // ================= TOGGLE JOB STATUS =================

  const toggleStatus = async (job) => {
    try {
      const token = localStorage.getItem("token");

      const newStatus =
        job.status === "Open"
          ? "Closed"
          : "Open";

      const response = await fetch(
        `http://localhost:5000/api/jobs/${job._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to update job status."
        );
        return;
      }

      fetchJobs();

    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert("Unable to connect to server.");
    }
  };

  // ================= DELETE JOB =================

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/jobs/${jobId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to delete job."
        );
        return;
      }

      alert("Job deleted successfully!");

      fetchJobs();

    } catch (error) {
      console.error(
        "Delete job error:",
        error
      );

      alert("Unable to connect to server.");
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="admin-jobs-page">
        <h2>Loading jobs...</h2>
      </div>
    );
  }

  // ================= PAGE =================

  return (
    <div className="admin-jobs-page">

      <div className="admin-jobs-header">

        <div>
          <h1>Manage Jobs</h1>

          <p>
            Create, update and manage
            placement opportunities.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            setEditingJob(null);
            setShowForm(true);
          }}
        >
          + Create Job
        </button>

      </div>


      {error && (
        <div className="login-error">
          {error}
        </div>
      )}


      {/* ================= FORM ================= */}

      {showForm && (

        <div className="job-form-card">

          <h2>
            {editingJob
              ? "Edit Job"
              : "Create New Job"}
          </h2>


          <form onSubmit={handleSubmit}>

            <div className="admin-form-grid">

              <div className="form-group">

                <label>
                  Company
                </label>

                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="e.g. TCS"
                />

              </div>


              <div className="form-group">

                <label>
                  Role
                </label>

                <input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Software Developer"
                />

              </div>


              <div className="form-group">

                <label>
                  Location
                </label>

                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Bangalore"
                />

              </div>


              <div className="form-group">

                <label>
                  Salary
                </label>

                <input
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 700000"
                />

              </div>


              <div className="form-group">

                <label>
                  Minimum CGPA
                </label>

                <input
                  name="minCGPA"
                  type="number"
                  step="0.1"
                  value={formData.minCGPA}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 7.5"
                />

              </div>


              <div className="form-group">

                <label>
                  Graduation Year
                </label>

                <input
                  name="graduationYear"
                  type="number"
                  value={
                    formData.graduationYear
                  }
                  onChange={handleChange}
                  required
                  placeholder="e.g. 2028"
                />

              </div>


              <div className="form-group">

                <label>
                  Branches
                </label>

                <input
                  name="branches"
                  value={formData.branches}
                  onChange={handleChange}
                  required
                  placeholder="CSE, IT"
                />

              </div>


              <div className="form-group">

                <label>
                  Deadline
                </label>

                <input
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe the job..."
              />

            </div>


            <div className="form-group">

              <label>
                Required Skills
              </label>

              <input
                name="skillsRequired"
                value={
                  formData.skillsRequired
                }
                onChange={handleChange}
                placeholder="Java, DSA, MongoDB, JavaScript"
                required
              />

              <small>
                Separate skills with commas.
              </small>

            </div>


            <div className="form-buttons">

              <button
                type="submit"
                className="primary-btn"
              >
                {editingJob
                  ? "Update Job"
                  : "Create Job"}
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* ================= JOB LIST ================= */}

      <div className="admin-jobs-list">

        <h2>
          All Jobs
        </h2>


        {jobs.length === 0 ? (

          <div className="no-applications">

            <h3>
              No jobs found.
            </h3>

          </div>

        ) : (

          jobs.map((job) => (

            <div
              className="admin-job-card"
              key={job._id}
            >

              <div className="admin-job-main">

                <div>

                  <h2>
                    {job.role}
                  </h2>

                  <h3>
                    {job.company}
                  </h3>

                  <p>
                    📍 {job.location}
                  </p>

                  <p>
                    💰 ₹{job.salary}
                  </p>

                  <p>
                    📅 Deadline:{" "}
                    {new Date(
                      job.deadline
                    ).toLocaleDateString()}
                  </p>

                </div>


                <span
                  className={
                    job.status === "Open"
                      ? "job-status"
                      : "job-status closed"
                  }
                >
                  {job.status}
                </span>

              </div>


              <div className="admin-job-actions">

                <button
                  className="primary-btn"
                  onClick={() =>
                    handleEdit(job)
                  }
                >
                  Edit
                </button>


                <button
                  className="secondary-btn"
                  onClick={() =>
                    toggleStatus(job)
                  }
                >
                  {job.status === "Open"
                    ? "Close Job"
                    : "Open Job"}
                </button>


                <button
                  className="danger-btn"
                  onClick={() =>
                    handleDelete(job._id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default AdminJobs;