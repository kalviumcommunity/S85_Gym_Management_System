import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import MembersList from "./components/MembersList/MembersList";
import AddMember from "./components/AddMember/AddMember";
import UpdateMember from "./components/UpdateMember/UpdateMember";
import Home from "./components/Home/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

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
      </Routes>
      </div>
    </>
  );
}

export default App;
// src="https://media.istockphoto.com/id/1925398083/photo/3d-render-gym-fitness-wellness-center.webp?a=1&b=1&s=612x612&w=0&k=20&c=IvMQVRJsAHi6pe1dPmk6n_Uq7ctB6UlQutOmLO8UbG4="
