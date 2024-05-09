import axios from "axios";

export const editTaskByTaskId = async (taskId: number, formData: any) => {
  const response = await axios.put(
    `http://localhost:3000/api/edittask/${taskId}`,
    formData
  );
  console.log("API Response:", response.data);
};
