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
  App,
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
import "@/styles/globals.css";
import dayjs from "dayjs";

const { Option } = Select;

interface Props {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  userId: string;
  onAvatarUpdate: (avatarUrl: string | null) => void;
  preloadedData?: any;
  isSettingsLoaded?: boolean;
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
  const [shiftNoPreference, setShiftNoPreference] = useState(false);
  const availableDayOptions = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];
  const availableShiftOptions = ["Frühschicht", "Mittelschicht", "Spätschicht"];

  const handleShiftPreferencesChange = (selectedOptions: string[]) => {
    if (selectedOptions.length === availableShiftOptions.length) {
      message.warning(
        "Nicht in der Lage, alle Optionen auszuwählen, 'Keine Präferenz' gewählt."
      );
      form.setFieldsValue({ shiftPreference: [] });
      setShiftNoPreference(true);
    } else {
      form.setFieldsValue({ shiftPreference: selectedOptions });
    }
  };

  const handleDayPreferencesChange = (selectedOptions: string[]) => {
    if (selectedOptions.length === availableDayOptions.length) {
      message.warning(
        "Nicht in der Lage, alle Optionen auszuwählen, 'Keine Präferenz' gewählt."
      );
      form.setFieldsValue({ dayPreferences: [] });
      setNoPreference(true);
    } else {
      form.setFieldsValue({ dayPreferences: selectedOptions });
    }
  };

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
        const initialData = {
          ...data,
          userType: data.user_type,
          email: data.email,
          birthday: data.birthday
            ? dayjs(data.birthday).format("DD.MM.YYYY")
            : "",
          shiftPreference: data.shift_preference || [],
          dayPreferences: data.day_preferences || [],
          work_days_per_week: data.work_days_per_week || "1",
        };

        // For day preferences
        if (initialData.dayPreferences.includes("no_preference")) {
          setNoPreference(true);
          initialData.dayPreferences = [];
        } else {
          setNoPreference(false);
        }

        // For shift preferences
        if (initialData.shiftPreference.includes("no_preference")) {
          setShiftNoPreference(true);
          initialData.shiftPreference = [];
        } else {
          setShiftNoPreference(false);
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
    const resetFormAndData = async () => {
      if (opened && data) {
        setPassword("");
        setConfirmPassword("");
        setPasswordErrors([]);
        setPasswordValid(false);
        setPasswordsMatch(false);
        setSelectedFile(null);
        setPreviewImage(null);

        if (data?.avatar_url) {
          const signedUrl = await fetchSignedAvatarUrl(data.avatar_url);
          setAvatarUrl(signedUrl || null);
        } else {
          setAvatarUrl(null);
        }
      }
    };

    resetFormAndData();
  }, [opened, form, data]);

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
    if (!hasMinLength) errors.push("Mindestens 8 Zeichen");
    if (!hasUppercase) errors.push("Mindestens ein Großbuchstabe");
    if (!hasNumber) errors.push("Mindestens eine Zahl");
    if (!hasSpecialChar) errors.push("Mindestens ein Sonderzeichen");

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

      // Password validation and update
      if (password || confirmPassword) {
        if (!validatePassword(password) || password !== confirmPassword) {
          showMessage(
            password !== confirmPassword ? "error" : "warning",
            password !== confirmPassword
              ? "Die Passwörter stimmen nicht überein."
              : "Das Passwort erfüllt nicht die Mindestanforderungen."
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
          showMessage("error", "Passwort konnte nicht aktualisiert werden.");
          setLoading(false);
          return;
        }
      }

      // Avatar handling
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
          showMessage("error", "Avatar konnte nicht aktualisiert werden.");
          setLoading(false);
          return;
        }
      }

      let shiftPreference = form.getFieldValue("shiftPreference");
      let dayPreferences = form.getFieldValue("dayPreferences");

      if (shiftNoPreference) {
        shiftPreference = ["no_preference"];
      } else if (!shiftPreference || shiftPreference.length === 0) {
        setShiftNoPreference(true);
        shiftPreference = ["no_preference"];
      }

      if (noPreference) {
        dayPreferences = ["no_preference"];
      } else if (!dayPreferences || dayPreferences.length === 0) {
        setNoPreference(true);
        dayPreferences = ["no_preference"];
      }

      const workDaysPerWeek = form.getFieldValue("work_days_per_week");

      if (
        avatarPath !== data?.avatar_url ||
        !isEqual(shiftPreference, initialValues.shift_preference) ||
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
          showMessage("error", "Profil konnte nicht aktualisiert werden.");
          setLoading(false);
          return;
        }
      }

      // Show success message based on what was updated
      showMessage(
        "success",
        passwordUpdated && settingsUpdated
          ? "Passwort und Einstellungen erfolgreich gespeichert."
          : passwordUpdated
          ? "Passwort erfolgreich aktualisiert."
          : "Einstellungen erfolgreich gespeichert."
      );

      setOpened(false);
    } catch {
      showMessage("error", "Ein unerwarteter Fehler ist aufgetreten.");
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
        showMessage("success", "Avatar erfolgreich gelöscht!");
        setOpened(false);
      }
    } catch {
      showMessage("error", "Avatar konnte nicht gelöscht werden.");
    }
  };

  // Show modal to confirm avatar deletion
  const handleShowDeleteAvatarModal = () => {
    showModal({
      title: "Löschen des Avatars bestätigen",
      content: () => (
        <p>Sind Sie sicher, dass Sie Ihren Avatar löschen möchten?</p>
      ),
      onOk: handleDeleteAvatar,
      okText: "Löschen",
      cancelText: "Abbrechen",
    });
  };

  if (isLoading || !initialValues) {
    return (
      <Drawer
        open={opened}
        width={756}
        onClose={() => setOpened(false)}
        styles={{
          body: {
            padding: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            overflow: "hidden",
          },
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
        <strong>Kontoeinstellungen</strong>
      </div>
      <div style={{ padding: "16px" }}>
        <Card style={{ backgroundColor: mode === "dark" ? "#2a2a2a" : "#fff" }}>
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
            <Form.Item label="Benutzertyp" name="userType">
              <Input disabled style={disabledInputStyle} />
            </Form.Item>
            <Form.Item label="E-Mail" name="email">
              <Input disabled style={disabledInputStyle} />
            </Form.Item>
            <Form.Item label="Geburtstag" name="birthday">
              <Input disabled style={disabledInputStyle} />
            </Form.Item>

            {!(
              data?.user_type === "admin" && data?.schedule_id === "admin"
            ) && (
              <>
                <Form.Item
                  label="Arbeitstage pro Woche"
                  name="work_days_per_week"
                >
                  <Select placeholder="Anzahl der Tage auswählen">
                    <Option value="1">1 Tag</Option>
                    <Option value="2">2 Tage</Option>
                    <Option value="3">3 Tage</Option>
                    <Option value="4">4 Tage</Option>
                    <Option value="5">5 Tage</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Schichtpräferenz">
                  <>
                    <Checkbox
                      checked={shiftNoPreference}
                      onChange={(e) => {
                        setShiftNoPreference(e.target.checked);
                        form.setFieldsValue({ shiftPreference: [] });
                      }}
                    >
                      Keine Präferenz
                    </Checkbox>
                    <Form.Item name="shiftPreference" noStyle>
                      <Select
                        mode="multiple"
                        placeholder={
                          shiftNoPreference
                            ? "Keine Präferenz"
                            : "Schichtpräferenzen auswählen"
                        }
                        allowClear
                        disabled={shiftNoPreference}
                        style={{ width: "100%" }}
                        onChange={handleShiftPreferencesChange}
                      >
                        <Option value="Frühschicht">Frühschicht</Option>
                        <Option value="Mittelschicht">Mittelschicht</Option>
                        <Option value="Spätschicht">Spätschicht</Option>
                      </Select>
                    </Form.Item>
                  </>
                </Form.Item>

                <Form.Item label="Tagespräferenz">
                  <>
                    <Checkbox
                      checked={noPreference}
                      onChange={(e) => {
                        setNoPreference(e.target.checked);
                        form.setFieldsValue({ dayPreferences: [] });
                      }}
                    >
                      Keine Präferenz
                    </Checkbox>
                    <Form.Item name="dayPreferences" noStyle>
                      <Select
                        mode="multiple"
                        placeholder={
                          noPreference
                            ? "Keine Präferenz"
                            : "Tagespräferenzen auswählen"
                        }
                        allowClear
                        disabled={noPreference}
                        style={{ width: "100%" }}
                        onChange={handleDayPreferencesChange}
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
              </>
            )}

            <Form.Item label="Passwort">
              <Input.Password
                value={password}
                onChange={handlePasswordChange}
                placeholder="Neues Passwort eingeben"
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
                  <CheckCircleOutlined /> Ihr Passwort erfüllt alle
                  Anforderungen.
                </div>
              )}
            </Form.Item>

            <Form.Item label="Passwort bestätigen">
              <Input.Password
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Neues Passwort bestätigen"
              />
              {confirmPassword && !passwordsMatch && (
                <div style={{ color: "red", marginTop: 8 }}>
                  <CloseCircleOutlined /> Die Passwörter stimmen nicht überein.
                </div>
              )}
              {confirmPassword && passwordsMatch && (
                <div style={{ color: "green", marginTop: 8 }}>
                  <CheckCircleOutlined /> Die Passwörter stimmen überein!
                </div>
              )}
            </Form.Item>

            <Form.Item
              label="Avatar hochladen"
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
                <Button icon={<UploadOutlined />}>Avatar hochladen</Button>
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
                    Ausgewähltes Bild entfernen
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
                Aktuellen Avatar löschen
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
              <span>Speichern</span>
            </Button>
          </div>
        </Card>
      </div>
    </Drawer>
  );
};
