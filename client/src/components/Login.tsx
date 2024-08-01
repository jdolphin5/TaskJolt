import React, { useState, useEffect } from "react";
import { Button, Input, Form } from "antd";
import axios from "axios";

import googleButton from "../assets/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png";

const navigate = (url: string) => {
  window.location.href = url;
};

const auth = async () => {
  console.log("Google sign in button - clicked");
  try {
    navigate("http://localhost:3000/auth/google");
  } catch (error) {
    console.error("Error signing in with google", error);
  }
};

const Login: React.FC = () => {
  const [form] = Form.useForm();

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  type LoginForm = {
    email: string;
    password: string;
  };

  const handleSubmit = async () => {
    console.log("submit button clicked", formData);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/locallogin",
        {
          username: formData.email,
          password: formData.password,
          withCredentials: true,
        }
      );

      navigate(response.data);
    } catch (error) {
      console.error("Error signing in with local", error);
    }
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
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Please type your email",
            },
          ]}
        >
          <Input name="email" onChange={handleInputChange} />
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
      </Form>
      <div style={{ padding: "10px 0px 10px 0px" }}>
        <button type="button" onClick={() => auth()}>
          <img src={googleButton} alt="Google sign in button"></img>
        </button>
      </div>
    </div>
  );
};

export default Login;
