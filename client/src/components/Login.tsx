import React, { useState, useEffect } from "react";
import { Button, Input, Form } from "antd";
import axios from "axios";

/*import {
  hasGrantedAllScopesGoogle,
  GoogleOAuthProvider,
  GoogleLogin,
} from "@react-oauth/google";
*/

import googleButton from "../assets/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png";

const navigate = (url: string) => {
  window.location.href = url;
};

const auth = async () => {
  console.log("Google sign in button - clicked");
  try {
    navigate("http://localhost:3000/auth/google");
  } catch (error) {
    console.error("Error fetching auth data", error);
  }
};

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
      <div style={{ padding: "10px 0px 10px 0px" }}>
        <button type="button" onClick={() => auth()}>
          <img src={googleButton} alt="Google sign in button"></img>
        </button>
      </div>
    </div>
  );
};

export default Login;
