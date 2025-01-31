import { useEffect, useState } from "react";
import { useRef } from "react";

function Body() {
  const [isToggled, setToggle] = useState(false);
  const [name, setName] = useState("");
  const [category, setCat] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpense] = useState([]);
  const [value, setValue] = useState("");
  const [searching, setSearch] = useState(false);

  const letsDelete=async(Ename)=>{
    const reqs=await fetch('http://localhost:5000/deleteExp',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        name:Ename,
      })
    })
    if(reqs.ok) {
      setExpense(
        expenses.filter((el)=>el.name!==Ename)
      )
    }
  }; 

  const timerRef=useRef(null);
  const handleChange = (e) => {
    clearTimeout(timerRef.current);
    const inputValue = e.target.value;
    setValue(inputValue);
    timerRef.current = setTimeout(() => {
      getExpense(inputValue);
    }, 300); // Delay by 300ms
  };

  const getExpense = async (inputVal) => {
    setSearch(false);
    if (!inputVal) {
      try {
        const response = await fetch("http://localhost:5000/getExpenses");
        if (!response.ok) {
          throw new Error("Failed to fetch expenses.");
        }
        const data = await response.json();
        setExpense(data);
      } catch (error) {
        console.error("Error fetching expenses:");
        alert("Could not load expenses. Please try again later.");
      }
      return;
    }

    const request = await fetch(`http://localhost:5000/searchQuery?name=${inputVal}`);
    if (request.ok) {
      const response = await request.json();
      if (response.length === 0) {
        setSearch(true);
        return;
      } else {
        setSearch(false);
        setExpense(response);
      }
    }
    setSearch(false);
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("http://localhost:5000/getExpenses");
        if (!response.ok) {
          throw new Error("Failed to fetch expenses.");
        }
        const data = await response.json();
        setExpense(data);
      } catch (error) {
        console.error("Error fetching expenses:");
        alert("Could not load expenses. Please try again later.");
      }
    };

    fetchExpenses();
  }, []);


  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current); // Clear the timer on unmount
    };
  }, []);
  

  const addExpense = () => {
    setToggle(true);
  };

  const sendData = async () => {
    if (!name || !category || !amount) {
      alert("Please enter all values!");
      return;
    }

    setToggle(false);
    const user_email = sessionStorage.getItem("user_email");

    try {
      const response = await fetch("http://localhost:5000/putData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, category, amount, user_email: user_email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send data.");
      }

      const newData = { name, category, amount };
      setExpense([...expenses, newData]);
      console.log("Data sent successfully");

      setName("");
      setCat("");
      setAmount("");
    } catch (error) {
      console.error("Error sending data");
      alert("An error occurred while sending the data.");
    }
  };

  const setValues = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setName(value);
    } else if (name === "cat") {
      setCat(value);
    } else if (name === "amount") {
      setAmount(value);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      {/* Title Section */}
      <div className="text-3xl font-bold text-blue-500 mb-6 text-center">
        Your Expenses
      </div>

      {/* Search Section */}
      <div className="flex justify-center items-center gap-4 mb-6">
        {/* Search Box */}
        <input
          className="border rounded-md p-2 w-full max-w-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          type="search"
          autoComplete="off"
          value={value}
          placeholder="Search expenses by name..."
          onChange={(e) => handleChange(e)}
        />

      </div>

      {/* Add Expense Button */}
      <div className="flex justify-center mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
          onClick={() => setToggle(!isToggled)}
        >
          {isToggled ? "Cancel" : "Click Here To Add Expense"}
        </button>
      </div>

      {/* Expense Form */}
      {isToggled && (
        <div className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            name="name"
            value={name}
            autoComplete="off"
            className="border rounded-md p-2"
            placeholder="Enter expense name"
            onChange={setValues}
          />

          <select
            name="cat"
            value={category}
            onChange={setValues}
            className="border rounded-md p-2"
          >
            <option value="" disabled>
              Select item
            </option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="entertainment">Entertainment</option>
          </select>

          <input
            type="text"
            name="amount"
            value={amount}
            autoComplete="off"
            className="border rounded-md p-2"
            placeholder="Enter the amount"
            onChange={setValues}
          />

          <button
            onClick={sendData}
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md"
          >
            Add Expense
          </button>
        </div>
      )}

      {/* Expenses List Section */}
<div className="bg-gray-100 rounded-lg shadow-md p-6 mt-6">
  <h2 className="text-xl font-semibold text-gray-700 mb-4">Expenses List</h2>
  <ul className="divide-y divide-gray-300">
    {expenses.length > 0 && !searching ? (
      expenses.map((element, index) => (
        <li
          key={index}
          className="py-3 flex justify-between items-center"
        >
          <span className="text-lg font-medium">{element.name}</span>
          <span className="text-lg font-medium">{element.category}</span>
          <span className="text-green-600 font-bold">{element.amount}</span>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-red-600"
            onClick={()=>letsDelete(element.name)}
          >
            Delete
          </button>
        </li>
      ))
    ) : (
      <p className="text-gray-500 text-center">No expenses found.</p>
    )}
  </ul>
</div>

    </div>
  );
}

export default Body;
