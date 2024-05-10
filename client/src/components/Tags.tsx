import React, { useState, useEffect } from "react";
import { Button, Form, Input, Table } from "antd";
import { Tag } from "../Types";
import { ReactElement } from "react";
import { addTag, fetchTagData, deleteTagByTagId } from "../APIFunc";

const Tags: React.FC = () => {
  const [formData, setFormData] = useState<{ name?: string }>({});
  const [tagData, setTagData] = useState<any>();
  const [tagsPageLoaded, setTagsPageLoaded] = useState<boolean>(false);
  const [tagsLoaded, setTagsLoaded] = useState<boolean>(false);

  interface FormattedTag {
    key: number;
    name: string;
    delete?: ReactElement;
  }

  const [formattedTagData, setFormattedTagData] = useState<
    FormattedTag[] | null
  >([
    {
      key: 3,
      name: "No tags found",
    },
  ]);

  useEffect(() => {
    if (!tagsLoaded) {
      fetchTagData().then((tagsLoadedData) => {
        console.log("success tags loaded");
        const formattedTaskData = tagsLoadedData;
        setTagData(formattedTaskData);
        setTagsLoaded(true);
      });
    }
  }, [tagsLoaded]);

  useEffect(() => {
    if (!tagsPageLoaded) {
      const loadTags = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setTagsPageLoaded(true);
        } catch (error) {
          console.error("Error loading tags: ", error);
        }
      };

      console.log("initialising useEffect to load tags");

      loadTags();
    }
  }, [tagsPageLoaded, tagsLoaded]);

  useEffect(() => {
    const formatTagData = (tagData: Tag[]) => {
      let newTagData = [];
      if (tagData !== null && tagData !== undefined) {
        for (let i = 0; i < tagData.length; i++) {
          const singleTag: FormattedTag = {
            key: tagData[i].id,
            name: tagData[i].name,
            delete: (
              <Button onClick={(e) => deleteTag(tagData[i].id)}>Delete</Button>
            ),
          };

          newTagData.push(singleTag);
        }

        setFormattedTagData(newTagData);
      }
    };

    formatTagData(tagData);
  }, [tagsLoaded, tagData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      console.log(formData);

      if (Object.keys(formData).length !== 0) {
        await addTag(formData);

        setFormData({});

        fetchTagData()
          .then((tagData) => {
            console.log("success");

            setTagData(tagData);
          })
          .catch((error) => {
            console.error("Error fetching project data:", error);
          });

        setTagsPageLoaded(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const deleteTag = async (tagId: number) => {
    try {
      await deleteTagByTagId(tagId);

      //reload tags
      setTagsPageLoaded(false);
      setTagsLoaded(false);
    } catch (error) {
      console.error("error calling API : ", error);
    }
  };

  const columns = [
    {
      title: "Tags List",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
    },
  ];

  const dataSource = formattedTagData?.map((tag, index) => ({
    ...tag,
    key: index.toString(),
  }));

  return (
    <div style={{ padding: "0px 15px 0px 15px" }}>
      <h1 style={{ textAlign: "center" }}>Tags</h1>
      <div style={{ padding: "5px 0px 10px 0px" }}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      </div>

      <div style={{ padding: "0px 0 0px 0" }}>
        <Form
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          layout="horizontal"
          style={{
            maxWidth: 600,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="formItemTagName"
            label="Tag Name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please input a tag name",
              },
            ]}
            validateTrigger="onChange"
          >
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Tag
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Tags;
