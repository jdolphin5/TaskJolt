import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const LoggedIn: React.FC = () => {
  const query = useQuery();
  const [userData, setUserData] = useState<any>(null);

  const dataJSON = query.get("userData");

  useEffect(() => {
    if (dataJSON) {
      const data = JSON.parse(decodeURIComponent(dataJSON));
      setUserData(data);
    }
  }, [dataJSON]);
  return (
    <div style={{ padding: "0px 15px 0px 15px" }}>
      <h1 style={{ textAlign: "center" }}>Logged In</h1>
      <p>Some text</p>
      {userData ? <div>Welcome {userData.name}</div> : <div></div>}
    </div>
  );
};

export default LoggedIn;
