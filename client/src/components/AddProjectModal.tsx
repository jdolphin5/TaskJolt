import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Form, Input } from "antd";

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
          >
            <Form.Item label="Project Name">
              <Input />
            </Form.Item>
            <Button>Add</Button>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default AddProjectModal;
