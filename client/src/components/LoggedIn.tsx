import React, { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

const LoggedIn: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);

  const getUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/profile`);
      //console.log("API Response:", response.data);
      setUserData(response.data);
      return response.data;
    } catch (error: any) {
      console.error("Cannot get user data from /api/profile/", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return (
    <div style={{ padding: "0px 15px 0px 15px" }}>
      <h1 style={{ textAlign: "center" }}>Logged In</h1>
      <p>Some text</p>
      {userData ? <div>Welcome {userData.email}</div> : <div></div>}
    </div>
  );
};

export default LoggedIn;
