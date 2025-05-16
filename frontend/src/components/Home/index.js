import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import Sidebar from "../Sidebar";
import "./index.css";
import { useNavigate } from "react-router-dom";


// Dummy property data
const properties = [
  {
    id: 1,
    position: [40.7128, -74.006],
    address: "123 Broadway, NY",
    price: "$500,000",
  },
  {
    id: 2,
    position: [40.7282, -73.986],
    address: "456 E 10th St, NY",
    price: "$750,000",
  },
  {
    id: 3,
    position: [40.758, -73.9855],
    address: "789 7th Ave, NY",
    price: "$1,200,000",
  },
];

// Dummy member data
const members = [
  {
    id: 1,
    name: "John Doe",
    position: [40.7128, -74.006],
    netWorth: "$5,000,000",
    company: "Doe Enterprises",
    industry: "Real Estate",
    role: "CEO",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: [40.7282, -73.986],
    netWorth: "$2,500,000",
    company: "Smith Ventures",
    industry: "Tech",
    role: "CTO",
  },
  {
    id: 3,
    name: "Alice Johnson",
    position: [40.758, -73.9855],
    netWorth: "$3,000,000",
    company: "Johnson Holdings",
    industry: "Finance",
    role: "CFO",
  },
  {
    id: 4,
    name: "Bob Brown",
    position: [40.7306, -73.9352],
    netWorth: "$1,200,000",
    company: "Brown Innovations",
    industry: "Tech",
    role: "Product Manager",
  },
  {
    id: 5,
    name: "Charlie Green",
    position: [40.7495, -73.9874],
    netWorth: "$4,500,000",
    company: "Green Investments",
    industry: "Real Estate",
    role: "Investor",
  },
];

// Custom marker icons
const propertyIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});
const memberIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconSize: [38, 62],
  iconAnchor: [19, 62],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const Home = ({ user }) => {
  const [mapCenter, setMapCenter] = useState([40.7128, -74.006]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [filteredMembers, setFilteredMembers] = useState(members);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mapRef = useRef();

  const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem("user");
      navigate("/login");
      window.location.reload(); 
    };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Hamburger Icon for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-2xl text-gray-900 bg-gray-200 p-2 rounded-md hover:bg-gray-300 transition duration-200"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        ☰
      </button>
      <div className="flex h-screen">
        <Sidebar
          user={user}
          properties={properties}
          members={members}
          setMapCenter={setMapCenter}
          setSelectedItem={setSelectedItem}
          setFilteredProperties={setFilteredProperties}
          setFilteredMembers={setFilteredMembers}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <div
          className={`flex-1 transition-transform duration-300 md:translate-x-0 ${
            isSidebarOpen ? "translate-x-[70%]" : "translate-x-0"
          }`}>
          <header className="bg-gray-900 text-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">
                Wealth<span className="text-gray-400">Map</span>
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Welcome, {user?.email || "User"}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700 transition duration-200"
                >
                  Logout
                </button>
              </div>

            </div>
          </header>
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Property & Member Map
            </h2>
            <button
              onClick={() => {
                setMapCenter([40.7128, -74.006]);
                mapRef.current.setView([40.7128, -74.006], 13);
                setSelectedItem(null);
              }}
              className="mb-2 bg-gray-700 text-gray-100 px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition duration-200">
              Reset View
            </button>
            <div className="map-container">
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "500px", width: "100%" }}
                ref={mapRef}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredProperties.map((property) => (
                  <Marker
                    key={`property-${property.id}`}
                    position={property.position}
                    icon={propertyIcon}
                    eventHandlers={{ click: () => setSelectedItem(property) }}
                  />
                ))}
                {filteredMembers.map((member) => (
                  <Marker
                    key={`member-${member.id}`}
                    position={member.position}
                    icon={memberIcon}
                    eventHandlers={{ click: () => setSelectedItem(member) }}
                  />
                ))}
              </MapContainer>
            </div>
            {selectedItem && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md animate-fadeIn">
                {selectedItem.address ? (
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {selectedItem.address}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Price: {selectedItem.price}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-2">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          selectedItem.name
                        )}&size=40&background=4b5563&color=fff`}
                        alt={selectedItem.name}
                        className="w-10 h-10 rounded-full mr-2"
                      />
                      <h3 className="font-bold text-gray-900">
                        {selectedItem.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Net Worth:</span>{" "}
                      {selectedItem.netWorth}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Company:</span>{" "}
                      {selectedItem.company}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Industry:</span>{" "}
                      {selectedItem.industry}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Role:</span>{" "}
                      {selectedItem.role}
                    </p>
                    <button
                      className="mt-3 w-full bg-gray-700 text-gray-100 py-1 rounded-md text-sm hover:bg-gray-800 transition duration-200"
                      onClick={() => alert("View Full Profile clicked!")}>
                      View Full Profile
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
