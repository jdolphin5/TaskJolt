import React, { useState, useEffect } from "react";
import { Button, Input, Form } from "antd";

const Login: React.FC = () => {
  const [form] = Form.useForm();

  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: "",
  });

  type LoginForm = {
    username: string;
    password: string;
  };

  const handleSubmit = () => {
    console.log("submit button clicked", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={{ padding: "0px 15px 0px 15px" }}>
      <h1 style={{ textAlign: "center" }}>Login</h1>
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
          name="username"
          label="Username"
          rules={[
            {
              required: true,
              message: "Please type your username",
            },
          ]}
        >
          <Input name="username" onChange={handleInputChange} />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please type your password",
            },
          ]}
        >
          <Input.Password name="password" onChange={handleInputChange} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
        <div>
          <Button type="primary">Sign Up</Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
