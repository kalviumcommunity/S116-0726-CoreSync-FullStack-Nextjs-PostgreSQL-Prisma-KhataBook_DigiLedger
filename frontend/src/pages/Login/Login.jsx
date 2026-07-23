import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    // Email Validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password Validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (validate()) {
      // Frontend only
      console.log("Validation Passed");
      console.log({
        email,
        password,
        rememberMe,
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: "8px" }}>Welcome Back!</h1>

        <p style={{ marginTop: 0, color: "#64748b" }}>
          Log in to your KhataBook Digital Ledger account.
        </p>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              boxSizing: "border-box",
            }}
          />

          {errors.email && (
            <p
              style={{
                color: "red",
                fontSize: "14px",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            >
              {errors.email}
            </p>
          )}

          {/* Password */}
          <label>Password</label>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              boxSizing: "border-box",
            }}
          />

          {errors.password && (
            <p
              style={{
                color: "red",
                fontSize: "14px",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            >
              {errors.password}
            </p>
          )}

          {/* Show Password */}
          

          {/* Remember Me */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />

            <label style={{ marginLeft: "8px" }}>Remember Me</label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;