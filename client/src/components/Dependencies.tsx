import React, { useState, useEffect } from "react";
import { Button, Form, Select, Table } from "antd";
import { TasksProps } from "../Types";
import {
  fetchProjectData,
  fetchTaskDataWithProjectId,
  addTaskDependency,
  deleteTaskDependencyByParentChild,
  fetchTaskDependenciesWithParentIdCallAPI,
} from "../APIFunc";

const Dependencies: React.FC<TasksProps> = ({
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

  const [tableData, setTableData] = useState<any>([
    {
      key: 1,
      childTask: "Test task 1",
      delete: <Button>Delete</Button>,
    },
    {
      key: 2,
      childTask: "Test task 2",
      delete: <Button>Delete</Button>,
    },
    {
      key: 3,
      childTask: "Test task 3",
      delete: <Button>Delete</Button>,
    },
    {
      key: 4,
      childTask: "Test task 4",
      delete: <Button>Delete</Button>,
    },
  ]);

  const columns = [
    {
      title: "Child Task",
      dataIndex: "childTask",
      key: "childTask",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
    },
  ];

  interface formInterface {
    project?: number;
    parentTask?: number;
    childTask?: number;
  }

  const [formData, setFormData] = useState<formInterface>({});
  const [filteredTaskData, setFilteredTaskData] = useState<any>([]);
  const [taskDependenciesLoaded, setTaskDependenciesLoaded] =
    useState<boolean>(false);
  const [taskDependencyData, setTaskDependencyData] = useState<any>([]);
  const [defaultValues, setDefaultValues] = useState<formInterface>({});
  const [taskDataMap, setTaskDataMap] = useState<Map<number, string>>();
  const [singleTaskData, setSingleTaskData] = useState<any>();
  const [filteredTaskDataLoaded, setFilteredTaskDataLoaded] =
    useState<boolean>(false);

  const handleSelectChange = (value: any, field: string) => {
    setFormData({ ...formData, [field]: value });

    if (field === "parentTask") {
      setTaskDependenciesLoaded(false);
    }
  };

  useEffect(() => {
    console.log("formData :", formData);
  }, [formData]);

  useEffect(() => {
    console.log("projectData:", projectData);
  }, [projectData]);

  useEffect(() => {
    fetchProjectData()
      .then((projectData) => {
        console.log("success");

        setProjectData(projectData);
      })
      .catch((error) => {
        console.error("Error fetching project data:", error);
      });
  }, []);

  useEffect(() => {
    if (formData.project) {
      fetchTaskDataWithProjectId(formData.project).then((taskData: any) => {
        console.log("success tasks loaded");
        setSingleTaskData(taskData);
      });
    }
  }, [formData.project]);

  useEffect(() => {
    if (formData.parentTask) {
      // Filters the parent task out of the child task select drop down

      setFilteredTaskData(
        singleTaskData.filter((task: any) => task.id !== formData.parentTask)
      );
      setFilteredTaskDataLoaded(true);
    }
  }, [formData.parentTask]);

  useEffect(() => {
    const fetchDependenciesAndUpdateState = async () => {
      if (filteredTaskDataLoaded && formData.parentTask) {
        // Get the child tasks of the parent task from the DB
        await getTaskDependencies(formData.parentTask);
        setTaskDependenciesLoaded(true);
        setFilteredTaskDataLoaded(false);
      }
    };
    fetchDependenciesAndUpdateState()
      .then(() => {
        console.log("Dependency data fetched and state updated.");
      })
      .catch((error) => {
        console.error("Error fetching dependencies:", error);
      });
  }, [filteredTaskDataLoaded]);

  useEffect(() => {
    console.log("filtered Task Data:", filteredTaskData);
    // Set the table data appropriately
    let newTableData: any = [];
    if (taskDataMap) {
      console.log("Task Data HashMap loaded");

      // Format the dependency data to fit the antd table data object
      taskDependencyData.forEach((element: any) => {
        const row = {
          key: element.child_id,
          childTask: taskDataMap.get(element.child_id),
          delete: (
            <Button
              onClick={() =>
                deleteTaskDependency(element.parent_id, element.child_id)
              }
            >
              Delete
            </Button>
          ),
        };
        newTableData.push(row);
      });
    }

    console.log(newTableData);
    setTableData(newTableData);

    // Filter to remove child tasks that are already children of the parent
    const idsToExclude = taskDependencyData.map((task: any) => task.child_id);

    setFilteredTaskData(
      filteredTaskData.filter((task: any) => !idsToExclude.includes(task.id))
    );
  }, [taskDependencyData]);

  const getTaskDependencies = async (parentId: number) => {
    fetchTaskDependenciesWithParentIdCallAPI(parentId).then(
      (dependencyData: any) => {
        console.log(
          "success parent-child dependencies loaded for parentTask:",
          parentId
        );
        setTaskDependencyData(dependencyData);
      }
    );

    let myMap = new Map<number, string>();

    for (let i = 0; i < singleTaskData.length; i++) {
      myMap.set(singleTaskData[i].id, singleTaskData[i].name);
    }

    setTaskDataMap(myMap);
  };

  const handleSubmit = async () => {
    try {
      await addTaskDependencyCallAPI();

      //set child task select dropdown to null value
      form.setFieldsValue({ childTask: null });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const addTaskDependencyCallAPI = async () => {
    try {
      console.log("handleSubmit - ", formData);

      await addTaskDependency(formData);

      setTaskDependenciesLoaded(false);
      setDefaultValues({
        project: formData.project,
        parentTask: formData.parentTask,
      });
    } catch (error) {
      console.error("error calling API : ", error);
    }
  };

  const deleteTaskDependency = async (parentId: number, childId: number) => {
    console.log("delete button clicked", parentId, childId);

    try {
      await deleteTaskDependencyByParentChild(parentId, childId);

      fetchTaskDependenciesWithParentIdCallAPI(parentId)
        .then((dependencyData) => {
          console.log("success");

          setTaskDependencyData(dependencyData);
          setTaskDependenciesLoaded(false);
        })
        .catch((error) => {
          console.error("Error fetching task dependency data:", error);
        });
    } catch (error) {
      console.error("error calling API : ", error);
    }
  };

  return (
    <div style={{ padding: "0px 15px 0px 15px" }}>
      <h1 style={{ textAlign: "center" }}>Dependencies</h1>
      <div style={{ padding: "0px 0px 5px 0px" }}>
        <p>Select a project to add a parent-child task dependency</p>

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
          onFinish={handleSubmit}
          form={form}
          initialValues={defaultValues}
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
            <Form.Item name="parentTask" label="Parent Task">
              <Select onChange={(evt) => handleSelectChange(evt, "parentTask")}>
                {singleTaskData ? (
                  singleTaskData.map(
                    ({ id, name }: { id: number; name: string }) => (
                      <Select.Option key={id} value={id}>
                        {name}
                      </Select.Option>
                    )
                  )
                ) : (
                  <Select.Option disabled value={null}>
                    No tasks available
                  </Select.Option>
                )}
              </Select>
            </Form.Item>
          )}
          {formData.parentTask && (
            <div style={{ padding: "20px 0 20px 0px" }}>
              <Table
                dataSource={tableData}
                columns={columns}
                pagination={{ pageSize: 15 }}
              />

              <Form.Item name="childTask" label="Child Task">
                <Select
                  onChange={(evt) => handleSelectChange(evt, "childTask")}
                >
                  {filteredTaskData ? (
                    filteredTaskData.map(
                      ({ id, name }: { id: number; name: string }) => (
                        <Select.Option key={id} value={id}>
                          {name}
                        </Select.Option>
                      )
                    )
                  ) : (
                    <Select.Option disabled value={null}>
                      No tasks available
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Dependencies;
