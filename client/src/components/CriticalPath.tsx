import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";
import { TasksProps } from "../Types";
import { fetchTasksAndDependencies } from "../APIFunc";

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

const CriticalPath: React.FC<TasksProps> = ({
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
  const [form] = Form.useForm();

  const [tasks, setTasks] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [taskDetails, setTaskDetails] = useState([]);
  const [criticalTasks, setCriticalTasks] = useState([]);

  interface formInterface {
    project?: number;
  }

  const [formData, setFormData] = useState<formInterface>({});

  const handleSelectChange = (value: any, field: string) => {
    setFormData({ ...formData, [field]: value });
  };

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
    if (formData.project) {
      const fetchData = async (projectId: number) => {
        const { tasks, dependencies } = await fetchTasksAndDependencies(
          projectId
        );
        setTasks(tasks);
        setDependencies(dependencies);

        const { taskDetails, criticalTasks } = calculateCPM(
          tasks,
          dependencies
        );
        setTaskDetails(taskDetails);
        setCriticalTasks(criticalTasks);
      };

      fetchData(formData.project);
    }
  }, [formData.project]);

  return (
    <div style={{ padding: "0px 15px 0px 15px" }}>
      <h1 style={{ textAlign: "center" }}>Critical Path</h1>
      <div style={{ padding: "0px 0px 5px 0px" }}>
        <p>Select a project to calculate the critical path</p>

        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          style={{
            maxWidth: 600,
          }}
          //onFinish={handleSubmit}
          form={form}
          //initialValues={}
        >
          <Form.Item name="project" label="Project">
            <Select onChange={(evt) => handleSelectChange(evt, "project")}>
              {projectData ? (
                projectData.map(
                  ({ id, name }: { id: number; name: string }) => (
                    <Select.Option key={id} value={id}>
                      {name}
                    </Select.Option>
                  )
                )
              ) : (
                <Select.Option disabled value={null}>
                  No projects available
                </Select.Option>
              )}
            </Select>
          </Form.Item>
          {formData.project && (
            <div>
              {taskDetails.length > 0 && (
                <div>
                  <h2>Tasks</h2>
                  <ul>
                    {taskDetails.map((task: any) => (
                      <li key={task.id}>
                        Task {task.id} - {task.name}: {<br />}Early Start:{" "}
                        {task.earlyStart}, Late Start: {task.lateStart}, Early
                        Finish: {task.earlyFinish}, Late Finish:{" "}
                        {task.lateFinish}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {taskDetails.length == 0 && <div>This project has no tasks.</div>}
              {criticalTasks.length > 0 && (
                <div>
                  <h2>Critical Tasks</h2>
                  <ul>
                    {criticalTasks.map((task: any) => (
                      <li key={task.id}>
                        Task {task.id} - {task.name}: {<br />}Early Start:{" "}
                        {task.earlyStart}, Late Start: {task.lateStart}, Early
                        Finish: {task.earlyFinish}, Late Finish:{" "}
                        {task.lateFinish}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {taskDetails.length > 0 && criticalTasks.length == 0 && (
                <div>This project has no critical tasks.</div>
              )}
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default CriticalPath;
