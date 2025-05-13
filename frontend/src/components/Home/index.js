import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./index.css";

// Dummy property data
const properties = [
  {
    id: 1,
    position: [40.7128, -74.006], // New York City
    address: "123 Broadway, NY",
    price: "$500,000",
  },
  {
    id: 2,
    position: [40.7282, -73.986], // East Village, NY
    address: "456 E 10th St, NY",
    price: "$750,000",
  },
  {
    id: 3,
    position: [40.758, -73.9855], // Times Square, NY
    address: "789 7th Ave, NY",
    price: "$1,200,000",
  },
];

// Dummy member data
const members = [
  {
    id: 1,
    name: "John Doe",
    position: [40.7128, -74.006], // NYC
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
});
const memberIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconSize: [38, 62],
  iconAnchor: [19, 62],
});

const Home = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState([40.7128, -74.006]); // Default: NYC

  // Filter properties and members based on search query
  const filteredProperties = properties.filter((property) =>
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update map center when a property or member is found (use first match)
  const handleSearch = () => {
    if (filteredProperties.length > 0) {
      setMapCenter(filteredProperties[0].position);
    } else if (filteredMembers.length > 0) {
      setMapCenter(filteredMembers[0].position);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Wealth<span className="text-gold-600">Map</span>
          </h1>
          <div className="text-sm text-gray-600">
            Welcome, {user?.email || "User"}
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Property & Member Map
        </h2>
        {/* Search Bar */}
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search properties or members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200">
            Search
          </button>
        </div>
        <div className="map-container">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "500px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Property Markers */}
            {filteredProperties.map((property) => (
              <Marker
                key={`property-${property.id}`}
                position={property.position}
                icon={propertyIcon}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-gray-900">
                      {property.address}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Price: {property.price}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {/* Member Markers */}
            {filteredMembers.map((member) => (
              <Marker
                key={`member-${member.id}`}
                position={member.position}
                icon={memberIcon}>
                <Popup>
                  <div className="w-[280px] p-4 bg-white rounded-lg shadow-md animate-fadeIn">
                    <div className="flex items-center mb-2">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          member.name
                        )}&size=40`}
                        alt={member.name}
                        className="w-10 h-10 rounded-full mr-2"
                      />
                      <h3 className="font-bold text-gray-900">{member.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Net Worth:</span>{" "}
                      {member.netWorth}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Company:</span>{" "}
                      {member.company}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Industry:</span>{" "}
                      {member.industry}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Role:</span> {member.role}
                    </p>
                    <button
                      className="mt-3 w-full bg-blue-600 text-white py-1 rounded-md text-sm hover:bg-blue-700 transition duration-200"
                      onClick={() => alert("View Full Profile clicked!")}>
                      View Full Profile
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  );
};

export default Home;
