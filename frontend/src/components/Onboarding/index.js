import React, { useState } from "react";
import "./index.css";

const Onboarding = ({ user }) => {
  const [step, setStep] = useState(user ? "terms" : "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [mfaPhone, setMfaPhone] = useState("");
  const [notifications, setNotifications] = useState({
    invites: true,
    updates: false,
  });
  const [error, setError] = useState("");

  // Mock user storage
  const saveUser = (userData) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    localStorage.setItem("users", JSON.stringify([...users, userData]));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    const userData = {
      email,
      password,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    saveUser(userData);
    setStep("verify");
    setError("");
    alert('Verification email sent (mock). Click "I’ve Verified" to proceed.');
  };

  const handleVerify = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u) =>
      u.email === email ? { ...u, verified: true } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setStep("terms");
    setError("");
  };

  const handleTerms = () => {
    if (!termsAccepted) {
      setError("You must accept the terms.");
      return;
    }
    setStep("tutorial");
    setError("");
  };

  const handleTutorial = () => {
    setStep("mfa");
  };

  const handleMfa = () => {
    if (!mfaPhone) {
      setError("Phone number is required for MFA.");
      return;
    }
    alert(`SMS MFA setup for ${mfaPhone} (mock)`);
    setStep("notifications");
    setError("");
  };

  const handleNotifications = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u) =>
      u.email === email ? { ...u, notifications } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert(`Notifications set: ${JSON.stringify(notifications)}`);
    setStep("complete");
  };

  if (!user && step === "signup") {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Up</h3>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="employee@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
            Sign Up
          </button>
        </form>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Verify Email
        </h3>
        <p className="text-sm text-gray-600">
          A verification email has been sent to {email}. Please verify to
          continue.
        </p>
        <button
          onClick={handleVerify}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
          I’ve Verified
        </button>
      </div>
    );
  }

  if (step === "terms") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Terms of Service
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            By using Wealth Map, you agree to our terms of service and privacy
            policy.
          </p>
          {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mr-2"
            />
            I accept the terms
          </label>
          <button
            onClick={handleTerms}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === "tutorial") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Welcome to Wealth Map
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Explore properties and network with industry leaders. Use the
            sidebar to search, filter, and manage your team.
          </p>
          <button
            onClick={handleTutorial}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
            Next
          </button>
        </div>
      </div>
    );
  }

  if (step === "mfa") {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Up MFA</h3>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={mfaPhone}
              onChange={(e) => setMfaPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="+1234567890"
            />
          </div>
          <button
            onClick={handleMfa}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
            Set Up MFA
          </button>
        </div>
      </div>
    );
  }

  if (step === "notifications") {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              checked={notifications.invites}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  invites: e.target.checked,
                })
              }
              className="mr-2"
            />
            Email alerts for invites
          </label>
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              checked={notifications.updates}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  updates: e.target.checked,
                })
              }
              className="mr-2"
            />
            Email alerts for updates
          </label>
          <button
            onClick={handleNotifications}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Onboarding Complete
      </h3>
      <p className="text-sm text-gray-600">You’re ready to use Wealth Map!</p>
    </div>
  );
};

export default Onboarding;
