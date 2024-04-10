import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { Link } from "react-router-dom";
import { Task, TasksProps } from "./Types";

const Tasks: React.FC<TasksProps> = ({
  tasksPageLoaded,
  setTasksPageLoaded,
  projectsLoaded,
  setProjectsLoaded,
  tasksLoaded,
  setTasksLoaded,
  projectData,
  setProjectData,
  taskData,
  setTaskData,
}) => {
  const [formattedTaskData, setFormattedTaskData] = useState<Task[] | null>([
    {
      key: 3,
      projectName: "Project 1",
      taskName: "Task 3",
      priority: "Low",
      date: "1/3/12",
      time: "09:00",
      recurring: "no",
    },
  ]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setTasksPageLoaded(true);
      } catch (error) {
        console.error("Error loading projects: ", error);
      }
    };

    const loadTasks = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };

    console.log("initialating useEffect to load projects and tasks");

    loadProjects();
    loadTasks();
  }, []);

  useEffect(() => {
    const formatTaskData = (taskData: any) => {
      try {
        let newTaskData = [];
        let projectIdToNameMap = new Map<number, string>();

        if (projectData !== null && projectData !== undefined) {
          for (let i = 0; i < projectData.length; i++) {
            projectIdToNameMap.set(projectData[i].id, projectData[i].name);
          }
        }

        if (taskData !== null && taskData !== undefined) {
          for (let i = 0; i < taskData.length; i++) {
            const singleTaskDueDate: Date = new Date(
              taskData[i].start_date_time
            );

            const dueDay = String(singleTaskDueDate.getDate()).padStart(2, "0");
            const dueMonth = String(singleTaskDueDate.getMonth() + 1).padStart(
              2,
              "0"
            );
            const dueYear = String(singleTaskDueDate.getFullYear());
            const formattedDueDate = `${dueDay}/${dueMonth}/${dueYear}`;

            const dueHour = singleTaskDueDate.getHours() % 12 || 12; // Convert to 12-hour format
            const dueMinute = String(singleTaskDueDate.getMinutes()).padStart(
              2,
              "0"
            );

            const dueMeridiem =
              singleTaskDueDate.getHours() >= 12 ? "PM" : "AM";
            const dueFormattedTime = `${dueHour}:${dueMinute} ${dueMeridiem}`;
            const isRecurring = taskData[i].recurring === 0 ? "no" : "yes";

            const singleTask: Task = {
              key: taskData[i].id,
              projectName: projectIdToNameMap.get(taskData[i].project_id),
              taskName: taskData[i].name,
              priority: taskData[i].priority,
              date: formattedDueDate,
              time: dueFormattedTime,
              recurring: isRecurring,
            };
            newTaskData.push(singleTask);
          }
          setFormattedTaskData(newTaskData);
        } else {
          console.log(
            "taskData null or undefined when calling formatTaskData()"
          );
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };

    formatTaskData(taskData);
  }, [tasksLoaded]);

  const columns = [
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "Task Name",
      dataIndex: "taskName",
      key: "taskName",
      //the render function receives three arguments from the antd table component
      render: (text: string, data: any, index: number) => (
        <Link to={`/AddTask/${data.key}`}>{data.taskName}</Link>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
    },
    {
      title: "Due Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Due Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Recurring",
      dataIndex: "recurring",
      key: "recurring",
    },
  ];

  /*
  const taskData = [
    {
      key: "1",
      projectName: "Project 1",
      taskName: "Task 1",
      priority: "High",
      date: "12/12/12",
      time: "09:00",
      recurring: "yes",
    },
    {
      key: "2",
      projectName: "Project 1",
      taskName: "Task 2",
      priority: "Medium",
      date: "1/6/12",
      time: "09:00",
      recurring: "yes",
    },
    {
      key: "3",
      projectName: "Project 1",
      taskName: "Task 3",
      priority: "Low",
      date: "1/3/12",
      time: "09:00",
      recurring: "no",
    },
  ];
  */
  const dataSource = formattedTaskData?.map((task, index) => ({
    ...task,
    key: index.toString(),
  }));

  return (
    <div style={{ padding: "0px 15px 0px 15px" }}>
      <h1 style={{ margin: "0px 0px 10px 0px", textAlign: "center" }}>
        Task List
      </h1>
      <div style={{ margin: "0px 0px 10px 0px" }}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 15 }}
        />
        <Button>Add task</Button>
        <p>
          To view a task's notes, or to edit a task, simply click on the task
          name.
        </p>
      </div>
    </div>
  );
};
export default Tasks;
