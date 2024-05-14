import React, { useState, useEffect } from "react";
import { Button, Form, Select, Table } from "antd";

const Dependencies = () => {
  const handleSubmit = () => {};

  const [form] = Form.useForm();

  const [tableData, setTableData] = useState<any>([
    {
      key: 3,
      childTask: "Test task 1",
      delete: <Button>Delete</Button>,
    },
    {
      key: 4,
      childTask: "Test task 2",
      delete: <Button>Delete</Button>,
    },
    {
      key: 3,
      childTask: "Test task 3",
      delete: <Button>Delete</Button>,
    },
    {
      key: 3,
      childTask: "Test task 4",
      delete: <Button>Delete</Button>,
    },
  ]);

  const columns = [
    {
      title: "Child Task",
      dataIndex: "childTask",
      key: "childTask",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
    },
  ];
  return (
    <div style={{ padding: "0px 15px 0px 15px" }}>
      <h1 style={{ textAlign: "center" }}>Dependencies</h1>
      <div style={{ padding: "0px 0px 5px 0px" }}>
        <p>Select a project to add a parent-child task dependency</p>

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
          <Form.Item name="a" label="Project">
            <Select>
              <Select.Option>Project A</Select.Option>
              <Select.Option>Project B</Select.Option>
              <Select.Option>Project C</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="b" label="Parent Task">
            <Select>
              <Select.Option>Task A</Select.Option>
              <Select.Option>Task B</Select.Option>
              <Select.Option>Task C</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="c" label="Child Task">
            <Select>
              <Select.Option>Task D</Select.Option>
              <Select.Option>Task E</Select.Option>
              <Select.Option>Task F</Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form>

        <div style={{ padding: "20px 0 20px 0px" }}>
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={{ pageSize: 15 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dependencies;
