import React, { useState, useEffect } from "react";
import { Button } from "antd";
import axios from "axios";
axios.defaults.withCredentials = true;
import { logout } from "../AuthFunc";

const LoggedIn: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);

  const getUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/profile`, {
        withCredentials: true,
      });

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
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
};

export default LoggedIn;
