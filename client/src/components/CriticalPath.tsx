import React, { useEffect, useState } from "react";
import axios from "axios";

const fetchTasksAndDependencies = async () => {
  const response = await axios.get(
    "http://localhost:3000/api/tasksAndDependencies"
  );
  return response.data;
};

const calculateCPM = (tasks: any, dependencies: any) => {
  // Initialize task details
  const taskDetails = tasks.map((task: any) => ({
    id: task.id,
    duration: task.duration,
    name: task.name,
    earlyStart: 0,
    lateStart: Infinity,
    earlyFinish: task.duration,
    lateFinish: Infinity,
  }));

  // Map tasks by id for easy lookup
  const taskMap = new Map();
  taskDetails.forEach((task: any) => taskMap.set(task.id, task));

  // Forward pass
  dependencies.forEach((dep: any) => {
    const parentTask = taskMap.get(dep.parent_id);
    const childTask = taskMap.get(dep.child_id);
    if (!parentTask || !childTask) {
      console.error(`Missing task in dependencies: ${JSON.stringify(dep)}`);
      return;
    }
    const earlyStart = parentTask.earlyFinish;
    const earlyFinish = earlyStart + childTask.duration;
    childTask.earlyStart = Math.max(childTask.earlyStart, earlyStart);
    childTask.earlyFinish = Math.max(childTask.earlyFinish, earlyFinish);
  });

  // Set initial lateFinish values
  const endTime = Math.max(...taskDetails.map((task: any) => task.earlyFinish));
  taskDetails.forEach((task: any) => {
    task.lateFinish = endTime;
    task.lateStart = endTime - task.duration;
  });

  // Backward pass
  dependencies
    .slice()
    .reverse()
    .forEach((dep: any) => {
      const parentTask = taskMap.get(dep.parent_id);
      const childTask = taskMap.get(dep.child_id);
      if (!parentTask || !childTask) {
        console.error(`Missing task in dependencies: ${JSON.stringify(dep)}`);
        return;
      }
      const lateFinish = childTask.lateStart;
      const lateStart = lateFinish - parentTask.duration;
      parentTask.lateFinish = Math.min(parentTask.lateFinish, lateFinish);
      parentTask.lateStart = Math.min(parentTask.lateStart, lateStart);
    });

  // Identify critical tasks
  const criticalTasks = taskDetails.filter(
    (task: any) => task.earlyStart === task.lateStart
  );

  return { taskDetails, criticalTasks };
};

const CriticalPath = () => {
  const [tasks, setTasks] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [taskDetails, setTaskDetails] = useState([]);
  const [criticalTasks, setCriticalTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { tasks, dependencies } = await fetchTasksAndDependencies();
      setTasks(tasks);
      setDependencies(dependencies);

      const { taskDetails, criticalTasks } = calculateCPM(tasks, dependencies);
      setTaskDetails(taskDetails);
      setCriticalTasks(criticalTasks);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Critical Path Method</h1>
      <h2>Tasks</h2>
      <ul>
        {taskDetails.map((task: any) => (
          <li key={task.id}>
            Task {task.id} - {task.name}: {<br />}Early Start: {task.earlyStart}
            , Late Start: {task.lateStart}, Early Finish: {task.earlyFinish},
            Late Finish: {task.lateFinish}
          </li>
        ))}
      </ul>
      <h2>Critical Tasks</h2>
      <ul>
        {criticalTasks.map((task: any) => (
          <li key={task.id}>
            Task {task.id} - {task.name}: {<br />}Early Start: {task.earlyStart}
            , Late Start: {task.lateStart}, Early Finish: {task.earlyFinish},
            Late Finish: {task.lateFinish}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CriticalPath;
