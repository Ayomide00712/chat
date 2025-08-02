import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignupPage = ({ setIsAuthenticated, setShowSignup }) => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleSignup = async (e) => {
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        phoneNumber
      );
      console.log("Signup successful for user:", userCredential.user.email);
      setSuccess("Account created successfully! Welcome to FUD Chatbot.");
      setError("");
      // Clear form inputs
      setEmail("");
      setPhoneNumber("");
      // Automatically redirect to chat interface after 3 seconds
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 3000);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError(
          "Email is already registered. Please log in or use a different email."
        );
      } else {
        setError(`Signup failed: ${err.message}`);
      }
      setSuccess("");
    }
  };

  // Clear success message when navigating back to login
  useEffect(() => {
    return () => setSuccess("");
  }, []);

  return (
    <div className="flex items-center justify-center main">
      <div className="p-17 rounded-lg container-login">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-6">
          FUD Chatbot Signup
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4 bg-green-100 p-2 rounded">
            {success}
          </p>
        )}
        <form onSubmit={handleSignup} className="space-y-10 form">
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
              placeholder="e.g., user@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-bold text-gray-700"
            >
              Phone Number (Password)
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., +1234567890"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 px-3 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <button
            onClick={() => setShowSignup(false)}
            className="text-indigo-500 hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
