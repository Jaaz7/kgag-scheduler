export const getNameInitials = (name: string | undefined): string => {
  if (!name) {
    return "";
  }

  const nameParts = name.split(" ").filter(Boolean);

  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  const firstInitial = nameParts[0].charAt(0).toUpperCase();
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();

  return firstInitial + lastInitial;
};
