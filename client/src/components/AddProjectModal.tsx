import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Form, Input } from "antd";
import axios from "axios";

interface AddProjectProps {
  showHideAddProjectModal: boolean;
  setShowHideAddProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  projectsLoaded: boolean;
  setProjectsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  projectData: any;
  setProjectData: React.Dispatch<React.SetStateAction<any>>;
}

const AddProjectModal: React.FC<AddProjectProps> = ({
  showHideAddProjectModal,
  setShowHideAddProjectModal,
  projectsLoaded,
  setProjectsLoaded,
  projectData,
  setProjectData,
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
      console.log(projectData);
    }
  }, []);

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

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      console.log(formData);
      // Make API call using axios
      const response = await axios.post(
        "http://localhost:3000/api/addproject/",
        formData
      );
      console.log("API Response:", response.data);
      // Reset form after successful submission
      setFormData({});
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
