import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Tasks from "./Tasks";
import EditTask from "./EditTask";

const tasksAPIUrl = "http://localhost:3000/api/tasks";

async function fetchData() {
  try {
    const response = await fetch(tasksAPIUrl);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const ContentArea: React.FC = () => {
  const [tasksLoaded, setTasksLoaded] = useState(false);

  useEffect(() => {
    if (tasksLoaded) {
      fetchData();
    }
  }, [tasksLoaded]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="tasks"
        element={
          <Tasks tasksLoaded={tasksLoaded} setTasksLoaded={setTasksLoaded} />
        }
      />
      <Route path="/edittask/:key" element={<EditTask />} />
    </Routes>
  );
};
export default ContentArea;
