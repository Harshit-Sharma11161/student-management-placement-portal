import { useEffect, useState } from "react";
import "../App.css";

function StudentProfile({ onBack }) {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    rollNumber: "",
    branch: "",
    year: "",
    cgpa: "",
    phone: "",
    skills: "",
    resume: "",
    projects: "",
  });


  // ================= GET PROFILE =================

  useEffect(() => {
    fetchProfile();
  }, []);


  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/students/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to load profile."
        );

        setLoading(false);
        return;
      }

      setProfile(data);

      setFormData({
        rollNumber: data.rollNumber || "",
        branch: data.branch || "",
        year: data.year || "",
        cgpa: data.cgpa || "",
        phone: data.phone || "",

        skills: data.skills
          ? data.skills.join(", ")
          : "",

        resume: data.resume || "",

        projects: data.projects
          ? data.projects.join(", ")
          : "",
      });

    } catch (error) {
      console.error(
        "Profile error:",
        error
      );

      setError(
        "Unable to connect to server."
      );
    }

    setLoading(false);
  };


  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setSuccess("");
    setError("");
  };


  // ================= UPDATE PROFILE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const updatedProfile = {
        rollNumber: formData.rollNumber,

        branch: formData.branch,

        year: Number(formData.year),

        cgpa: Number(formData.cgpa),

        phone: formData.phone,

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        resume: formData.resume,

        projects: formData.projects
          .split(",")
          .map((project) => project.trim())
          .filter(Boolean),
      };


      const response = await fetch(
        "http://localhost:5000/api/students/me",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(
            updatedProfile
          ),
        }
      );


      const data = await response.json();


      if (!response.ok) {
        setError(
          data.message ||
            "Unable to update profile."
        );

        setSaving(false);
        return;
      }


      setProfile(data.student);

      setSuccess(
        "Profile updated successfully!"
      );

    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setError(
        "Unable to connect to server."
      );
    }

    setSaving(false);
  };


  // ================= LOADING =================

  if (loading) {
    return (
      <div className="profile-page">
        <h2>Loading profile...</h2>
      </div>
    );
  }


  // ================= PAGE =================

  return (
    <div className="profile-page">

      <div className="profile-header">

        <div>

          <h1>
            My Profile
          </h1>

          <p>
            View and update your student
            information.
          </p>

        </div>


        <button
          className="secondary-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

      </div>


      <div className="profile-form-card">

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        {success && (
          <div className="profile-success">
            {success}
          </div>
        )}


        {/* ================= ACCOUNT INFORMATION ================= */}

        <div className="profile-section">

          <h2>
            Account Information
          </h2>

          <div className="profile-readonly">

            <div>

              <strong>
                Name
              </strong>

              <span>
                {profile?.user?.name ||
                  "N/A"}
              </span>

            </div>


            <div>

              <strong>
                Email
              </strong>

              <span>
                {profile?.user?.email ||
                  "N/A"}
              </span>

            </div>

          </div>

        </div>


        {/* ================= STUDENT INFORMATION ================= */}

        <form onSubmit={handleSubmit}>

          <div className="profile-section">

            <h2>
              Student Information
            </h2>


            <div className="profile-form-grid">

              <div className="form-group">

                <label>
                  Roll Number
                </label>

                <input
                  type="text"
                  name="rollNumber"
                  value={
                    formData.rollNumber
                  }
                  onChange={handleChange}
                  placeholder="Enter roll number"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Branch
                </label>

                <input
                  type="text"
                  name="branch"
                  value={
                    formData.branch
                  }
                  onChange={handleChange}
                  placeholder="e.g. CSE"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Year
                </label>

                <input
                  type="number"
                  name="year"
                  value={
                    formData.year
                  }
                  onChange={handleChange}
                  min="1"
                  max="5"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  CGPA
                </label>

                <input
                  type="number"
                  name="cgpa"
                  value={
                    formData.cgpa
                  }
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={
                    formData.phone
                  }
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Resume
                </label>

                <input
                  type="text"
                  name="resume"
                  value={
                    formData.resume
                  }
                  onChange={handleChange}
                  placeholder="Resume filename or link"
                />

              </div>

            </div>

          </div>


          {/* ================= SKILLS ================= */}

          <div className="profile-section">

            <h2>
              Skills
            </h2>

            <div className="form-group">

              <label>
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={
                  formData.skills
                }
                onChange={handleChange}
                placeholder="Java, DSA, MongoDB, JavaScript"
              />

              <small>
                Separate skills with commas.
              </small>

            </div>

          </div>


          {/* ================= PROJECTS ================= */}

          <div className="profile-section">

            <h2>
              Projects
            </h2>

            <div className="form-group">

              <label>
                Projects
              </label>

              <textarea
                name="projects"
                value={
                  formData.projects
                }
                onChange={handleChange}
                rows="4"
                placeholder="Student Management Portal, E-commerce Website"
              />

              <small>
                Separate projects with commas.
              </small>

            </div>

          </div>


          {/* ================= BUTTONS ================= */}

          <div className="profile-actions">

            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>


            <button
              type="button"
              className="secondary-btn"
              onClick={onBack}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default StudentProfile;