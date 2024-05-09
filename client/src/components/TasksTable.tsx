import React from "react";
import { TasksTableProps } from "../Types";
import { Table, Button } from "antd";
import { Link } from "react-router-dom";

const TasksTable: React.FC<TasksTableProps> = ({
  dataSource,
  columns,
  pageSize,
}) => {
  return (
    <div>
      <div style={{ margin: "0px 0px 10px 0px" }}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: pageSize }}
        />
        <Link to="../AddTask">
          <Button>Add task</Button>
        </Link>
        <p>
          To view a task's notes, or to edit a task, simply click on the task
          name.
        </p>
      </div>
    </div>
  );
};

export default TasksTable;
