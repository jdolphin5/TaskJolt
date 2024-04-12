import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Form, Input } from "antd";
import axios from "axios";
import { TasksProps } from "./Types";

interface AddProjectProps extends TasksProps {
  showHideAddProjectModal: boolean;
  setShowHideAddProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  projectsLoaded: boolean;
  setProjectsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  projectData: any;
  setProjectData: React.Dispatch<React.SetStateAction<any>>;
}

async function fetchProjectData() {
  try {
    const response = await axios.get("http://localhost:3000/api/projects");

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
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
    key: number;
    name: string;
  }

  const formatProjectData = (projectData: Project[]) => {
    let newProjectData = [];
    if (projectData !== null && projectData !== undefined) {
      for (let i = 0; i < projectData.length; i++) {
        const singleProject: Project = {
          key: projectData[i].key,
          name: projectData[i].name,
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
      key: 3,
      name: "No projects",
    },
  ]);

  useEffect(() => {
    if (projectsLoaded) {
      formatProjectData(projectData);
    }
    console.log("Updated projectData:", projectData);
  }, [, projectData]);

  const columns = [
    {
      title: "Current Projects List",
      dataIndex: "name",
      key: "name",
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

      const response = await axios.post(
        "http://localhost:3000/api/addproject",
        formData
      );
      console.log("API Response:", response.data);

      setFormData({ name: "" });

      fetchProjectData()
        .then((projectData) => {
          console.log("success");

          const filteredProjectIds = projectData?.filter(
            (project: { id: number }) => project.id !== 2
          );

          setProjectData(filteredProjectIds);
        })
        .catch((error) => {
          console.error("Error fetching project data:", error);
        });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <Modal
        title="Add Project"
        visible={showHideAddProjectModal}
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
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            layout="horizontal"
            style={{
              maxWidth: 400,
            }}
            onFinish={handleSubmit}
          >
            <Form.Item label="Project Name" rules={[{ required: true }]}>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default AddProjectModal;
