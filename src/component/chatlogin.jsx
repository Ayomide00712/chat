import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginPage = ({ setIsAuthenticated }) => {
  const [jambNumber, setJambNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidJambNumber = (jamb) => {
    const jambRegex = /^\d{10}[A-Z]{2}$/;
    return jambRegex.test(jamb);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isValidJambNumber(jambNumber)) {
      setError(
        "Invalid JAMB number. It should be 10 digits followed by 2 letters (e.g., 2025123456AB)."
      );
      return;
    }

    const email = `jamb_${jambNumber}@yourapp.com`; // Match your Firebase user email domain
    console.log(
      "Login attempt with email:",
      email,
      "password length:",
      password.length
    );
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Login successful for user:", userCredential.user.email);
      setIsAuthenticated(true);
      setError("");
    } catch (err) {
      // console.error("Login error details:", err.code, err.message);
      if (err.code === "auth/user-not-found") {
        setError(
          "User not found. Please register with this JAMB number or contact support."
        );
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/invalid-credential") {
        setError(
          "User not found. Please register with this JAMB number or contact support."
        );
      } else {
        setError(`Login failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center main">
      <div className="p-17 rounded-lg container-login">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-6">
          FUD Chatbot Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-10 form">
          <div>
            <label
              htmlFor="jambNumber"
              className="block text-sm md:text-2xl font-bold"
            >
              JAMB Number
            </label>
            <input
              id="jambNumber"
              type="text"
              value={jambNumber}
              onChange={(e) => setJambNumber(e.target.value.toUpperCase())}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 2025123456AB"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 px-3 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
