import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  Input,
  DatePicker,
  Table,
  TimePicker,
  Radio,
  Button,
  Checkbox,
} from "antd";
import AddProjectModal from "./AddProjectModal";
import { Note, Task, FormattedTask, TasksProps } from "../Types";
import { useNavigate, useLocation } from "react-router-dom";
import { RadioChangeEvent } from "antd/lib/radio";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  addNote,
  editTaskByTaskId,
  deleteNoteByNoteId,
  fetchNotesData,
} from "../APIFunc";

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
  interface FormattedMessageFormData {
    task_id?: number;
    message?: string;
  }

  const history = useNavigate();
  const location = useLocation();

  dayjs.extend(utc);
  dayjs.extend(timezone);

  const handleBackButtonClick = () => {
    history(-1);
  };

  const [showHideAddProjectModal, setShowHideAddProjectModal] = useState(false);
  const [form] = Form.useForm();
  const [messageForm] = Form.useForm();
  const [isFormDataFormatted, setIsFormDataFormatted] = useState(false);
  const [defaultValues, setDefaultValues] = useState<any>(null);
  const [taskId, setTaskId] = useState<number>(-1);
  const [messageFormData, setMessageFormData] = useState<string>("");
  const [formattedMessageFormData, setFormattedMessageFormData] =
    useState<FormattedMessageFormData>({});
  const [isMessageFormDataFormatted, setIsMessageFormDataFormatted] =
    useState<boolean>(false);
  const [notesLoaded, setNotesLoaded] = useState<boolean>(false);
  const [notesData, setNotesData] = useState<Note[] | null>(null);
  const [formattedNotesData, setFormattedNotesData] = useState<Note[]>([]);

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
    is_complete?: number;
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

  const handleCheckboxChange = (value: any) => {
    setFormData({ ...formData, is_complete: value.target.checked ? 1 : 0 });
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
        saveEditTaskCallAPI();
      }

      setIsFormDataFormatted(false);
    }
  }, [isFormDataFormatted]);

  const handleSubmit = async () => {
    try {
      await formatFormData();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleReset = () => {
    console.log("reset");
    setFormData({ ...defaultValues });
    form.resetFields();
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

  const loadTask = (taskId: number) => {
    console.log("taskId:", taskId);

    const myTask = taskData.filter(
      (task: FormattedTask) => task.id === taskId
    )[0];

    console.log(myTask);

    const isoStringStartDate: string = myTask.start_date_time;
    const dateObjectStartDate =
      dayjs(isoStringStartDate).tz("Australia/Sydney");
    const isoStringDueDate: string = myTask.due_date_time;
    const dateObjectDueDate = dayjs(isoStringDueDate).tz("Australia/Sydney");

    setDefaultValues({
      name: myTask.name,
      project: myTask.project.id,
      priority: myTask.priority,
      startdate: dateObjectStartDate,
      starttime: dateObjectStartDate,
      start_date_time: myTask.start_date_time,
      duedate: dateObjectDueDate,
      duetime: dateObjectDueDate,
      due_date_time: myTask.due_date_time,
      recurring_string: myTask.recurring == 0 ? "no" : "yes",
      is_complete: myTask.is_complete,
    });
  };

  useEffect(() => {
    if (taskData) {
      console.log("task data found");

      const currentURL = location.pathname;
      let matches = currentURL.match(/\d+/g);

      let numArr: number[] = [];

      if (matches) {
        console.log("number matched");
        for (let i = 0; i < matches.length; i++) {
          let cur: string = matches[i];
          cur = cur.trim();
          numArr.push(+cur);
        }

        console.log(numArr);

        setTaskId(numArr[0]);
        loadTask(numArr[0]);
      }
    }
  }, [location, taskData]);

  useEffect(() => {
    setFormData({
      ...defaultValues,
    });

    form.resetFields();
  }, [defaultValues]);

  const saveEditTaskCallAPI = async () => {
    try {
      console.log("handleSubmit - ", formData);

      await editTaskByTaskId(taskId, formData);

      setIsFormDataFormatted(false);
      setTasksPageLoaded(false);
      setProjectsLoaded(false);
      setTasksLoaded(false);
      setDefaultValues({
        name: formData.name,
        project: formData.project,
        priority: formData.priority,
        startdate: formData.startdate,
        starttime: formData.starttime,
        start_date_time: formData.start_date_time,
        duedate: formData.duedate,
        duetime: formData.duetime,
        due_date_time: formData.due_date_time,
        recurring_string: formData.recurring == 0 ? "no" : "yes",
        is_complete: formData.is_complete,
      });
    } catch (error) {
      console.error("error calling API : ", error);
    }
  };

  const handleSubmitMessage = async () => {
    try {
      await formatMessageFormData();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const onChangeMessage = (e: any) => {
    setMessageFormData(e.target.value);
  };

  const formatMessageFormData = async () => {
    try {
      setFormattedMessageFormData({
        ...formattedMessageFormData,
        task_id: taskId,
        message: messageFormData,
      });

      setIsMessageFormDataFormatted(true);
    } catch (error) {
      console.error("Error combining date and time:", error);
    }
  };

  useEffect(() => {
    if (isMessageFormDataFormatted) {
      addNoteCallAPI();
    }

    setIsMessageFormDataFormatted(false);
  }, [isMessageFormDataFormatted]);

  const addNoteCallAPI = async () => {
    try {
      console.log("handleMessageSubmit - messageFormData -", messageFormData);
      console.log(
        "handleMessageSubmit - formattedMessageFormData -",
        formattedMessageFormData
      );

      await addNote(formattedMessageFormData);

      setIsMessageFormDataFormatted(false);
      setNotesLoaded(false);
    } catch (error) {
      console.error("error calling API : ", error);
    }
  };

  useEffect(() => {
    console.log("messageFormData:", messageFormData);
  }, [messageFormData]);

  useEffect(() => {
    if (!notesLoaded) {
      const loadNotes = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setNotesLoaded(true);
        } catch (error) {
          console.error("Error loading notes: ", error);
        }
      };

      loadNotes();
    }

    if (!notesLoaded && taskId !== -1) {
      fetchNotesData(taskId)
        .then((notesData) => {
          console.log("success");

          setNotesData(notesData);
          setNotesLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching notes data:", error);
        });
    }
  }, [notesLoaded, taskId]);

  const formatNotesData = (notesData: Note[]) => {
    let newNotesData = [];
    if (notesData !== null && notesData !== undefined) {
      for (let i = 0; i < notesData.length; i++) {
        const singleNote: Note = {
          id: notesData[i].id,
          //task_id: notesData[i].task_id,
          message: notesData[i].message,
          delete: (
            <Button onClick={(e) => deleteNote(notesData[i].id)}>Delete</Button>
          ),
        };

        newNotesData.push(singleNote);
      }

      setFormattedNotesData(newNotesData);
    }
  };

  useEffect(() => {
    if (notesData) {
      formatNotesData(notesData);
    }
    console.log("Updated notesData:", notesData);
  }, [notesData]);

  const columns = [
    {
      title: "Notes",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
    },
  ];

  const dataSource = formattedNotesData?.map((notes, index) => ({
    ...notes,
    key: index.toString(),
  }));

  const deleteNote = async (noteId: number) => {
    try {
      await deleteNoteByNoteId(noteId);

      //reload notes
      setNotesLoaded(false);
    } catch (error) {
      console.error("error calling API : ", error);
    }
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
        View/Edit Task
      </h1>
      {defaultValues ? (
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
          initialValues={defaultValues}
        >
          <Form.Item
            name="project"
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
          <div>
            <Button type="link" onClick={handleAddProjectModal}>
              + Add Project
            </Button>
          </div>

          <Form.Item
            name="name"
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
            <Input name="name" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item
            name="priority"
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
            name="startdate"
            rules={[{ required: true, message: "Please enter a start date" }]}
          >
            <DatePicker
              style={{ marginRight: "8px" }}
              onChange={(date) => handleDateTimeChange({ date }, "startdate")}
            />
          </Form.Item>
          <Form.Item
            label="Start Time"
            name="starttime"
            rules={[{ required: true, message: "Please enter a start time" }]}
          >
            <TimePicker
              use12Hours
              format="h:mm a"
              onChange={(time) => handleDateTimeChange({ time }, "starttime")}
            />
          </Form.Item>
          <Form.Item
            label="Due Date"
            name="duedate"
            rules={[{ required: true, message: "Please enter a due date" }]}
          >
            <DatePicker
              style={{ marginRight: "8px" }}
              onChange={(date) => handleDateTimeChange({ date }, "duedate")}
            />
          </Form.Item>
          <Form.Item
            label="Due Time"
            name="duetime"
            rules={[{ required: true, message: "Please enter a due time" }]}
          >
            <TimePicker
              use12Hours
              format="h:mm a"
              onChange={(time) => handleDateTimeChange({ time }, "duetime")}
            />
          </Form.Item>
          <Form.Item
            name="recurring_string"
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
          <Form.Item name="is_complete_checkbox" label="Completed">
            <Checkbox
              checked={formData.is_complete === 1}
              onChange={handleCheckboxChange}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button
            type="primary"
            onClick={handleReset}
            style={{ marginLeft: 8 }}
          >
            Restore
          </Button>
        </Form>
      ) : (
        "Form data not loaded"
      )}
      <div style={{ padding: "15px 0px 15px 0px" }}>
        <div style={{ padding: "5px 0px 10px 0px" }}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{ pageSize: 8 }}
          />
        </div>

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
          onFinish={handleSubmitMessage}
          form={messageForm}
        >
          <Form.Item name="message">
            <Input
              showCount
              maxLength={300}
              onChange={onChangeMessage}
              placeholder="Enter a note about the task here"
              style={{ height: "80px" }}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add Note
          </Button>
        </Form>
      </div>
    </div>
  );
};
export default EditTask;
