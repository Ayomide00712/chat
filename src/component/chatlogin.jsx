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
      setError(`Login failed: ${err.message}`);
      console.error("Login error details:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          FUD Chatbot Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="jambNumber"
              className="block text-sm font-medium text-gray-700"
            >
              JAMB Number
            </label>
            <input
              id="jambNumber"
              type="text"
              value={jambNumber}
              onChange={(e) => setJambNumber(e.target.value.toUpperCase())}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2025123456AB"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
