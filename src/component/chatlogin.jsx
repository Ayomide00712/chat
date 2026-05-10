import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginPage = ({ setIsAuthenticated, setShowSignup }) => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Invalid email address.");
      return;
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      setError("Invalid phone number. It should be 10-15 digits.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        phoneNumber
      );
      console.log("Login successful for user:", userCredential.user.email);
      setIsAuthenticated(true);
      setError("");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("User not found. Please sign up or contact support.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect phone number. Please try again.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid credentials. Please sign up or contact support.");
      } else {
        setError(`Login failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center main">
      <div className="p-17 rounded-lg container-login">
        <h2 className="text-2xl md:text-4xl  font-bold text-center mb-6">
          AUK CHATBOT
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-10 form">
          <div>
            <label
              htmlFor="email"
              className="block text-sm md:text-2xl font-bold"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-bold text-gray-700"
            >
            Password
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="090123456789"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 px-3 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition"
          >
            Log In
          </button>
        </form>
        <p className="text-center mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => setShowSignup(true)}
            className="text-indigo-500 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
