import React, { useState, useEffect } from "react";
import { Button } from "antd";
import axios from "axios";
axios.defaults.withCredentials = true;

const navigate = (url: string) => {
  window.location.href = url;
};

const logout = async () => {
  try {
    const response = await axios.post(`http://localhost:3000/logout`, {
      withCredentials: true,
    });

    //need to use post to return the redirect URI to the frontend
    //if redirecting from the backend, headers are lost and redirect is blocked due to CORS
    navigate(response.data);
  } catch (error: any) {
    console.error("Cannot logout: /logout", error);
  }
};

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
