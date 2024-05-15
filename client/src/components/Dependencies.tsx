import React, { useState, useEffect } from "react";
import { Button, Form, Select, Table } from "antd";
import { TasksProps } from "../Types";
import { fetchProjectData, fetchTaskDataWithProjectData } from "../APIFunc";

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
    project?: number;
    parentTask?: number;
    childTask?: number;
  }>({});

  const [filteredTaskData, setFilteredTaskData] = useState<any>();

  const handleSelectChange = (value: any, field: string) => {
    setFormData({ ...formData, [field]: value });
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
    fetchTaskDataWithProjectData(projectData).then((taskData: any) => {
      console.log("success tasks loaded");
      setTaskData(taskData);
    });
  }, [projectData]);

  useEffect(() => {
    if (formData.parentTask) {
      setFilteredTaskData(
        taskData.filter((task: any) => task.id !== formData.parentTask)
      );
    }
  }, [formData.parentTask]);

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
                {taskData ? (
                  taskData.map(({ id, name }: { id: number; name: string }) => (
                    <Select.Option key={id} value={id}>
                      {name}
                    </Select.Option>
                  ))
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
