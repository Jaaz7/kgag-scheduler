import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Upload,
  Select,
  Checkbox,
  message,
  Spin,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { supabaseBrowserClient } from "@lib/supabase/client";
import { CustomAvatar } from "@components/common/CustomAvatar";
import { getNameInitials } from "@components/common/get-name-initials";
import { HttpError } from "@refinedev/core";
import { useQuery } from "@tanstack/react-query";
import Resizer from "react-image-file-resizer";
import { isEqual } from "lodash";
import { useModal } from "@/contexts/ModalProvider";
import { ColorModeContext } from "@contexts/ColorModeContext";
import { App } from "antd";
import "@/styles/globals.css";

const { Option } = Select;

interface Props {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  userId: string;
  onAvatarUpdate: (avatarUrl: string | null) => void;
}

export const AccountSettings = ({
  opened,
  setOpened,
  userId,
  onAvatarUpdate,
}: Props) => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState<any>(null);
  const [initials, setInitials] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [noPreference, setNoPreference] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordValid, setPasswordValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const { showModal } = useModal();
  const { mode } = useContext(ColorModeContext);

  // Fetch user data when drawer is opened
  const { data, isLoading, refetch } = useQuery<any, HttpError>(
    ["user", userId],
    async () => {
      const { data: profileData, error: profileError } =
        await supabaseBrowserClient
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

      if (profileError) throw new Error(profileError.message);

      const { data: userData, error: userError } =
        await supabaseBrowserClient.auth.getUser();

      if (userError) throw new Error(userError.message);

      return { ...profileData, email: userData.user?.email || "" };
    },
    {
      enabled: opened,
      onSuccess: async (data) => {
        if (data.avatar_url) {
          const signedUrl = await fetchSignedAvatarUrl(data.avatar_url);
          setAvatarUrl(signedUrl);
        }

        const initialData = {
          ...data,
          userType: data.user_type,
          email: data.email,
          shiftPreference: data.shift_preference || "",
          dayPreferences: data.day_preferences || [],
          work_days_per_week: data.work_days_per_week || "1",
        };

        if (initialData.dayPreferences.includes("no_preference")) {
          setNoPreference(true);
          initialData.dayPreferences = [];
        } else {
          setNoPreference(false);
        }

        form.setFieldsValue(initialData);
        setInitialValues(initialData);
        setInitials(getNameInitials(data.name || ""));
        setSelectedFile(null);
        setPreviewImage(null);
      },
    }
  );

  const showMessage = (
    type: "success" | "error" | "info" | "warning" | "loading",
    content: string
  ) => {
    return (
      <App>
        {(() => {
          switch (type) {
            case "success":
              message.success(content);
              break;
            case "error":
              message.error(content);
              break;
            case "info":
              message.info(content);
              break;
            case "warning":
              message.warning(content);
              break;
            case "loading":
              message.loading(content);
              break;
            default:
              break;
          }
          return null;
        })()}
      </App>
    );
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: mode === "dark" ? "rgb(51 51 51)" : "#fff",
    color: mode === "dark" ? "#f0f0f0" : "  ",
  };

  const disabledInputStyle: React.CSSProperties = {
    backgroundColor: mode === "dark" ? "#3a3a3a" : "#f0f0f0",
    color: mode === "dark" ? "#b0b0b0" : "#",
  };

  // Reset form and password fields when drawer is opened
  useEffect(() => {
    form.resetFields();
    setPassword("");
    setConfirmPassword("");
    setPasswordErrors([]);
    setPasswordValid(false);
    setPasswordsMatch(false);
  }, [form]);

  // Resize image to a smaller size for avatar upload
  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        256,
        256,
        "PNG",
        80,
        0,
        (uri) => resolve(uri as Blob),
        "blob"
      );
    });
  };

  // Fetch signed URL for the avatar
  const fetchSignedAvatarUrl = async (filePath: string) => {
    const { data, error } = await supabaseBrowserClient.storage
      .from("avatars")
      .createSignedUrl(filePath, 60);

    if (error) {
      console.error("Error fetching signed URL:", error.message);
      return null;
    }

    return data.signedUrl;
  };

  // Validate password according to specified requirements
  const validatePassword = (password: string) => {
    const hasMinLength = /.{8,}/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (!hasMinLength) errors.push("At least 8 characters");
    if (!hasUppercase) errors.push("At least one uppercase letter");
    if (!hasNumber) errors.push("At least one number");
    if (!hasSpecialChar) errors.push("At least one special character");

    setPasswordErrors(errors);
    setPasswordValid(errors.length === 0);

    return errors.length === 0;
  };

  // Handle changes in the password field
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (!newPassword) {
      setPasswordErrors([]);
      setPasswordValid(false);
      setPasswordsMatch(false);
      return;
    }

    const isValid = validatePassword(newPassword);
    setPasswordsMatch(newPassword === confirmPassword);
  };

  // Handle changes in the confirm password field
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordsMatch(password === newConfirmPassword);
  };

  // Save the settings including password and avatar
  const handleSave = async () => {
    let passwordUpdated = false;
    let settingsUpdated = false;

    try {
      setLoading(true);

      if (password || confirmPassword) {
        if (!validatePassword(password) || password !== confirmPassword) {
          showMessage(
            password !== confirmPassword ? "error" : "warning",
            password !== confirmPassword
              ? "Passwords do not match."
              : "Password does not meet the minimum requirements."
          );
          setLoading(false);
          return;
        }

        try {
          await supabaseBrowserClient
            .from("profiles")
            .update({ password })
            .eq("user_id", userId);
          passwordUpdated = true;
        } catch {
          showMessage("error", "Failed to update password.");
          setLoading(false);
          return;
        }
      }

      let avatarPath = data?.avatar_url || "";
      if (selectedFile) {
        try {
          const filePath = `avatars/${userId}/avatar-${Date.now()}.png`;

          if (avatarPath) {
            await supabaseBrowserClient.storage
              .from("avatars")
              .remove([avatarPath]);
          }

          const resizedFile = await resizeImage(selectedFile);
          await supabaseBrowserClient.storage
            .from("avatars")
            .upload(filePath, resizedFile);

          avatarPath = filePath;
          const signedUrl = await fetchSignedAvatarUrl(avatarPath);
          if (signedUrl) {
            setAvatarUrl(signedUrl);
            onAvatarUpdate(signedUrl);
          }
        } catch {
          showMessage("error", "Failed to update avatar.");
          setLoading(false);
          return;
        }
      }

      const shiftPreference = form.getFieldValue("shiftPreference");
      const dayPreferences = noPreference
        ? ["no_preference"]
        : form.getFieldValue("dayPreferences");
      const workDaysPerWeek = form.getFieldValue("work_days_per_week");

      if (
        avatarPath !== data?.avatar_url ||
        shiftPreference !== initialValues.shift_preference ||
        !isEqual(dayPreferences, initialValues.day_preferences) ||
        workDaysPerWeek !== initialValues.work_days_per_week
      ) {
        try {
          await supabaseBrowserClient
            .from("profiles")
            .update({
              avatar_url: avatarPath,
              shift_preference: shiftPreference,
              day_preferences: dayPreferences,
              work_days_per_week: workDaysPerWeek,
            })
            .eq("user_id", userId);
          settingsUpdated = true;
        } catch {
          showMessage("error", "Failed to update profile.");
          setLoading(false);
          return;
        }
      }

      showMessage(
        "success",
        passwordUpdated && settingsUpdated
          ? "Password and settings saved successfully."
          : passwordUpdated
          ? "Password updated successfully."
          : "Settings saved successfully."
      );

      setOpened(false);
    } catch {
      showMessage("error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar deletion confirmation
  const handleDeleteAvatar = async () => {
    try {
      if (data?.avatar_url) {
        await supabaseBrowserClient.storage
          .from("avatars")
          .remove([data.avatar_url]);

        await supabaseBrowserClient
          .from("profiles")
          .update({ avatar_url: null })
          .eq("user_id", userId);

        setAvatarUrl(null);
        onAvatarUpdate(null);
        showMessage("success", "Avatar deleted successfully!");
        setOpened(false);
      }
    } catch {
      showMessage("error", "Failed to delete avatar.");
    }
  };

  // Show modal to confirm avatar deletion
  const handleShowDeleteAvatarModal = () => {
    showModal({
      title: "Confirm Avatar Deletion",
      content: <p>Are you sure you want to delete your avatar?</p>,
      onOk: handleDeleteAvatar,
      okText: "Delete",
      cancelText: "Cancel",
    });
  };

  if (isLoading) {
    return (
      <Drawer
        open={opened}
        width={756}
        onClose={() => setOpened(false)}
        styles={{ body: {
          padding: 0, 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "100%", 
          overflow: "hidden"}
        }}
        style={{
          display: "flex",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: mode === "dark" ? "#141414" : "#fff",
            color: mode === "dark" ? "#fff" : "#000",
          }}
        >
          <Spin
            size="large"
            style={{
              color: mode === "dark" ? "#40a9ff" : "#1890ff",
            }}
          />
        </div>
      </Drawer>
    );
  }

  return (
    <Drawer
      onClose={() => setOpened(false)}
      open={opened}
      width={756}
      style={{
        transition: "all 0.3s ease",
      }}
    >
    
        <div style={headerStyle}>
          <strong>Account Settings</strong>
        </div>
        <div style={{ padding: "16px" }}>
          <Card
            style={{ backgroundColor: mode === "dark" ? "#2a2a2a" : "#fff" }}
          >
            <Form form={form} layout="vertical">
              <CustomAvatar
                shape="square"
                src={avatarUrl}
                initials={initials}
                style={{ width: 96, height: 96, marginBottom: "20px" }}
              />
              <Form.Item label="Name" name="name">
                <Input disabled style={disabledInputStyle} />
              </Form.Item>
              <Form.Item label="User Type" name="userType">
                <Input disabled style={disabledInputStyle} />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input disabled style={disabledInputStyle} />
              </Form.Item>

              <Form.Item
                label="Working Days Per Week"
                name="work_days_per_week"
              >
                <Select placeholder="Select number of days">
                  <Option value="1">1 Day</Option>
                  <Option value="2">2 Days</Option>
                  <Option value="3">3 Days</Option>
                  <Option value="4">4 Days</Option>
                  <Option value="5">5 Days</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Shift Preference" name="shiftPreference">
                <Select placeholder="No Preference" allowClear>
                  <Option value="no_preference">No Preference</Option>
                  <Option value="Frühschicht">Frühschicht</Option>
                  <Option value="Mittelschicht">Mittelschicht</Option>
                  <Option value="Spätschicht">Spätschicht</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Day Preferences">
                <>
                  <Checkbox
                    checked={noPreference}
                    onChange={(e) => {
                      setNoPreference(e.target.checked);
                      form.setFieldsValue({ dayPreferences: [] });
                    }}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    No Preference
                  </Checkbox>
                  <Form.Item
                    name="dayPreferences"
                    style={{ flex: 1, marginBottom: 0 }}
                    noStyle
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select your day preferences"
                      allowClear
                      disabled={noPreference}
                      style={{ width: "100%" }}
                    >
                      <Option value="Montag">Montag</Option>
                      <Option value="Dienstag">Dienstag</Option>
                      <Option value="Mittwoch">Mittwoch</Option>
                      <Option value="Donnerstag">Donnerstag</Option>
                      <Option value="Freitag">Freitag</Option>
                      <Option value="Samstag">Samstag</Option>
                    </Select>
                  </Form.Item>
                </>
              </Form.Item>

              <Form.Item label="Password">
                <Input.Password
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
                {passwordErrors.length > 0 && (
                  <ul
                    style={{
                      color: "red",
                      paddingLeft: "20px",
                      marginTop: 8,
                    }}
                  >
                    {passwordErrors.map((error, index) => (
                      <li key={index}>
                        <CloseCircleOutlined /> {error}
                      </li>
                    ))}
                  </ul>
                )}
                {password && passwordValid && (
                  <div style={{ color: "green", marginTop: 8 }}>
                    <CheckCircleOutlined /> Your password meets all
                    requirements.
                  </div>
                )}
              </Form.Item>

              <Form.Item label="Confirm Password">
                <Input.Password
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm new password"
                />
                {confirmPassword && !passwordsMatch && (
                  <div style={{ color: "red", marginTop: 8 }}>
                    <CloseCircleOutlined /> Passwords do not match.
                  </div>
                )}
                {confirmPassword && passwordsMatch && (
                  <div style={{ color: "green", marginTop: 8 }}>
                    <CheckCircleOutlined /> Passwords match!
                  </div>
                )}
              </Form.Item>

              <Form.Item
                label="Upload Avatar"
                name="avatarUrl"
                valuePropName="fileList"
                getValueFromEvent={(e) =>
                  Array.isArray(e) ? e : e && e.fileList
                }
              >
                <Upload
                  name="avatar"
                  listType="picture"
                  maxCount={1}
                  showUploadList={false}
                  beforeUpload={(file) => {
                    setSelectedFile(file);
                    if (file.type.startsWith("image/")) {
                      const reader = new FileReader();
                      reader.onload = () =>
                        setPreviewImage(reader.result as string);
                      reader.readAsDataURL(file);
                    } else {
                      setPreviewImage(null);
                    }
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                </Upload>

                {previewImage && (
                  <div style={{ marginTop: 16 }}>
                    <img
                      src={previewImage}
                      alt="Avatar Preview"
                      style={{ width: 100 }}
                    />
                  </div>
                )}

                {selectedFile && (
                  <div style={{ marginTop: 8 }}>
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewImage(null);
                      }}
                      danger
                    >
                      Clear Selected Image
                    </Button>
                  </div>
                )}
              </Form.Item>

              {avatarUrl && (
                <Button
                  type="default"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={handleShowDeleteAvatarModal}
                >
                  Delete Current Avatar
                </Button>
              )}
            </Form>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 24,
              }}
            >
              <Button
                type="primary"
                onClick={handleSave}
                loading={loading}
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <SaveOutlined style={{ fontSize: "16px" }} />
                <span>Save</span>
              </Button>
            </div>
          </Card>
        </div>

    </Drawer>
  );
};
