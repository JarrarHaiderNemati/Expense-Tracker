import React, { useState } from "react";

function LastWeekExpenses() {
  const [lastExpenses, setExpenses] = useState([]);
  const [showIt, setShow] = useState(false);

  const getExpenses = async () => {
    if (!showIt) {
      try {
        const reqs = await fetch("http://localhost:5000/lastWeekExpenses");
        if (reqs.ok) {
          const resp = await reqs.json();
          if (resp.length !== 0) {
            setExpenses(resp);
          }
        } else {
          alert("Some error occurred!");
        }
      } catch (error) {
        console.error("Error fetching last week expenses");
        alert("An error occurred while fetching expenses.");
      }
    } else {
      setExpenses([]);
    }

    setShow(!showIt);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* Title Section */}
      <div className="text-4xl font-bold text-purple-600 mb-8 text-center">
        Last Week's Expenses
      </div>

      {/* Fetch Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={getExpenses}
          className="bg-purple-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out"
        >
          {showIt
            ? "Hide Last Week's Expenses"
            : "Show Last Week's Expenses"}
        </button>
      </div>

      {/* Expenses List Section */}
      <div className="bg-gray-100 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Expenses List
        </h2>
        <ul className="divide-y divide-gray-300">
          {/* No Expenses Found */}
          {showIt && lastExpenses.length === 0 && (
            <p className="text-gray-500 text-center">No expenses found.</p>
          )}

          {/* Expense Items */}
          {lastExpenses.length > 0 &&
            lastExpenses.map((element, index) => (
              <li
                key={index}
                className="py-4 px-4 flex justify-between items-center bg-white rounded-md shadow-md mb-4 hover:shadow-lg transition duration-300 ease-in-out"
              >
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    {element.name}
                  </p>
                  <p className="text-sm text-gray-500">{element.category}</p>
                </div>
                <span className="text-xl font-bold text-green-600">
                  ${element.amount}
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default LastWeekExpenses;
