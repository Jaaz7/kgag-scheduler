import { SaveButton, useForm } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Form, Input, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";

import { getNameInitials } from "@lib/date/get-name-initials";
import { CustomAvatar } from "@components/common/CustomAvatar";
import { Text } from "@components/common/Text";

interface UserData {
  avatarUrl: string;
  name: string;
  email: string;
  jobTitle: string;
  phone: string;
}

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  userId: string;
};

export const AccountSettings = ({ opened, setOpened, userId }: Props) => {
  // Explicitly initialize the form instance
  const [form] = Form.useForm();

  const { saveButtonProps, formProps } = useForm<UserData, HttpError>({
    mutationMode: "optimistic",
    resource: "users",
    action: "edit",
    id: userId,
  });

  const { data, isLoading } = useQuery<UserData, HttpError>(
    ["user", userId],
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }
  );

  const { avatarUrl, name } = data || {};

  const closeModal = () => {
    setOpened(false);
  };

  if (isLoading) {
    return (
      <Drawer
        open={opened}
        width={756}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin />
      </Drawer>
    );
  }

  return (
    <Drawer
      onClose={closeModal}
      open={opened}
      width={756}
      styles={{
        body: {
          background: "#f5f5f5",
          padding: 0,
        },
        header: {
          display: "none",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          backgroundColor: "#fff",
        }}
      >
        <Text strong>Account Settings</Text>
        <Button type="text" icon={<CloseOutlined />} onClick={closeModal} />
      </div>
      <div style={{ padding: "16px" }}>
        <Card>
          <Form form={form} layout="vertical">
            <CustomAvatar
              shape="square"
              src={avatarUrl}
              name={getNameInitials(name || "")}
              style={{
                width: 96,
                height: 96,
                marginBottom: "24px",
              }}
            />
            <Form.Item label="Name" name="name">
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item label="Job Title" name="jobTitle">
              <Input placeholder="Job Title" />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input placeholder="Phone" />
            </Form.Item>
          </Form>
          <SaveButton
            {...saveButtonProps}
            style={{
              display: "block",
              marginLeft: "auto",
            }}
          />
        </Card>
      </div>
    </Drawer>
  );
};
