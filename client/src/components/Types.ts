export interface TasksProps {
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

export type Task = {
  key: number;
  projectName: string | undefined;
  taskName: string;
  priority: string;
  date: string;
  time: string;
  recurring: string;
};
