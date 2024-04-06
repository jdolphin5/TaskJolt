import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { Link } from "react-router-dom";

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

fetchData();

const Tasks: React.FC = () => {
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

  return (
    <div style={{ padding: "0px 15px 0px 15px" }}>
      <h1 style={{ margin: "0px 0px 10px 0px", textAlign: "center" }}>
        Task List
      </h1>
      <div style={{ margin: "0px 0px 10px 0px" }}>
        <Table dataSource={taskData} columns={columns} />
        <Button>Add task</Button>
        <p>To edit a task, simply click on the task name.</p>
      </div>
    </div>
  );
};
export default Tasks;
