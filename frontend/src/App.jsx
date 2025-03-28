import React from "react";
import { useState } from "react";
import GymCard from "./components/GymCard"; // Import the reusable component
import MembersList from "./components/MembersList";
import AddMember from "./components/AddMember";
function App() {
  const [updateFlag, setUpdateFlag] = useState(false);

  const refreshMembers = () => {
      setUpdateFlag(prev => !prev);
  };
  return (
    <>
    
    {/* <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <GymCard name="Madhav Garg" membershipType="Diamond" status="Active" joiningDate="01 Jan 2024" />
      <GymCard name="Tanmay Bhatt" membershipType="Gold" status="Inactive" joiningDate="15 Feb 2023" />
      <GymCard name="Nishant" membershipType="Platinum" status="Active" joiningDate="10 Mar 2022" />
    </div> */}
    <div>
            <h1 style={{color:"black"}}>Gym Management</h1>
            <AddMember onMemberAdded={refreshMembers} />
            <MembersList key={updateFlag}/>
            
        </div>

    </>
    
  );
}

export default App;
