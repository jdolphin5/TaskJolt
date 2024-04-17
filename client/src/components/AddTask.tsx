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
  const [form] = Form.useForm();
  const [isFormDataFormatted, setIsFormDataFormatted] = useState(false);

  const handleAddProjectModal = () => {
    setShowHideAddProjectModal(true);
  };

  const [formData, setFormData] = useState<{
    name?: string;
    project?: number;
    priority?: string;
    startdate?: any;
    starttime?: any;
    start_date_time?: string;
    duedate?: any;
    duetime?: any;
    due_date_time?: string;
    recurring_string?: string;
    recurring?: number;
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
    setFormData({ ...formData, recurring_string: e.target.value });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    if (isFormDataFormatted) {
      addTaskCallAPI();
    }
  }, [isFormDataFormatted]);

  const handleSubmit = async () => {
    try {
      await formatFormData(); // Wait for formatFormData() to resolve
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleReset = () => {
    console.log("reset");
    setFormData({});
    form.resetFields();
  };

  const addTaskCallAPI = async () => {
    try {
      console.log("handleSubmit - ", formData);

      const response = await axios.post(
        "http://localhost:3000/api/addtask",
        formData
      );
      console.log("API Response:", response.data);

      setFormData({});
      setIsFormDataFormatted(false);
      form.resetFields();
      setTasksPageLoaded(false);
      setProjectsLoaded(false);
      setTasksLoaded(false);
    } catch (error) {
      console.error("error calling API : ", error);
    }
  };

  const formatFormData = async () => {
    try {
      const dateTimeStartString: string = await combineDateTime(
        formData.startdate,
        formData.starttime
      );
      const dateTimeDueString: string = await combineDateTime(
        formData.duedate,
        formData.duetime
      );

      console.log(dateTimeStartString);
      console.log(dateTimeDueString);

      const recurringBool: number = formData.recurring_string === "yes" ? 1 : 0;

      setFormData({
        ...formData,
        start_date_time: dateTimeStartString,
        due_date_time: dateTimeDueString,
        recurring: recurringBool,
      });

      setIsFormDataFormatted(true);
    } catch (error) {
      console.error("Error combining start date and time:", error);
    }
  };

  const combineDateTime: (date: any, time: any) => Promise<string> = (
    date,
    time
  ) => {
    return new Promise((resolve, reject) => {
      // Extract date components
      const year = date.$y;
      const month = date.$M + 1; // Months are zero-based, so add 1
      const day = date.$D;

      // Extract time components
      const hours = time.$H;
      const minutes = time.$m;
      const seconds = time.$s;

      const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      const dateTimeString: string = `${formattedDate} ${formattedTime}`;

      resolve(dateTimeString);
    });
  };

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
        onFinish={handleSubmit}
        form={form}
      >
        <Form.Item name="projectname" label="Project Name">
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
        <Form.Item name="priority" label="Priority">
          <Select onChange={(evt) => handleSelectChange(evt, "priority")}>
            <Select.Option value="Low">Low</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="High">High</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="startdate" label="Start Date">
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
        <Form.Item name="duedate" label="Due Date">
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
        <Form.Item name="recurring" label="Recurring">
          <Radio.Group onChange={handleRadioChange}>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Radio.Group>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button type="primary" onClick={handleReset} style={{ marginLeft: 8 }}>
          Reset
        </Button>
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
