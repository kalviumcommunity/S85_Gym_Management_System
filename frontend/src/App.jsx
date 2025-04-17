import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import MembersList from "./components/MembersList/MembersList";
import AddMember from "./components/AddMember/AddMember";
import UpdateMember from "./components/UpdateMember/UpdateMember";
import Home from "./components/Home/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EntityDetail from "./components/EntityDetail"; // Import the EntityDetail page
import "./App.css";
import EntityList from "./components/EntityList";

function App() {
  const [updateFlag, setUpdateFlag] = useState(false);

  const refreshMembers = () => {
    setUpdateFlag(prev => !prev);
  };

  return (
    <>
      <div className="page-content">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddMember onMemberAdded={refreshMembers} />} />
          <Route path="/members" element={<MembersList key={updateFlag} />} />
          <Route path="/update/:id" element={<UpdateMember />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/entity" element={<EntityDetail />} />
        <Route path="/entity/:id" element={<EntityDetail />} /> {/* Dynamic route for entity details */}
        </Routes>
      </div>
    </>
  );
}

export default App;
