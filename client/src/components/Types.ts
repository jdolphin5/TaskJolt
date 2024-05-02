import { ReactElement } from "react";

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

export interface TasksTableProps {
  dataSource: any;
  columns: any;
  pageSize: number;
}

export type Task = {
  key: number;
  projectName: string | undefined;
  taskName: string;
  priority: string;
  startdate: string;
  starttime: string;
  duedate: string;
  duetime: string;
  recurring: string;
  is_complete: number;
  delete: ReactElement;
};

export type FormattedTask = {
  id: number;
  name: string;
  priority: string;
  project: any;
  project_id: number;
  recurring: number;
  start_date_time: string;
  due_date_time: string;
};

export interface Note {
  id: number;
  task_id?: number;
  message?: string;
  delete?: ReactElement;
}
