import React, { useState, useEffect } from "react";
import { Button, Form, Select, Table } from "antd";
import { TasksProps } from "../Types";
import { fetchProjectData } from "../APIFunc";

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
  const handleSubmit = () => {};

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
  const [projectSelected, setProjectSelected] = useState<boolean>(false);
  const [parentTaskSelected, setParentTaskSelected] = useState<boolean>(false);
  const [childTaskSelected, setChildTaskSelected] = useState<boolean>(false);

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

  const [formData, setFormData] = useState<{
    projectName?: string;
    parentTaskName?: string;
    childTaskName?: string;
  }>({});

  const handleSelectChange = (value: any, field: string) => {
    setFormData({ ...formData, [field]: value });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

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
        >
          <Form.Item name="projectName" label="Project">
            <Select onChange={(evt) => handleSelectChange(evt, "projectName")}>
              <Select.Option value="Project A">Project A</Select.Option>
              <Select.Option value="Project B">Project B</Select.Option>
              <Select.Option value="Project C">Project C</Select.Option>
            </Select>
          </Form.Item>
          {formData.projectName && (
            <Form.Item name="parentTaskName" label="Parent Task">
              <Select
                onChange={(evt) => handleSelectChange(evt, "parentTaskName")}
              >
                <Select.Option value="Task A">Task A</Select.Option>
                <Select.Option value="Task B">Task B</Select.Option>
                <Select.Option value="Task C">Task C</Select.Option>
              </Select>
            </Form.Item>
          )}
          {formData.parentTaskName && (
            <Form.Item name="childTaskName" label="Child Task">
              <Select
                onChange={(evt) => handleSelectChange(evt, "childTaskName")}
              >
                <Select.Option value="Task D">Task D</Select.Option>
                <Select.Option value="Task E">Task E</Select.Option>
                <Select.Option value="Task F">Task F</Select.Option>
              </Select>
            </Form.Item>
          )}
          {formData.childTaskName && (
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          )}
        </Form>

        {formData.childTaskName && (
          <div style={{ padding: "20px 0 20px 0px" }}>
            <Table
              dataSource={tableData}
              columns={columns}
              pagination={{ pageSize: 15 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dependencies;
