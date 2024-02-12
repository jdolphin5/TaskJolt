import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import ContentArea from "./ContentArea";

const MainContainer: React.FC = () => {
  return (
    <div
      style={{
        padding: "0",
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: "0px",
      }}
    >
      <div style={{ width: "200px", backgroundColor: "#e0e0e0" }}>
        <Navigation />
      </div>
      <div style={{ backgroundColor: "#f0f0f0" }}>
        <ContentArea />
      </div>
    </div>
  );
};
export default MainContainer;
