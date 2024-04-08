import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Tasks from "./Tasks";
import EditTask from "./EditTask";
import axios from "axios";

const tasksAPIUrl = "http://localhost:3000/api/tasks";

async function fetchData() {
  try {
    const response = await axios.get(tasksAPIUrl);

    console.log(response);
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
