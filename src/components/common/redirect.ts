export const getDefaultRedirect = (
  user_type: string | undefined,
  schedule_id: string | undefined
): string => {
  if (user_type === "admin" && schedule_id === "admin") {
    return "/schedule-admin";
  } else if (user_type === "standardbenutzer" && schedule_id === "hb-shop") {
    return "/schedule-hb";
  }

  return "/";
};
