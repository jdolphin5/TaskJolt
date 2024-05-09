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
import AddProjectModal from "./AddProjectModal";
import { TasksProps } from "../Types";
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
    if (!value) return;

    const { date, time } = value;

    let updatedFormData = { ...formData };

    if (field === "startdate") {
      updatedFormData = { ...updatedFormData, [field]: date };
    } else if (field === "starttime") {
      updatedFormData = { ...updatedFormData, [field]: time };
    } else if (field === "duedate") {
      updatedFormData = { ...updatedFormData, [field]: date };
    } else if (field === "duetime") {
      updatedFormData = { ...updatedFormData, [field]: time };
    }

    setFormData(updatedFormData);
  };

  const handleRadioChange = (e: RadioChangeEvent) => {
    setFormData({ ...formData, recurring_string: e.target.value });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    if (isFormDataFormatted) {
      var ready: boolean = true;

      if (formData.project === null) {
        console.log("project not entered");
        ready = false;
      }
      if (formData.name === null) {
        console.log("task not entered");
        ready = false;
      }
      if (formData.priority === null) {
        console.log("priority not entered");
        ready = false;
      }
      if (formData.startdate === null) {
        console.log("start date not entered");
        ready = false;
      }
      if (formData.starttime === null) {
        console.log("start time not entered");
        ready = false;
      }
      if (formData.duedate === null) {
        console.log("due date not entered");
        ready = false;
      }
      if (formData.duetime === null) {
        console.log("due time not entered");
        ready = false;
      }
      if (formData.recurring_string === null) {
        console.log("recurring not selected");
        ready = false;
      }

      if (ready) {
        addTaskCallAPI();
      }

      setIsFormDataFormatted(false);
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
      console.error("Error combining date and time:", error);
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
      <Button.Group style={{ padding: "10px 0px 0px 0px" }}>
        <Button type="link" onClick={handleBackButtonClick}>
          &lt; Go back
        </Button>
      </Button.Group>
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
        <Form.Item
          name="formItemProjectName"
          label="Project"
          rules={[
            {
              required: true,
              message: "Please select a project",
            },
          ]}
          style={{ marginBottom: 0 }} // Adjusted style
        >
          <Select
            onChange={(evt) => handleSelectChange(evt, "project")}
            style={{ width: "100%" }}
          >
            {projectData ? (
              projectData.map(({ id, name }: { id: number; name: string }) => (
                <Select.Option key={id} value={id}>
                  {name}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled value={null}>
                No projects available
              </Select.Option>
            )}
          </Select>
        </Form.Item>
        <div>
          <Button type="link" onClick={handleAddProjectModal}>
            + Add Project
          </Button>
        </div>

        <Form.Item
          name="formItemTaskName"
          label="Task Name"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Please input a task name",
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
        <Form.Item
          name="formItemPriority"
          label="Priority"
          rules={[
            {
              required: true,
              message: "Please input a priority level",
            },
          ]}
        >
          <Select onChange={(evt) => handleSelectChange(evt, "priority")}>
            <Select.Option value="Low">Low</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="High">High</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Start Date"
          name="formItemStartDate"
          rules={[{ required: true, message: "Please enter a start date" }]}
        >
          <DatePicker
            style={{ marginRight: "8px" }}
            onChange={(date) => handleDateTimeChange({ date }, "startdate")}
            value={formData.startdate}
          />
        </Form.Item>
        <Form.Item
          label="Start Time"
          name="formItemStartTime"
          rules={[{ required: true, message: "Please enter a start time" }]}
        >
          <TimePicker
            use12Hours
            format="h:mm a"
            onChange={(time) => handleDateTimeChange({ time }, "starttime")}
            value={formData.starttime}
          />
        </Form.Item>
        <Form.Item
          label="Due Date"
          name="formItemDueDate"
          rules={[{ required: true, message: "Please enter a due date" }]}
        >
          <DatePicker
            style={{ marginRight: "8px" }}
            onChange={(date) => handleDateTimeChange({ date }, "duedate")}
            value={formData.duedate}
          />
        </Form.Item>
        <Form.Item
          label="Due Time"
          name="formItemDueTime"
          rules={[{ required: true, message: "Please enter a due time" }]}
        >
          <TimePicker
            use12Hours
            format="h:mm a"
            onChange={(time) => handleDateTimeChange({ time }, "duetime")}
            value={formData.duetime}
          />
        </Form.Item>
        <Form.Item
          name="FormItemRecurring"
          label="Recurring"
          rules={[
            {
              required: true,
              message: "Please select if the task is recurring",
            },
          ]}
        >
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
    </div>
  );
};
export default AddTask;
