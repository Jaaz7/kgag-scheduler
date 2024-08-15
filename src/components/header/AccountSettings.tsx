import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Spin,
  Upload,
  Select,
  Checkbox,
  message,
} from "antd";
import { CloseOutlined, UploadOutlined, SaveOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { supabaseBrowserClient } from "@lib/supabase/client";
import { CustomAvatar } from "@components/common/CustomAvatar";
import { Text } from "@components/common/Text";
import { getNameInitials } from "@lib/date/get-name-initials";
import { HttpError } from "@refinedev/core";

const { Option } = Select;

interface UserData {
  avatarUrl: string;
  name: string;
  email: string;
  user_type: string;
  shift_preference: string;
  day_preferences: string[];
}

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  userId: string;
};

export const AccountSettings = ({ opened, setOpened, userId }: Props) => {
  const [form] = Form.useForm();
  const [initials, setInitials] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [noPreference, setNoPreference] = useState(false);

  const { data, isLoading } = useQuery<UserData, HttpError>(
    ["user", userId],
    async () => {
      const { data, error } = await supabaseBrowserClient
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  );

  const fetchUserEmailAndProfile = async () => {
    try {
      const { data: authData, error: authError } =
        await supabaseBrowserClient.auth.getUser();
      if (authError) {
        throw new Error(authError.message);
      }
      const userEmail = authData.user?.email || "";

      const { data: userData, error: userError } = await supabaseBrowserClient
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (userError) {
        throw new Error(userError.message);
      }

      if (userData) {
        const userName = userData.name || "";
        const userType = userData.user_type || "";
        const shiftPreference = userData.shift_preference || "no_preference";
        const dayPreferences = userData.day_preferences.length
          ? userData.day_preferences
          : ["no_preference"];

        form.setFieldsValue({
          name: userName,
          email: userEmail,
          userType: userType,
          avatarUrl: userData.avatarUrl,
          shiftPreference: shiftPreference,
          dayPreferences: dayPreferences.includes("no_preference")
            ? []
            : dayPreferences,
        });

        setNoPreference(dayPreferences.includes("no_preference"));

        const generatedInitials = getNameInitials(userName);
        setInitials(generatedInitials);
      } else {
        form.setFieldsValue({
          email: userEmail,
        });
      }
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  useEffect(() => {
    if (opened) {
      fetchUserEmailAndProfile();
    }
  }, [opened]);

  useEffect(() => {
    const fetchUserEmailAndProfile = async () => {
      try {
        const { data: authData, error: authError } =
          await supabaseBrowserClient.auth.getUser();
        if (authError) {
          throw new Error(authError.message);
        }
        const userEmail = authData.user?.email || "";

        if (data) {
          const userName = data.name || "";
          const userType = data.user_type || "";
          const shiftPreference = data.shift_preference || "no_preference";
          const dayPreferences = data.day_preferences.length
            ? data.day_preferences
            : ["no_preference"];

          form.setFieldsValue({
            name: userName,
            email: userEmail || data.email,
            userType: userType,
            avatarUrl: data.avatarUrl,
            shiftPreference: shiftPreference,
            dayPreferences: dayPreferences.includes("no_preference")
              ? []
              : dayPreferences,
          });

          setNoPreference(dayPreferences.includes("no_preference"));

          const generatedInitials = getNameInitials(userName);
          setInitials(generatedInitials);
        } else {
          form.setFieldsValue({
            email: userEmail,
          });

          const generatedInitials = getNameInitials("");
          setInitials(generatedInitials);
        }
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error instanceof Error ? error.message : String(error)
        );
      }
    };

    fetchUserEmailAndProfile();
  }, [data, form]);

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      setIsPasswordValid(false);
      return Promise.resolve();
    }
    const errors = [];
    if (value.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(value)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(value)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(value)) {
      errors.push("Password must contain at least one digit.");
    }
    if (!/[\W_]/.test(value)) {
      errors.push("Password must contain at least one special character.");
    }
    if (errors.length > 0) {
      setIsPasswordValid(false);
      return Promise.reject(new Error(errors.join(" ")));
    }
    setIsPasswordValid(true);
    return Promise.resolve();
  };

  const closeModal = () => {
    setOpened(false);
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      const values = form.getFieldsValue();
  
      // Ensure the session is valid
      const { data: sessionData } = await supabaseBrowserClient.auth.getSession();
      if (!sessionData || !sessionData.session) {
        throw new Error("User is not authenticated.");
      }
  
      let avatarUrl = data?.avatarUrl || ""; // Default to existing avatar URL
      const file = selectedFile;
  
      // Handle file upload
      if (file) {
        const filePath = `${userId}/${file.name}`;
        console.log("Uploading file to:", filePath);
  
        const { error: uploadError, data: uploadData } = await supabaseBrowserClient.storage
          .from("avatars")
          .upload(filePath, file);
  
        if (uploadError) {
          console.error("File upload error:", uploadError.message);
          throw new Error(uploadError.message);
        }
  
        // Generate public URL for the uploaded avatar
        const { data: publicUrlData } = supabaseBrowserClient.storage
          .from("avatars")
          .getPublicUrl(filePath);
  
        if (!publicUrlData || !publicUrlData.publicUrl) {
          throw new Error("Failed to generate public URL for avatar.");
        }
  
        avatarUrl = publicUrlData.publicUrl;
        console.log("Avatar URL:", avatarUrl);
      }
  
      // Update the user's profile with the new avatar URL
      const updatedDayPreferences = noPreference
        ? ["no_preference"]
        : values.dayPreferences;
  
      const { error: profileError } = await supabaseBrowserClient
        .from("profiles")
        .update({
          avatar_url: avatarUrl,
          user_type: values.userType,
          shift_preference: values.shiftPreference,
          day_preferences: updatedDayPreferences,
        })
        .eq("user_id", userId);
  
      if (profileError) {
        console.error("Profile update error:", profileError.message);
        throw new Error(profileError.message);
      }
  
      message.success("Account settings updated successfully!");
      setLoading(false);
      setOpened(false);
    } catch (error) {
      setLoading(false);
  
      if (error instanceof Error) {
        message.error(`Failed to update account settings: ${error.message}`);
        console.error("Save failed:", error.message);
      } else {
        message.error("An unknown error occurred.");
        console.error("Save failed with unknown error:", error);
      }
    }
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
              src={data?.avatarUrl}
              initials={initials}
              style={{
                width: 96,
                height: 96,
                marginBottom: "24px",
              }}
            />

            <Form.Item label="Name" name="name">
              <Input
                placeholder=""
                disabled
                style={{ backgroundColor: "#f0f0f0" }}
              />
            </Form.Item>
            <Form.Item label="User Type" name="userType">
              <Input
                placeholder=""
                disabled
                style={{ backgroundColor: "#f0f0f0" }}
              />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input
                placeholder=""
                disabled
                style={{ backgroundColor: "#f0f0f0" }}
              />
            </Form.Item>

            <Form.Item label="Shift Preference" name="shiftPreference">
              <Select
                placeholder="No Preference"
                allowClear
                onChange={(value) => {
                  form.setFieldValue(
                    "shiftPreference",
                    value === "no_preference" ? "no_preference" : value
                  );
                }}
              >
                <Option value="no_preference">No Preference</Option>
                <Option value="Frühschicht">Frühschicht</Option>
                <Option value="Mittelschicht">Mittelschicht</Option>
                <Option value="Spätschicht">Spätschicht</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Day Preferences">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={noPreference}
                  onChange={(e) => {
                    setNoPreference(e.target.checked);
                    if (e.target.checked) {
                      form.setFieldValue("dayPreferences", []);
                    }
                  }}
                  style={{ marginRight: 8 }}
                >
                  No Preference
                </Checkbox>
                <Form.Item
                  name="dayPreferences"
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select your day preferences"
                    allowClear
                    disabled={noPreference}
                  >
                    <Option value="Montag">Montag</Option>
                    <Option value="Dienstag">Dienstag</Option>
                    <Option value="Mittwoch">Mittwoch</Option>
                    <Option value="Donnerstag">Donnerstag</Option>
                    <Option value="Freitag">Freitag</Option>
                    <Option value="Samstag">Samstag</Option>
                    <Option value="Sonntag">Sonntag</Option>
                  </Select>
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ validator: validatePassword }]}
              hasFeedback={!!form.getFieldValue("password") && isPasswordValid}
            >
              <Input.Password placeholder="Enter new password" />
            </Form.Item>

            <Form.Item label="Upload Avatar" name="avatarUrl">
              <Upload
                name="avatar"
                listType="picture"
                maxCount={1}
                showUploadList={false}
                beforeUpload={(file) => {
                  setSelectedFile(file);

                  // Only generate preview for images
                  const isImage = file.type.startsWith("image/");
                  if (isImage) {
                    const reader = new FileReader();
                    reader.onload = () =>
                      setPreviewImage(reader.result as string);
                    reader.readAsDataURL(file);
                  } else {
                    setPreviewImage(null);
                  }

                  return false; // Prevent automatic upload
                }}
              >
                <Button icon={<UploadOutlined />}>Upload Avatar</Button>
              </Upload>

              {/* Show a preview of the file */}
              {selectedFile && (
                <div style={{ marginTop: 16 }}>
                  <strong>Selected file:</strong> {selectedFile.name}
                </div>
              )}

              {/* Show an image preview if the file is an image */}
              {previewImage && (
                <div style={{ marginTop: 16 }}>
                  <img
                    src={previewImage}
                    alt="Avatar Preview"
                    style={{ width: 100 }}
                  />
                </div>
              )}
            </Form.Item>
          </Form>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              marginLeft: "auto",
            }}
          >
            <SaveOutlined style={{ fontSize: "16px" }} />
            <span>Save</span>
          </Button>
        </Card>
      </div>
    </Drawer>
  );
};
