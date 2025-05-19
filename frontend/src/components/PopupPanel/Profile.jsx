import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { members } from "../data/members";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet's default icon path
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];


const Profile = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const member =
    state?.member || members.find((m) => m.id === parseInt(id));

  if (!member) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-600">No profile data found.</h1>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4">{member.name}</h1>
      <p className="text-gray-600 mb-1">Net Worth: {member.netWorth}</p>
      <p className="text-gray-600 mb-1">Company: {member.company}</p>
      <p className="text-gray-600 mb-1">Industry: {member.industry}</p>
      <p className="text-gray-600 mb-4">Role: {member.role}</p>

      <h2 className="text-lg font-semibold mb-2">Wealth Breakdown</h2>
      <ul className="list-disc list-inside text-gray-700">
        {Object.entries(member.wealthBreakdown).map(([key, val]) => (
          <li key={key}>
            {key}: ${val.toLocaleString()}
          </li>
        ))}
      </ul>
      {/* Pie Chart Section */}
        <h2 className="text-lg font-semibold mt-6 mb-2">Wealth Distribution</h2>
        <div className="flex justify-center">
        <PieChart width={300} height={300}>
            <Pie
            data={Object.entries(member.wealthBreakdown).map(([key, value]) => ({
                name: key,
                value,
            }))}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
            >
            {Object.keys(member.wealthBreakdown).map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
        </div>

        {/* Location Map */}
        <h2 className="text-lg font-semibold mt-6 mb-2">Location</h2>
        <div className="h-[300px] rounded overflow-hidden">
        <MapContainer
            center={member.position}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={member.position}>
            <Popup>{member.name}</Popup>
            </Marker>
        </MapContainer>
        </div>

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Profile;
