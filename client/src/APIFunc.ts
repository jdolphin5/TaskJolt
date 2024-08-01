import axios from "axios";

export async function checkAuth() {
  try {
    const response = await axios.get("http://localhost:3000/api/isauth");

    console.log(response);

    return response;
  } catch (error) {
    console.error("Error fetching auth data:", error);
  }
}

export async function fetchProjectData() {
  try {
    const response = await axios.get("http://localhost:3000/api/projects");

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function fetchTaskDataWithProjectData(projectData: any) {
  try {
    const formattedProjectIds = projectData.map((project: { id: number }) => [
      project.id,
    ]);

    if (Array.isArray(formattedProjectIds)) {
      const response = await axios.get(
        `http://localhost:3000/api/tasks?projectIds=${formattedProjectIds.join(
          ","
        )}`
      );

      console.log(response);

      return response.data;
    } else {
      console.log("projectIds is null");

      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function fetchTaskDataWithProjectId(projectId: number) {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/tasks?projectIds=${projectId}`
    );

    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

export async function fetchNotesData(taskId: number) {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/notes/${taskId}`
    );

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function fetchTagData() {
  try {
    const response = await axios.get("http://localhost:3000/api/tags");

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function fetchDependenciesData() {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/task_dependencies`
    );

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function fetchTaskDependenciesWithParentIdCallAPI(
  parentId: number
) {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/task_dependencies/${parentId}`
    );

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export const fetchTasksAndDependencies = async (projectId: number) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/tasksAndDependencies/${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const addProject = async (formData: any) => {
  const response = await axios.post(
    "http://localhost:3000/api/addproject",
    formData
  );
  console.log("API Response:", response.data);
};

export const deleteProjectByProjectId = async (projectId: number) => {
  const response = await axios.delete(
    `http://localhost:3000/api/deleteproject/${projectId}`
  );
  console.log("API Response:", response.data);
};

export const addNote = async (formData: any) => {
  const response = await axios.post(
    `http://localhost:3000/api/addnote`,
    formData
  );
  console.log("API Response:", response.data);
};

export const deleteNoteByNoteId = async (noteId: number) => {
  const response = await axios.delete(
    `http://localhost:3000/api/deletenote/${noteId}`
  );
  console.log("API Response:", response.data);
};

export const deleteNotesByTaskId = async (taskId: number) => {
  const response = await axios.delete(
    `http://localhost:3000/api/deletenotes/${taskId}`
  );
  console.log("API Response:", response.data);
};

export const addTask = async (formData: any) => {
  const response = await axios.post(
    "http://localhost:3000/api/addtask",
    formData
  );
  console.log("API Response:", response.data);
};

export const editTaskByTaskId = async (taskId: number, formData: any) => {
  const response = await axios.put(
    `http://localhost:3000/api/edittask/${taskId}`,
    formData
  );
  console.log("API Response:", response.data);
};

export const deleteTaskByTaskId = async (taskId: number) => {
  const response = await axios.delete(
    `http://localhost:3000/api/deletetask/${taskId}`
  );
  console.log("API Response:", response.data);
};

export const deleteTasksByProjectId = async (projectId: number) => {
  const response = await axios.delete(
    `http://localhost:3000/api/deletetasks/${projectId}`
  );
  console.log("API Response:", response.data);
};

export const addTag = async (formData: any) => {
  const response = await axios.post(
    "http://localhost:3000/api/addtag",
    formData
  );
  console.log("API Response:", response.data);
};

export const deleteTagByTagId = async (tagId: number) => {
  const response = await axios.delete(
    `http://localhost:3000/api/deletetag/${tagId}`
  );
  console.log("API Response:", response.data);
};

export const addTaskDependency = async (formData: any) => {
  const response = await axios.post(
    "http://localhost:3000/api/addtaskdependency",
    formData
  );
  console.log("API Response:", response.data);
};

export const deleteTaskDependencyByParentChild = async (
  parentId: number,
  childId: number
) => {
  const response = await axios.delete(
    `http://localhost:3000/api/deletetaskdependency/${parentId}/${childId}`
  );
  console.log("API Response:", response.data);
};
