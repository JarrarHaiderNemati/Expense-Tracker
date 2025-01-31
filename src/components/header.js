import { useEffect, useState } from "react";

function Header() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!sessionStorage.getItem("user_email")) {
      alert("Error fetching user email");
      return;
    }
    const email = sessionStorage.getItem("user_email");
    const fetchPhoto = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/getPhoto/${email}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data.photo);
        }
      } catch (err) {
        console.error("Error fetching photo:");
      }
    };
    fetchPhoto();
  }, []);

  const uploadPhot = async (e) => {
    const userEmail=sessionStorage.getItem('user_email');
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const base64 = fileReader.result;
        try {
          const response = await fetch("http://localhost:5000/user/uploadPhoto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_email: userEmail, photo: base64 }),
          });
          if (response.ok) {
            const ans = await response.json();
            setProfile(ans.photo);
          }
        } catch (err) {
          console.error("Error uploading photo!");
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const removeProf=async()=>{
    const email = sessionStorage.getItem("user_email");
    const reqs=await fetch(`http://localhost:5000/user/removePhoto/${email}`);

    if(reqs.ok) {
      setProfile(null);
      alert('Profile removed ! ');
      return;
    }
    console.error('Some error occured');
  }

  return (
    <div className="bg-blue-400 text-white py-4 px-6 flex justify-between items-center shadow-md">
      {/* Title Section */}
      <div className="text-2xl font-bold">Expense Tracker</div>

      {/* Profile Section */}
      <div className="flex items-center space-x-4">
        <span>Profile</span>
        {profile ? (
          <img
            src={profile}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer"
          />
        ) : (
          <img
            src="/profile.jpg"
            alt="Default Profile"
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer"
          />
        )}

        <label
          htmlFor="photoUpload"
          className="cursor-pointer bg-white text-blue-400 px-3 py-1 rounded-md shadow-md hover:bg-gray-100"
        >
          Change Photo
        </label>
        <input
          id="photoUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={uploadPhot}
        />

        {/* Remove Profile Button */}
        {profile&&
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-red-600"
          onClick={removeProf} // Replace this with your logic
        >
          Remove Profile
        </button>
}
      </div>
    </div>
  );
}

export default Header;
