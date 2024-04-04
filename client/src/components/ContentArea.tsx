import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Tasks from "./Tasks";
import EditTask from "./EditTask";

const ContentArea: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="tasks" element={<Tasks />} />
      <Route path="/edittask/:key" element={<EditTask />} />
    </Routes>
  );
};
export default ContentArea;
