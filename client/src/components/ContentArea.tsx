import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Tasks from "./Tasks";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import Tags from "./Tags";
import Dependencies from "./Dependencies";
import CriticalPath from "./CriticalPath";
import { fetchProjectData, fetchTaskDataWithProjectData } from "../APIFunc";

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
      fetchTaskDataWithProjectData(projectData).then((tasksLoadedData) => {
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
        path="/edittask/:key"
        element={
          <EditTask
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
        path="/addtask"
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
      <Route path="/tags" element={<Tags />} />
      <Route
        path="/dependencies"
        element={
          <Dependencies
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
      <Route path="/criticalpath" element={<CriticalPath />} />
    </Routes>
  );
};
export default ContentArea;
