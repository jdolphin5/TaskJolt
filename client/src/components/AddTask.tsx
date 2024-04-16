import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  Input,
  DatePicker,
  TimePicker,
  Radio,
  Button,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import AddProjectModal from "./AddProjectModal";
import { TasksProps } from "./Types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RadioChangeEvent } from "antd/lib/radio";

//('Task 1', 'High', '2024-04-06 09:00:00', '2024-04-07 17:00:00', 0, 1),
const AddTask: React.FC<TasksProps> = ({
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
  const history = useNavigate();

  const handleBackButtonClick = () => {
    history(-1);
  };

  const [showHideAddProjectModal, setShowHideAddProjectModal] = useState(false);

  const handleAddProjectModal = () => {
    setShowHideAddProjectModal(true);
  };

  const [formData, setFormData] = useState<{
    name?: string;
    project?: string;
    priority?: string;
    startdate?: string;
    starttime?: string;
    duedate?: string;
    duetime?: string;
    recurring?: string;
  }>({});

  const handleSelectChange = (value: any, field: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateTimeChange = (value: any, field: string) => {
    if (field === "startdate") {
      setFormData({ ...formData, [field]: value });
    } else if (field === "starttime") {
      setFormData({ ...formData, [field]: value });
    }
    if (field === "duedate") {
      setFormData({ ...formData, [field]: value });
    } else if (field === "duetime") {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleRadioChange = (e: RadioChangeEvent) => {
    setFormData({ ...formData, recurring: e.target.value });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  /*const handleSubmit = async () => {
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
  */

  return (
    <div style={{ padding: "0px 15px 0px 15px" }}>
      {showHideAddProjectModal && (
        <AddProjectModal
          tasksPageLoaded={tasksPageLoaded}
          setTasksPageLoaded={setTasksPageLoaded}
          projectsLoaded={projectsLoaded}
          setProjectsLoaded={setProjectsLoaded}
          tasksLoaded={tasksLoaded}
          setTasksLoaded={setTasksLoaded}
          projectData={projectData}
          setProjectData={setProjectData}
          taskData={taskData}
          setTaskData={setTaskData}
          showHideAddProjectModal={showHideAddProjectModal}
          setShowHideAddProjectModal={setShowHideAddProjectModal}
        />
      )}
      <h1 style={{ margin: "0px 0px 10px 0px", textAlign: "center" }}>
        Add Task
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
            <Select
              onChange={(evt) => handleSelectChange(evt, "project")}
              style={{ marginRight: "5px" }}
            >
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
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label="Priority">
          <Select onChange={(evt) => handleSelectChange(evt, "priority")}>
            <Select.Option value="Low">Low</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="High">High</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Start Date">
          <div style={{ display: "flex", alignItems: "center" }}>
            <DatePicker
              onChange={(evt) => handleDateTimeChange(evt, "startdate")}
            />
            <TimePicker
              onChange={(evt) => handleDateTimeChange(evt, "starttime")}
              use12Hours
              format="h:mm a"
            />
          </div>
        </Form.Item>
        <Form.Item label="Due Date">
          <div style={{ display: "flex", alignItems: "center" }}>
            <DatePicker
              onChange={(evt) => handleDateTimeChange(evt, "duedate")}
            />
            <TimePicker
              onChange={(evt) => handleDateTimeChange(evt, "duetime")}
              use12Hours
              format="h:mm a"
            />
          </div>
        </Form.Item>
        <Form.Item label="Recurring">
          <Radio.Group onChange={handleRadioChange}>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Radio.Group>
        </Form.Item>
        <Button>Submit</Button>
      </Form>

      <Button.Group style={{ padding: "10px 0px 0px 0px" }}>
        <Button type="link" onClick={handleBackButtonClick}>
          &lt; Go back
        </Button>
      </Button.Group>
    </div>
  );
};
export default AddTask;
