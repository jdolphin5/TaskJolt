import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Tasks from "./Tasks";
import AddTask from "./AddTask";
import axios from "axios";

async function fetchProjectData() {
  try {
    const response = await axios.get("http://localhost:3000/api/projects");

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchTaskData(projectData: any) {
  try {
    const formattedProjectIds = projectData.map((project: { id: number }) => [
      project.id,
    ]);

    if (Array.isArray(formattedProjectIds)) {
      const response = await axios.get(
        `http://localhost:3000/api/tasks?projectIds=${formattedProjectIds.join(
          ","
        )}`
      );

      console.log(response);

      return response.data;
    } else {
      console.log("projectIds is null");

      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const ContentArea: React.FC = () => {
  const [tasksPageLoaded, setTasksPageLoaded] = useState(false);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [projectData, setProjectData] = useState<any | null>(null);
  const [taskData, setTaskData] = useState<any>(null);

  useEffect(() => {
    if (tasksPageLoaded) {
      fetchProjectData()
        .then((projectData) => {
          console.log("success");
          /*
          const formattedProjectIds = projectData.map(
            (project: { id: number }) => project.id
          );
          setProjectData(formattedProjectIds);

          */

          //do not include projectID === 2
          const filteredProjectIds = projectData?.filter(
            (project: { id: number }) => project.id !== 2
          );

          setProjectData(filteredProjectIds);
          setProjectsLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching project data:", error);
        });
    }
  }, [tasksPageLoaded]);

  useEffect(() => {
    if (projectsLoaded) {
      fetchTaskData(projectData).then((tasksLoadedData) => {
        console.log("success tasks loaded");
        const formattedTaskData = tasksLoadedData;
        setTaskData(formattedTaskData);
        setTasksLoaded(true);
      });
    }
  }, [projectsLoaded]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="tasks"
        element={
          <Tasks
            tasksPageLoaded={tasksPageLoaded}
            setTasksPageLoaded={setTasksPageLoaded}
            projectsLoaded={projectsLoaded}
            setProjectsLoaded={setProjectsLoaded}
            tasksLoaded={tasksLoaded}
            setTasksLoaded={setTasksLoaded}
            projectData={projectData}
            setProjectData={setProjectData}
            taskData={taskData}
            setTaskData={setTaskData}
          />
        }
      />
      <Route
        path="/addtask/:key"
        element={
          <AddTask
            tasksPageLoaded={tasksPageLoaded}
            setTasksPageLoaded={setTasksPageLoaded}
            projectsLoaded={projectsLoaded}
            setProjectsLoaded={setProjectsLoaded}
            tasksLoaded={tasksLoaded}
            setTasksLoaded={setTasksLoaded}
            projectData={projectData}
            setProjectData={setProjectData}
            taskData={taskData}
            setTaskData={setTaskData}
          />
        }
      />
    </Routes>
  );
};
export default ContentArea;
