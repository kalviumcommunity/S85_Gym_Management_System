import React, { useEffect, useState } from "react";
import axios from "axios";

const MembersList = () => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/api/members")  // Adjust API route
            .then(response => {
                setMembers(response.data);
            })
            .catch(error => {
                console.error("Error fetching members:", error);
            });
    }, []);

    return (
        <div>
            <h2>Gym Members Details</h2>
            <ol>
                {members.map(member => (
                    <li>
            <h3>{member.name}</h3>
                    <p>Membership: {member.membershipType}</p>
                    <p>Email: {member.email}</p>
                    <p>Phone: {member.phone}</p>
                    <p>Status: {member.status}</p>
                    <p>Joined: {new Date(member.joiningDate).toDateString()}</p>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default MembersList;
