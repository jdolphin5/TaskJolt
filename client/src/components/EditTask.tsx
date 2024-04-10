import React, { useState, useEffect } from "react";
import { Form, Select, Input, DatePicker, Radio, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import AddProjectModal from "./AddProjectModal";

interface TasksProps {
  tasksPageLoaded: boolean;
  setTasksPageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  projectsLoaded: boolean;
  setProjectsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  tasksLoaded: boolean;
  setTasksLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  projectData: any;
  setProjectData: React.Dispatch<React.SetStateAction<any>>;
  taskData: any;
  setTaskData: React.Dispatch<React.SetStateAction<any>>;
}

//('Task 1', 'High', '2024-04-06 09:00:00', '2024-04-07 17:00:00', 0, 1),
const EditTask: React.FC<TasksProps> = ({
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
  const [showHideAddProjectModal, setShowHideAddProjectModal] = useState(false);

  const handleAddProjectModal = () => {
    setShowHideAddProjectModal(true);
  };

  return (
    <div style={{ padding: "0px 15px 0px 15px" }}>
      {showHideAddProjectModal && (
        <AddProjectModal
          showHideAddProjectModal={showHideAddProjectModal}
          setShowHideAddProjectModal={setShowHideAddProjectModal}
          projectsLoaded={projectsLoaded}
          setProjectsLoaded={setProjectsLoaded}
          projectData={projectData}
          setProjectData={setProjectData}
        />
      )}
      <h1 style={{ margin: "0px 0px 10px 0px", textAlign: "center" }}>
        Edit Task
      </h1>
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
      >
        <Form.Item label="Project Name">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Select style={{ marginRight: "5px" }}>
              {projectsLoaded ? (
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
            <PlusCircleOutlined
              style={{ cursor: "pointer" }}
              onClick={handleAddProjectModal}
            />
          </div>
        </Form.Item>
        <Form.Item label="Task Name">
          <Input />
        </Form.Item>
        <Form.Item label="Priority">
          <Select>
            <Select.Option value="Low">Low</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="High">High</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Start Date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Due Date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Is Recurring">
          <Radio.Group>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Radio.Group>
        </Form.Item>
        <Button>Submit</Button>
      </Form>

      <Button.Group style={{ padding: "10px 0px 0px 0px" }}>
        <Button type="primary">&lt; Go back</Button>
      </Button.Group>
    </div>
  );
};
export default EditTask;
