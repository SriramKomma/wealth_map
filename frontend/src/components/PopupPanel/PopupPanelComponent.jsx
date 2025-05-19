import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const PopupPanel = ({ selectedItem, onClose, onViewProfile }) => {
  if (!selectedItem || !selectedItem.wealthBreakdown) return null;

  const data = Object.entries(selectedItem.wealthBreakdown).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 w-[95%] max-w-md z-[1000]">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-lg font-semibold">{selectedItem.name}</h2>
          <p className="text-sm text-gray-600">Net Worth: {selectedItem.netWorth}</p>
          <p className="text-sm text-gray-600">Company: {selectedItem.company}</p>
          <p className="text-sm text-gray-600">Industry: {selectedItem.industry}</p>
          <p className="text-sm text-gray-600">Role: {selectedItem.role}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 text-xl font-bold">
          ×
        </button>
      </div>

      <div className="text-sm font-bold mb-2">Wealth Breakdown</div>
      <div className="flex justify-center">
        <div className="w-[100%] sm:w-[250px]">
          <PieChart width={250} height={250}>
            <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      <button
        onClick={() => onViewProfile(selectedItem)}
        className="mt-4 w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700"
      >
        View Full Profile
      </button>
    </div>
  );
};

export default PopupPanel;
