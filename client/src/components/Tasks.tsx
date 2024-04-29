import React, { useState, useEffect } from "react";
import { Table, Tabs, Button } from "antd";
import type { TabsProps } from "antd";
import { Link } from "react-router-dom";
import { Task, TasksProps } from "./Types";
import TasksTable from "./TasksTable";

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
      startdate: "1/3/12",
      starttime: "09:00",
      duedate: "2/2/22",
      duetime: "09:00",
      recurring: "no",
      is_complete: 0,
    },
  ]);

  useEffect(() => {
    if (!tasksPageLoaded) {
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

      console.log("initialising useEffect to load projects and tasks");

      loadProjects();
      loadTasks();
    }
  }, [tasksPageLoaded]);

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
            const singleTaskStartDate: Date = new Date(
              taskData[i].start_date_time
            );

            const startDay = String(singleTaskStartDate.getDate()).padStart(
              2,
              "0"
            );
            const startMonth = String(
              singleTaskStartDate.getMonth() + 1
            ).padStart(2, "0");
            const startYear = String(singleTaskStartDate.getFullYear());
            const formattedStartDate = `${startDay}/${startMonth}/${startYear}`;

            const startHour = singleTaskStartDate.getHours() % 12 || 12; // Convert to 12-hour format
            const startMinute = String(
              singleTaskStartDate.getMinutes()
            ).padStart(2, "0");

            const startMeridiem =
              singleTaskStartDate.getHours() >= 12 ? "PM" : "AM";
            const startFormattedTime = `${startHour}:${startMinute} ${startMeridiem}`;

            const singleTaskDueDate: Date = new Date(taskData[i].due_date_time);

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
              startdate: formattedStartDate,
              starttime: startFormattedTime,
              duedate: formattedDueDate,
              duetime: dueFormattedTime,
              recurring: isRecurring,
              is_complete: taskData[i].is_complete,
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
        <Link to={`/EditTask/${data.key}`}>{data.taskName}</Link>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
    },
    {
      title: "Start Date",
      dataIndex: "startdate",
      key: "startdate",
    },
    {
      title: "Start Time",
      dataIndex: "starttime",
      key: "starttime",
    },
    {
      title: "Due Date",
      dataIndex: "duedate",
      key: "duedate",
    },
    {
      title: "Due Time",
      dataIndex: "duetime",
      key: "duetime",
    },
    {
      title: "Recurring",
      dataIndex: "recurring",
      key: "recurring",
    },
  ];

  let ongoingTasks: Task[] = [];

  if (formattedTaskData) {
    ongoingTasks = formattedTaskData.filter((task) => task.is_complete === 0);
  }

  const ongoingTasksDataSource = ongoingTasks.map((task, index) => ({
    ...task,
  }));

  let completeTasks: Task[] = [];

  if (formattedTaskData) {
    completeTasks = formattedTaskData.filter((task) => task.is_complete === 1);
  }

  const completeTasksDataSource = completeTasks.map((task, index) => ({
    ...task,
  }));

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Ongoing",
      children: (
        <TasksTable
          dataSource={ongoingTasksDataSource}
          columns={columns}
          pageSize={15}
        />
      ),
    },
    {
      key: "2",
      label: "Completed",
      children: (
        <TasksTable
          dataSource={completeTasksDataSource}
          columns={columns}
          pageSize={15}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "0px 15px 0px 15px" }}>
      <h1 style={{ margin: "0px 0px 10px 0px", textAlign: "center" }}>
        Task List
      </h1>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};
export default Tasks;
