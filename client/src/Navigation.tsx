import React, { useState, useEffect } from "react";

const Navigation: React.FC = () => {
  const [showHideMainMenu, setShowHideMainMenu] = useState(false);

  const openMainMenu = (): void => {
    console.log("clicked");
    setShowHideMainMenu(!showHideMainMenu);
  };
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
            <li style={{ padding: "7px 0px 0px 0px" }}>Menu Item 1</li>
            <li style={{ padding: "7px 0px 0px 0px" }}>Menu Item 2</li>
            <li style={{ padding: "7px 0px 0px 0px" }}>Menu Item 3</li>
            <li style={{ padding: "7px 0px 0px 0px" }}>Menu Item 4</li>
            <li style={{ padding: "7px 0px 0px 0px" }}>Menu Item 5</li>
            <li style={{ padding: "7px 0px 0px 0px" }}>Menu Item 6</li>
          </ul>
        )}
      </div>
    </>
  );
};
export default Navigation;
