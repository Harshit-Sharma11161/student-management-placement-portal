import { useState } from "react";
import "../App.css";

function Register({ onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
       `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
            role: "student",
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Registration response:",
        data
      );

      if (!response.ok) {
        setError(
          data.message ||
            "Registration failed."
        );

        setLoading(false);
        return;
      }

      setSuccess(
        "Registration successful! You can now login."
      );

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        "Unable to connect to server."
      );
    }

    setLoading(false);
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>
          Create Account
        </h1>

        <p>
          Register as a student
        </p>


        <form onSubmit={handleRegister}>

          {/* NAME */}

          <div className="form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

          </div>


          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              minLength="6"
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <input
              id="confirm-password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              required
            />

          </div>


          {/* ERROR */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="profile-success">
              {success}
            </div>
          )}


          {/* REGISTER */}

          <button
            type="submit"
            className="primary-btn login-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        {/* BACK TO LOGIN */}

        <button
          type="button"
          className="secondary-btn"
          onClick={onBackToLogin}
          style={{
            width: "100%",
            marginTop: "12px",
          }}
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}

export default Register;