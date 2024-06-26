import React, { useState, useEffect } from "react";
import { Button, Form, Select, Tabs } from "antd";
import type { TabsProps } from "antd";
import { Link } from "react-router-dom";
import { Task, TasksProps, Dependency } from "../Types";
import TasksTable from "./TasksTable";
import {
  fetchDependenciesData,
  deleteNotesByTaskId,
  deleteTaskByTaskId,
} from "../APIFunc";

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
  const testChildTaskIds = [1, 2, 3];

  const [dependenciesLoaded, setDependenciesLoaded] = useState<boolean>(false);
  const [dependenciesData, setDependenciesData] = useState<Dependency[] | null>(
    null
  );

  const [formattedTaskData, setFormattedTaskData] = useState<Task[] | null>([
    {
      key: 3,
      projectName: "Project 1",
      taskName: "Task 3",
      childTasks: testChildTaskIds.map((childId, index) => (
        <React.Fragment key={childId}>
          <Link to={`/task/${childId}`} key={childId} style={{}}>
            Task {childId}
          </Link>
          {index < testChildTaskIds.length - 1 && " | "}
        </React.Fragment>
      )),
      priority: "Low",
      duration: 5,
      startdate: "1/3/12",
      starttime: "09:00",
      duedate: "2/2/22",
      duetime: "09:00",
      recurring: "no",
      is_complete: 0,
      delete: <Button>Delete</Button>,
    },
  ]);

  const [form] = Form.useForm();

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

  //need to reset dependenciesLoaded to false when tasks are reloaded
  useEffect(() => {
    if (!dependenciesLoaded) {
      const loadDependencies = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setDependenciesLoaded(true);
        } catch (error) {
          console.error("Error loading dependencies: ", error);
        }
      };

      loadDependencies();

      fetchDependenciesData()
        .then((dependenciesData: Dependency[]) => {
          console.log("success");

          setDependenciesData(dependenciesData);
          setDependenciesLoaded(true);
        })
        .catch((error: any) => {
          console.error("Error fetching dependencies data:", error);
        });
    }
  }, [dependenciesLoaded]);

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

            //get the childIds of taskDependencies with parentId
            const taskDependencies = (dependenciesData || [])
              .filter((dependency) => dependency.parent_id === taskData[i].id)
              .map((dependency) => dependency.child_id);

            const singleTask: Task = {
              key: taskData[i].id,
              projectName: projectIdToNameMap.get(taskData[i].project_id),
              taskName: taskData[i].name,
              //filter below gets the name of the child task with given id from taskData
              childTasks: taskDependencies.map((childId, index) => (
                <React.Fragment key={childId}>
                  <Link to={`/EditTask/${childId}`} key={childId} style={{}}>
                    {taskData
                      .filter((task: any) => task.id === childId)
                      .map((task: any) => task.name)}
                  </Link>
                  {index < taskDependencies.length - 1 && " | "}
                </React.Fragment>
              )),
              priority: taskData[i].priority,
              duration: taskData[i].duration,
              startdate: formattedStartDate,
              starttime: startFormattedTime,
              duedate: formattedDueDate,
              duetime: dueFormattedTime,
              recurring: isRecurring,
              is_complete: taskData[i].is_complete,
              delete: (
                <Button onClick={(e) => deleteTask(taskData[i].id)}>
                  Delete
                </Button>
              ),
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
  }, [tasksLoaded, dependenciesLoaded]);

  const deleteTask = async (taskId: number) => {
    console.log("delete button clicked", taskId);
    let notesDeleted: boolean = false;

    try {
      await deleteNotesByTaskId(taskId);
      notesDeleted = true;
    } catch (error) {
      console.error("error calling API : ", error);
    }

    if (notesDeleted) {
      try {
        await deleteTaskByTaskId(taskId);

        setTasksPageLoaded(false);
        setProjectsLoaded(false);
        setTasksLoaded(false);
        setDependenciesLoaded(false);
      } catch (error) {
        console.error("error calling API : ", error);
      }
    }
  };

  //API call to load the task_dependencies table

  //Merge the task_dependencies table into the

  const priorityMap = new Map<string, number>([
    ["Low", 0],
    ["Medium", 1],
    ["High", 2],
  ]);

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
      title: "Child Tasks",
      dataIndex: "childTasks",
      key: "childTasks",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      sorter: (a: { priority: string }, b: { priority: string }) =>
        (priorityMap.get(a.priority) || 0) - (priorityMap.get(b.priority) || 0),
    },
    {
      title: "Duration (hours)",
      dataIndex: "duration",
      key: "duration",
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
      sorter: (a: { duedate: string }, b: { duedate: string }) =>
        a.duedate > b.duedate,
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
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
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
      <div style={{ margin: "0px 0px 10px 0px" }}>
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
        >
          <Form.Item name="tagFilterSelect" label="Filter by Tag">
            <Select defaultValue="No filter">
              <Select.Option key={1}>No filter</Select.Option>
              <Select.Option key={2}>Tag A</Select.Option>
              <Select.Option key={3}>Tag B</Select.Option>
              <Select.Option key={4}>Tag C</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};
export default Tasks;
