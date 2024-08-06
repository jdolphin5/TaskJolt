import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuthValue, logout } from "../AuthFunc";

const Navigation: React.FC = () => {
  const [showHideMainMenu, setShowHideMainMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const openMainMenu = (): void => {
    console.log("clicked");
    setShowHideMainMenu(!showHideMainMenu);
  };

  useEffect(() => {
    const fetchAuthValue = async () => {
      const value = await getAuthValue();
      console.log("auth from API call", value.isAuth);
      setIsLoggedIn(value.isAuth);
    };

    fetchAuthValue();
  }, []);

  useEffect(() => {
    console.log(isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      <div style={{ padding: "5px 10px 5px 10px", fontSize: "20px" }}>
        <button
          style={{
            border: "0",
            backgroundColor: "inherit",
            width: "100%",
            cursor: "pointer",
            padding: "0",
          }}
          onClick={openMainMenu}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "150px 1fr",
              fontSize: "20px",
            }}
          >
            <div
              style={{
                padding: "0",
                width: "150px",
                fontFamily: "Arial",

                textAlign: "left",
              }}
            >
              ≡ MAIN MENU
            </div>
            {showHideMainMenu && (
              <div style={{ padding: "0px 0px 0px 0px", textAlign: "right" }}>
                X
              </div>
            )}
          </div>
        </button>

        {showHideMainMenu && (
          <ul
            style={{
              margin: "0",
              textAlign: "left",
              padding: "10px 0px 10px 0px",
              listStyleType: "none",
            }}
          >
            <li style={{ padding: "7px 0px 0px 0px" }}>
              <Link to={"/"}>Home</Link>
            </li>
            <li style={{ padding: "7px 0px 0px 0px" }}>
              <Link to={"/Tasks"}>Tasks</Link>
            </li>
            <li style={{ padding: "7px 0px 0px 0px" }}>
              <Link to={"/Tags"}>Tags</Link>
            </li>
            <li style={{ padding: "7px 0px 0px 0px" }}>
              <Link to={"/Dependencies"}>Dependencies</Link>
            </li>
            <li style={{ padding: "7px 0px 0px 0px" }}>
              <Link to={"/CriticalPath"}>Critical Path</Link>
            </li>
            {isLoggedIn ? (
              <li style={{ padding: "7px 0px 0px 0px" }}>
                <Link to={"/Home"}>
                  <span onClick={() => logout()}>Logout</span>
                </Link>
              </li>
            ) : (
              <li style={{ padding: "7px 0px 0px 0px" }}>
                <Link to={"/Login"}>Login</Link>
              </li>
            )}
          </ul>
        )}
      </div>
    </>
  );
};
export default Navigation;
