import React, { useState, useEffect, ReactElement } from "react";
import { Modal, Table, Button, Form, Input } from "antd";
import { TasksProps } from "../Types";
import {
  addProject,
  fetchProjectData,
  deleteTasksByProjectId,
  deleteProjectByProjectId,
} from "../APIFunc";

interface AddProjectProps extends TasksProps {
  showHideAddProjectModal: boolean;
  setShowHideAddProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  projectsLoaded: boolean;
  setProjectsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  projectData: any;
  setProjectData: React.Dispatch<React.SetStateAction<any>>;
}

const AddProjectModal: React.FC<AddProjectProps> = ({
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
  showHideAddProjectModal,
  setShowHideAddProjectModal,
}) => {
  const handleOk = () => {
    setShowHideAddProjectModal(false);
  };

  const handleCancel = () => {
    setShowHideAddProjectModal(false);
  };

  interface Project {
    id: number;
    name: string;
    delete?: ReactElement;
  }

  const formatProjectData = (projectData: Project[]) => {
    let newProjectData = [];
    if (projectData !== null && projectData !== undefined) {
      for (let i = 0; i < projectData.length; i++) {
        const singleProject: Project = {
          id: projectData[i].id,
          name: projectData[i].name,
          delete: (
            <Button onClick={(e) => deleteProject(projectData[i].id)}>
              Delete
            </Button>
          ),
        };

        newProjectData.push(singleProject);
      }

      setFormattedProjectdata(newProjectData);
    }
  };

  const [formattedProjectData, setFormattedProjectdata] = useState<
    Project[] | null
  >([
    {
      id: 3,
      name: "No projects",
    },
  ]);

  useEffect(() => {
    if (projectData) {
      formatProjectData(projectData);
    }
    console.log("Updated projectData:", projectData);
  }, [projectData]);

  const columns = [
    {
      title: "Current Projects List",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
    },
  ];

  const dataSource = formattedProjectData?.map((project, index) => ({
    ...project,
    key: index.toString(),
  }));

  const [formData, setFormData] = useState<{ name?: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      console.log(formData);

      if (Object.keys(formData).length !== 0) {
        await addProject(formData);

        setFormData({});

        fetchProjectData()
          .then((projectData) => {
            console.log("success");

            setProjectData(projectData);
          })
          .catch((error) => {
            console.error("Error fetching project data:", error);
          });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const deleteProject = async (projectId: number) => {
    console.log("delete button clicked", projectId);

    let tasksDeleted: boolean = false;

    try {
      await deleteTasksByProjectId(projectId);

      tasksDeleted = true;
    } catch (error) {
      console.error("error calling API : ", error);
    }

    if (tasksDeleted) {
      try {
        await deleteProjectByProjectId(projectId);

        fetchProjectData()
          .then((projectData) => {
            console.log("success");

            setProjectData(projectData);
            setTasksPageLoaded(false);
            setProjectsLoaded(false);
            setTasksLoaded(false);
          })
          .catch((error) => {
            console.error("Error fetching project data:", error);
          });
      } catch (error) {
        console.error("error calling API : ", error);
      }
    }
  };

  return (
    <div>
      <Modal
        title="Add Project"
        open={showHideAddProjectModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ padding: "5px 0px 10px 0px" }}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{ pageSize: 5 }}
          />
        </div>
        <div style={{ padding: "10px 0 0px 0" }}>
          <Form
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            layout="horizontal"
            style={{
              maxWidth: 400,
            }}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="formItemProjectName"
              label="Project Name"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input a project name",
                },
              ]}
              validateTrigger="onChange"
            >
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Project
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default AddProjectModal;
