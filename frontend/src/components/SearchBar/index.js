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
    {
      id: "search",
      title: "Search",
      description:
        "Search for properties by address or members by name or company. The map centers on the first match, displaying details in the bottom panel.",
    },
    {
      id: "filter",
      title: "Price Filter",
      description:
        "Filter properties by price range using sliders. The map updates dynamically to show properties within your selected price range.",
    },
    {
      id: "favorites",
      title: "Favorites",
      description:
        "Save favorite properties and members for quick access. View and manage your saved items in a dedicated list (feature coming soon).",
    },
    {
      id: "companyAdmin",
      title: "Company Admin",
      description:
        "Register companies with name, logo, and domain restrictions. Invite employees via email, assign roles (Admin, Analyst, Viewer), view stats, revoke access, and control data access levels.",
    },
    {
      id: "onboarding",
      title: "Onboarding",
      description:
        "Onboard employees with mock signup, terms acceptance, and tutorial. Set up SMS-based MFA and configure email alert preferences for invites and updates.",
    },
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
    <div className="sidebar w-64 bg-gradient-to-b from-teal-500 to-blue-600 text-white h-screen p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-yellow-300">Features</h2>
      {features.map((feature) => (
        <div
          key={feature.id}
          className={`p-3 mb-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
            activeFeature === feature.id ? "bg-purple-700" : "bg-blue-700"
          }`}
          onClick={() => setActiveFeature(feature.id)}>
          <h3 className="font-semibold text-yellow-200">{feature.title}</h3>
          <p className="text-sm text-gray-100 mt-1">{feature.description}</p>
          {/* Feature UIs */}
          {activeFeature === feature.id && (
            <div className="mt-2">
              {error && <p className="text-sm text-red-300 mb-2">{error}</p>}
              {feature.id === "search" && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-yellow-300"
                  />
                  <button
                    onClick={handleSearch}
                    className="w-full bg-teal-600 text-white py-1 rounded-md text-sm hover:bg-teal-700">
                    Search
                  </button>
                </div>
              )}
              {feature.id === "filter" && (
                <div className="space-y-2">
                  <label className="text-sm">
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
                <p className="text-sm text-gray-100">Favorites coming soon!</p>
              )}
              {feature.id === "companyAdmin" && (
                <div className="space-y-4">
                  {!isAdmin ? (
                    <p className="text-sm text-red-300">Admins only.</p>
                  ) : (
                    <>
                      <div>
                        <h4 className="text-sm font-semibold text-yellow-200">
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
                            className="w-full px-3 py-1 rounded-md text-gray-900 text-sm"
                          />
                          <input
                            type="url"
                            placeholder="Logo URL"
                            value={company.logo}
                            onChange={(e) =>
                              setCompany({ ...company, logo: e.target.value })
                            }
                            className="w-full px-3 py-1 rounded-md text-gray-900 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Domain"
                            value={company.domain}
                            onChange={(e) =>
                              setCompany({ ...company, domain: e.target.value })
                            }
                            className="w-full px-3 py-1 rounded-md text-gray-900 text-sm"
                          />
                          <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-1 rounded-md text-sm hover:bg-teal-700">
                            Register
                          </button>
                        </form>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-yellow-200">
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
                            className="w-full px-3 py-1 rounded-md text-gray-900 text-sm"
                          />
                          <select
                            value={invite.role}
                            onChange={(e) =>
                              setInvite({ ...invite, role: e.target.value })
                            }
                            className="w-full px-3 py-1 rounded-md text-gray-900 text-sm">
                            <option value="Admin">Admin</option>
                            <option value="Analyst">Analyst</option>
                            <option value="Viewer">Viewer</option>
                          </select>
                          <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-1 rounded-md text-sm hover:bg-teal-700">
                            Invite
                          </button>
                        </form>
                      </div>
                      {employees.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-yellow-200">
                            Employees
                          </h4>
                          <div className="max-h-40 overflow-y-auto">
                            <table className="w-full text-sm text-gray-100">
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
                                        className="text-gray-900 text-xs rounded">
                                        <option value="View">View</option>
                                        <option value="Edit">Edit</option>
                                        <option value="Full">Full</option>
                                      </select>
                                      <button
                                        onClick={() => handleRevoke(emp.email)}
                                        className="ml-1 text-red-300 hover:underline text-xs">
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
                        className="w-full px-3 py-1 rounded-md text-gray-900 text-sm"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full px-3 py-1 rounded-md text-gray-900 text-sm"
                      />
                      <button
                        type="submit"
                        className="w-full bg-teal-600 text-white py-1 rounded-md text-sm hover:bg-teal-700">
                        Sign Up
                      </button>
                    </form>
                  )}
                  {onboardingStep === "verify" && (
                    <div>
                      <p className="text-sm text-gray-100">
                        Verify email for {signupEmail}.
                      </p>
                      <button
                        onClick={handleVerify}
                        className="w-full bg-teal-600 text-white py-1 rounded-md text-sm hover:bg-teal-700">
                        I’ve Verified
                      </button>
                    </div>
                  )}
                  {onboardingStep === "terms" && (
                    <div>
                      <p className="text-sm text-gray-100 mb-2">
                        Agree to terms.
                      </p>
                      <label className="flex items-center text-sm text-gray-100">
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
                        className="w-full bg-teal-600 text-white py-1 rounded-md text-sm hover:bg-teal-700">
                        Continue
                      </button>
                    </div>
                  )}
                  {onboardingStep === "tutorial" && (
                    <div>
                      <p className="text-sm text-gray-100 mb-2">
                        Welcome to Wealth Map!
                      </p>
                      <button
                        onClick={handleTutorial}
                        className="w-full bg-teal-600 text-white py-1 rounded-md text-sm hover:bg-teal-700">
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
                        className="w-full px-3 py-1 rounded-md text-gray-900 text-sm mb-2"
                      />
                      <button
                        onClick={handleMfa}
                        className="w-full bg-teal-600 text-white py-1 rounded-md text-sm hover:bg-teal-700">
                        Set Up MFA
                      </button>
                    </div>
                  )}
                  {onboardingStep === "notifications" && (
                    <div>
                      <label className="flex items-center text-sm text-gray-100">
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
                      <label className="flex items-center text-sm text-gray-100">
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
                        className="w-full bg-teal-600 text-white py-1 rounded-md text-sm hover:bg-teal-700">
                        Save
                      </button>
                    </div>
                  )}
                  {onboardingStep === "complete" && (
                    <p className="text-sm text-gray-100">
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
