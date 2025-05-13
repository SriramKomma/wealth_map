import React, { useState } from "react";
import "./index.css";

const Sidebar = ({
  user,
  properties,
  members,
  setMapCenter,
  setSelectedItem,
  setFilteredProperties,
  setFilteredMembers,
  isOpen,
  setIsOpen,
}) => {
  const [activeFeature, setActiveFeature] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [company, setCompany] = useState({ name: "", logo: "", domain: "" });
  const [invite, setInvite] = useState({ email: "", role: "Viewer" });
  const [employees, setEmployees] = useState(
    JSON.parse(localStorage.getItem("employees") || "[]")
  );
  const [onboardingStep, setOnboardingStep] = useState(
    user ? "terms" : "signup"
  );
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [mfaPhone, setMfaPhone] = useState("");
  const [notifications, setNotifications] = useState({
    invites: true,
    updates: false,
  });
  const [error, setError] = useState("");

  const isAdmin = user?.email === "admin@example.com";

  const features = [
    { id: "search", title: "Search" },
    { id: "filter", title: "Price Filter" },
    { id: "favorites", title: "Favorites" },
    { id: "companyAdmin", title: "Company Admin" },
    { id: "onboarding", title: "Onboarding" },
  ];

  // Search Logic
  const handleSearch = () => {
    const filteredProps = properties.filter((property) =>
      property.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredMems = members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProperties(filteredProps);
    setFilteredMembers(filteredMems);
    if (filteredProps.length > 0) {
      setMapCenter(filteredProps[0].position);
      setSelectedItem(filteredProps[0]);
    } else if (filteredMems.length > 0) {
      setMapCenter(filteredMems[0].position);
      setSelectedItem(filteredMems[0]);
    } else {
      setSelectedItem(null);
    }
    setError("");
  };

  // Price Filter Logic
  const handlePriceFilter = () => {
    const filtered = properties.filter((property) => {
      const price = parseInt(property.price.replace("$", "").replace(",", ""));
      return price >= priceRange[0] && price <= priceRange[1];
    });
    setFilteredProperties(filtered);
    setError("");
  };

  // Company Admin Logic
  const handleCompanySubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) return setError("Only admins can register companies.");
    if (!company.name || !company.domain)
      return setError("Name and domain required.");
    localStorage.setItem("company", JSON.stringify(company));
    alert(`Company registered: ${company.name}`);
    setCompany({ name: "", logo: "", domain: "" });
    setError("");
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) return setError("Only admins can invite employees.");
    if (!invite.email || !invite.email.endsWith(`@${company.domain}`)) {
      return setError(`Email must end with @${company.domain}.`);
    }
    const newEmployee = {
      email: invite.email,
      role: invite.role,
      joinDate: new Date().toISOString().split("T")[0],
      access:
        invite.role === "Admin"
          ? "Full"
          : invite.role === "Analyst"
          ? "Edit"
          : "View",
    };
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    alert(`Invited ${invite.email} as ${invite.role}`);
    setInvite({ email: "", role: "Viewer" });
    setError("");
  };

  const handleRevoke = (email) => {
    if (!isAdmin) return setError("Only admins can revoke access.");
    const updatedEmployees = employees.filter((emp) => emp.email !== email);
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    alert(`Access revoked for ${email}`);
    setError("");
  };

  const handleAccessChange = (email, access) => {
    if (!isAdmin) return setError("Only admins can change access.");
    const updatedEmployees = employees.map((emp) =>
      emp.email === email ? { ...emp, access } : emp
    );
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    alert(`Access for ${email} set to ${access}`);
    setError("");
  };

  // Onboarding Logic
  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword) {
      setError("Email and password required.");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    localStorage.setItem(
      "users",
      JSON.stringify([...users, { email: signupEmail, verified: false }])
    );
    setOnboardingStep("verify");
    setError("");
    alert("Verification email sent (mock).");
  };

  const handleVerify = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    localStorage.setItem(
      "users",
      JSON.stringify(
        users.map((u) =>
          u.email === signupEmail ? { ...u, verified: true } : u
        )
      )
    );
    setOnboardingStep("terms");
    setError("");
  };

  const handleTerms = () => {
    if (!termsAccepted) {
      setError("Accept terms required.");
      return;
    }
    setOnboardingStep("tutorial");
    setTermsAccepted(false);
    setError("");
  };

  const handleTutorial = () => {
    setOnboardingStep("mfa");
  };

  const handleMfa = () => {
    if (!mfaPhone) {
      setError("Phone number required.");
      return;
    }
    alert(`MFA setup for ${mfaPhone} (mock)`);
    setOnboardingStep("notifications");
    setError("");
  };

  const handleNotifications = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    localStorage.setItem(
      "users",
      JSON.stringify(
        users.map((u) =>
          u.email === signupEmail ? { ...u, notifications } : u
        )
      )
    );
    alert(`Notifications set: ${JSON.stringify(notifications)}`);
    setOnboardingStep("complete");
    setError("");
  };

  return (
    <div
      className={`sidebar fixed top-0 left-0 h-screen bg-gray-800 text-gray-100 p-4 overflow-y-auto transition-transform duration-300 ${
        isOpen ? "translate-x-0 w-[70%]" : "-translate-x-full w-[70%]"
      } md:translate-x-0 md:w-64 z-40`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Features</h2>
        <button
          className="md:hidden text-2xl text-white"
          onClick={() => setIsOpen(false)}>
          ×
        </button>
      </div>
      {features.map((feature) => (
        <div
          key={feature.id}
          className={`p-3 mb-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:bg-gray-700 ${
            activeFeature === feature.id ? "bg-gray-900" : "bg-gray-800"
          }`}
          onClick={() => setActiveFeature(feature.id)}>
          <h3 className="font-semibold text-white">{feature.title}</h3>
          {activeFeature === feature.id && (
            <div className="mt-2">
              {error && <p className="text-sm text-gray-400 mb-2">{error}</p>}
              {feature.id === "search" && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1 rounded-md text-gray-900 text-sm bg-gray-100 focus:ring-2 focus:ring-gray-500"
                  />
                  <button
                    onClick={handleSearch}
                    className="w-full bg-gray-700 text-gray-100 py-1 rounded-md text-sm hover:bg-gray-800">
                    Search
                  </button>
                </div>
              )}
              {feature.id === "filter" && (
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">
                    Price: ${priceRange[0].toLocaleString()} - $
                    {priceRange[1].toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2000000"
                    step="10000"
                    value={priceRange[0]}
                    onChange={(e) => {
                      setPriceRange([+e.target.value, priceRange[1]]);
                      handlePriceFilter();
                    }}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="2000000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([priceRange[0], +e.target.value]);
                      handlePriceFilter();
                    }}
                    className="w-full"
                  />
                </div>
              )}
              {feature.id === "favorites" && (
                <p className="text-sm text-gray-400">Favorites coming soon!</p>
              )}
              {feature.id === "companyAdmin" && (
                <div className="space-y-4">
                  {!isAdmin ? (
                    <p className="text-sm text-gray-400">Admins only.</p>
                  ) : (
                    <>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          Register Company
                        </h4>
                        <form
                          onSubmit={handleCompanySubmit}
                          className="space-y-2">
                          <input
                            type="text"
                            placeholder="Name"
                            value={company.name}
                            onChange={(e) =>
                              setCompany({ ...company, name: e.target.value })
                            }
                            className="w-full px-3 py-1 rounded-md text-gray-900 text-sm bg-gray-100"
                          />
                          <input
                            type="url"
                            placeholder="Logo URL"
                            value={company.logo}
                            onChange={(e) =>
                              setCompany({ ...company, logo: e.target.value })
                            }
                            className="w-full px-3 py-1 rounded-md text-gray-900 text-sm bg-gray-100"
                          />
                          <input
                            type="text"
                            placeholder="Domain"
                            value={company.domain}
                            onChange={(e) =>
                              setCompany({ ...company, domain: e.target.value })
                            }
                            className="w-full px-3 py-1 rounded-md text-gray-900 text-sm bg-gray-100"
                          />
                          <button
                            type="submit"
                            className="w-full bg-gray-700 text-gray-100 py-1 rounded-md text-sm hover:bg-gray-800">
                            Register
                          </button>
                        </form>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          Invite Employee
                        </h4>
                        <form
                          onSubmit={handleInviteSubmit}
                          className="space-y-2">
                          <input
                            type="email"
                            placeholder="Email"
                            value={invite.email}
                            onChange={(e) =>
                              setInvite({ ...invite, email: e.target.value })
                            }
                            className="w-full px-3 py-1 rounded-md text-gray-900 text-sm bg-gray-100"
                          />
                          <select
                            value={invite.role}
                            onChange={(e) =>
                              setInvite({ ...invite, role: e.target.value })
                            }
                            className="w-full px-3 py-1 rounded-md text-gray-900 text-sm bg-gray-100">
                            <option value="Admin">Admin</option>
                            <option value="Analyst">Analyst</option>
                            <option value="Viewer">Viewer</option>
                          </select>
                          <button
                            type="submit"
                            className="w-full bg-gray-700 text-gray-100 py-1 rounded-md text-sm hover:bg-gray-800">
                            Invite
                          </button>
                        </form>
                      </div>
                      {employees.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-white">
                            Employees
                          </h4>
                          <div className="max-h-40 overflow-y-auto">
                            <table className="w-full text-sm text-gray-400">
                              <thead>
                                <tr>
                                  <th className="p-1 text-left">Email</th>
                                  <th className="p-1 text-left">Role</th>
                                  <th className="p-1 text-left">Access</th>
                                </tr>
                              </thead>
                              <tbody>
                                {employees.map((emp) => (
                                  <tr key={emp.email}>
                                    <td className="p-1">
                                      {emp.email.split("@")[0]}
                                    </td>
                                    <td className="p-1">{emp.role}</td>
                                    <td className="p-1">
                                      <select
                                        value={emp.access}
                                        onChange={(e) =>
                                          handleAccessChange(
                                            emp.email,
                                            e.target.value
                                          )
                                        }
                                        className="text-gray-900 text-xs rounded bg-gray-100">
                                        <option value="View">View</option>
                                        <option value="Edit">Edit</option>
                                        <option value="Full">Full</option>
                                      </select>
                                      <button
                                        onClick={() => handleRevoke(emp.email)}
                                        className="ml-1 text-gray-400 hover:text-gray-200 text-xs">
                                        Revoke
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              {feature.id === "onboarding" && (
                <div className="space-y-2">
                  {!user && onboardingStep === "signup" && (
                    <form onSubmit={handleSignup} className="space-y-2">
                      <input
                        type="email"
                        placeholder="Email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full px-3 py-1 rounded-md text-gray-900 text-sm bg-gray-100"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full px-3 py-1 rounded-md text-gray-900 text-sm bg-gray-100"
                      />
                      <button
                        type="submit"
                        className="w-full bg-gray-700 text-gray-100 py-1 rounded-md text-sm hover:bg-gray-800">
                        Sign Up
                      </button>
                    </form>
                  )}
                  {onboardingStep === "verify" && (
                    <div>
                      <p className="text-sm text-gray-400">
                        Verify email for {signupEmail}.
                      </p>
                      <button
                        onClick={handleVerify}
                        className="w-full bg-gray-700 text-gray-100 py-1 rounded-md text-sm hover:bg-gray-800">
                        I’ve Verified
                      </button>
                    </div>
                  )}
                  {onboardingStep === "terms" && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">
                        Agree to terms.
                      </p>
                      <label className="flex items-center text-sm text-gray-400">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="mr-2"
                        />
                        Accept Terms
                      </label>
                      <button
                        onClick={handleTerms}
                        className="w-full bg-gray-700 text-gray-100 py-1 rounded-md text-sm hover:bg-gray-800">
                        Continue
                      </button>
                    </div>
                  )}
                  {onboardingStep === "tutorial" && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">
                        Welcome to Wealth Map!
                      </p>
                      <button
                        onClick={handleTutorial}
                        className="w-full bg-gray-700 text-gray-100 py-1 rounded-md text-sm hover:bg-gray-800">
                        Next
                      </button>
                    </div>
                  )}
                  {onboardingStep === "mfa" && (
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone (+1234567890)"
                        value={mfaPhone}
                        onChange={(e) => setMfaPhone(e.target.value)}
                        className="w-full px-3 py-1 rounded-md text-gray-900 text-sm bg-gray-100 mb-2"
                      />
                      <button
                        onClick={handleMfa}
                        className="w-full bg-gray-700 text-gray-100 py-1 rounded-md text-sm hover:bg-gray-800">
                        Set Up MFA
                      </button>
                    </div>
                  )}
                  {onboardingStep === "notifications" && (
                    <div>
                      <label className="flex items-center text-sm text-gray-400">
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
                        Invites
                      </label>
                      <label className="flex items-center text-sm text-gray-400">
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
                        Updates
                      </label>
                      <button
                        onClick={handleNotifications}
                        className="w-full bg-gray-700 text-gray-100 py-1 rounded-md text-sm hover:bg-gray-800">
                        Save
                      </button>
                    </div>
                  )}
                  {onboardingStep === "complete" && (
                    <p className="text-sm text-gray-400">
                      Onboarding complete!
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
