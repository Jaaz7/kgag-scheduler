export const getNameInitials = (name: string | undefined): string => {
  if (!name) {
    return ""; // Return an empty string if the name is undefined or empty
  }

  const nameParts = name.split(" ").filter(Boolean);

  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase(); // Return only one initial if there's only one name part
  }

  const firstInitial = nameParts[0].charAt(0).toUpperCase();
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();

  return firstInitial + lastInitial;
};
