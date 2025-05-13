import React, { useState } from "react";
import "./index.css";

const CompanyAdmin = ({ user }) => {
  const [company, setCompany] = useState({ name: "", logo: "", domain: "" });
  const [invite, setInvite] = useState({ email: "", role: "Viewer" });
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");

  // Mock admin check (replace with Firebase custom claims later)
  const isAdmin = user?.email === "admin@example.com";

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setError("Only admins can register companies.");
      return;
    }
    if (!company.name || !company.domain) {
      setError("Name and domain are required.");
      return;
    }
    alert(`Company registered: ${company.name}`);
    setCompany({ name: "", logo: "", domain: "" });
    setError("");
    // TODO: Save to Firestore
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setError("Only admins can invite employees.");
      return;
    }
    if (!invite.email || !invite.email.endsWith(`@${company.domain}`)) {
      setError(`Email must end with @${company.domain}.`);
      return;
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
    setEmployees([...employees, newEmployee]);
    alert(`Invited ${invite.email} as ${invite.role}`);
    setInvite({ email: "", role: "Viewer" });
    setError("");
    // TODO: Send Firebase Auth invite email
  };

  const handleRevoke = (email) => {
    if (!isAdmin) {
      setError("Only admins can revoke access.");
      return;
    }
    setEmployees(employees.filter((emp) => emp.email !== email));
    alert(`Access revoked for ${email}`);
    // TODO: Update Firestore, revoke Firebase Auth
  };

  const handleAccessChange = (email, access) => {
    if (!isAdmin) {
      setError("Only admins can change access.");
      return;
    }
    setEmployees(
      employees.map((emp) => (emp.email === email ? { ...emp, access } : emp))
    );
    alert(`Access for ${email} set to ${access}`);
    // TODO: Update Firestore
  };

  if (!isAdmin) {
    return (
      <div className="p-4 bg-gray-50 rounded-md">
        <p className="text-sm text-red-600">Access restricted to admins.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {/* Company Registration */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Register Company
        </h3>
        <form onSubmit={handleCompanySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Logo URL
            </label>
            <input
              type="url"
              value={company.logo}
              onChange={(e) => setCompany({ ...company, logo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Domain
            </label>
            <input
              type="text"
              value={company.domain}
              onChange={(e) =>
                setCompany({ ...company, domain: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="acme.com"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
            Register
          </button>
        </form>
      </div>
      {/* Invite Employee */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Invite Employee
        </h3>
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={invite.email}
              onChange={(e) => setInvite({ ...invite, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
              placeholder={`employee@${company.domain || "domain.com"}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={invite.role}
              onChange={(e) => setInvite({ ...invite, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm">
              <option value="Admin">Admin</option>
              <option value="Analyst">Analyst</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
            Send Invite
          </button>
        </form>
      </div>
      {/* Employee Management */}
      {employees.length > 0 && (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Employees
          </h3>
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Join Date</th>
                <th className="p-2 text-left">Access</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.email}>
                  <td className="p-2">{emp.email}</td>
                  <td className="p-2">{emp.role}</td>
                  <td className="p-2">{emp.joinDate}</td>
                  <td className="p-2">
                    <select
                      value={emp.access}
                      onChange={(e) =>
                        handleAccessChange(emp.email, e.target.value)
                      }
                      className="border border-gray-300 rounded-md">
                      <option value="View">View</option>
                      <option value="Edit">Edit</option>
                      <option value="Full">Full</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleRevoke(emp.email)}
                      className="text-red-600 hover:underline">
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompanyAdmin;
