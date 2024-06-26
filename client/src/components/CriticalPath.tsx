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
        <p>Select a project to calculate the critical path: </p>

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
              {taskDetails.length == 0 && (
                <div>
                  <strong>This project has no tasks.</strong>
                </div>
              )}
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
                <div>
                  <strong>This project has no critical tasks.</strong>
                </div>
              )}
            </div>
          )}
        </Form>
        <h3>Critical Path Method (CPM)</h3>
        <p>
          The Critical Path Method (CPM) is a project management technique used
          to identify the sequence of crucial steps, or "tasks," that determine
          the minimum completion time for a project. By focusing on these
          critical tasks, project managers can better allocate resources,
          prioritize activities, and anticipate potential delays.
        </p>

        <h4>Understanding the Critical Path</h4>
        <p>
          In any project, tasks have dependencies, meaning some tasks cannot
          start until others are completed. The critical path is the longest
          path through the project's task dependency network, dictating the
          shortest possible project duration. Tasks on the critical path are
          "critical" because any delay in these tasks directly extends the
          project's overall timeline.
        </p>

        <h4>Calculating the Critical Path</h4>
        <ol>
          <li>
            <strong>List Tasks and Dependencies:</strong> Identify all tasks
            required to complete the project and determine the dependencies
            between them. Each task should have an estimated duration.
          </li>
          <li>
            <strong>Create a Network Diagram:</strong> Draw a network diagram
            representing the sequence of tasks and their dependencies. Use nodes
            for tasks and arrows to show dependencies.
          </li>
          <li>
            <strong>Forward Pass (Early Start and Finish Times):</strong> Start
            from the project's beginning and calculate the earliest start (ES)
            and earliest finish (EF) times for each task. The ES of a task is
            the maximum EF of all its predecessor tasks, and the EF is the ES
            plus the task's duration.
          </li>
          <li>
            <strong>Backward Pass (Late Start and Finish Times):</strong> Start
            from the project's end and calculate the latest finish (LF) and
            latest start (LS) times for each task. The LF of a task is the
            minimum LS of all its successor tasks, and the LS is the LF minus
            the task's duration.
          </li>
          <li>
            <strong>Determine the Critical Path:</strong> Identify tasks where
            the ES equals the LS (and EF equals LF). These tasks have zero slack
            (float) and form the critical path. Any delay in these tasks will
            directly delay the project's completion.
          </li>
        </ol>

        <h4>Example</h4>
        <p>Consider a simple project with the following tasks and durations:</p>
        <ul>
          <li>Task A (2 days)</li>
          <li>Task B (4 days), dependent on A</li>
          <li>Task C (3 days), dependent on A</li>
          <li>Task D (1 day), dependent on B and C</li>
        </ul>
        <p>The critical path would be calculated as follows:</p>
        <h5>Forward Pass</h5>
        <ul>
          <li>Task A: ES = 0, EF = 2 (0 + 2)</li>
          <li>Task B: ES = 2, EF = 6 (2 + 4)</li>
          <li>Task C: ES = 2, EF = 5 (2 + 3)</li>
          <li>Task D: ES = 6, EF = 7 (6 + 1)</li>
        </ul>
        <h5>Backward Pass</h5>
        <ul>
          <li>Task D: LF = 7, LS = 6 (7 - 1)</li>
          <li>Task B: LF = 6, LS = 2 (6 - 4)</li>
          <li>Task C: LF = 6, LS = 3 (6 - 3)</li>
          <li>Task A: LF = 2, LS = 0 (2 - 2)</li>
        </ul>
        <h5>Critical Path</h5>
        <p>
          Tasks A, B, and D form the critical path with zero slack, as any delay
          in these tasks will delay the project's completion. Task C has some
          slack and is not on the critical path.
        </p>
        <p>
          By identifying and monitoring the critical path, project managers can
          focus their attention on the most crucial tasks to ensure the project
          stays on schedule.
        </p>
      </div>
    </div>
  );
};

export default CriticalPath;
