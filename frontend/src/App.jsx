import React, { useState } from "react";
import { Routes, Route } from "react-router-dom"; // Correct import of Routes and Route
import GymCard from "./components/GymCard";
import MembersList from "./components/MembersList";
import AddMember from "./components/AddMember";
import UpdateMember from "./components/UpdateMember";

function App() {
  const [updateFlag, setUpdateFlag] = useState(false);

  // Function to refresh the member list after adding or updating a member
  const refreshMembers = () => {
      setUpdateFlag(prev => !prev); // Toggle to force re-render
  };

  return (
    <>
      <div>
        <h1 style={{ color: "black",justifyContent:"center",display:"flex" }}>Gym Management</h1>

        {/* AddMember Component: Add a new member */}
        <AddMember onMemberAdded={refreshMembers} />

        {/* Routes Component to handle different views */}
        <Routes>
          {/* Route to view and update member details */}
          <Route path="/update/:id" element={<UpdateMember />} />

          {/* Route to view members list, and pass updateFlag as a key to force re-render */}
          <Route path="/" element={<MembersList key={updateFlag} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
