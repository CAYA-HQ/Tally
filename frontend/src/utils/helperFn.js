export const formatDate = (date) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
};

export const formatDateForInput = (date) => {
  if (!date) return "";

  const [day, month, year] = date.split("/");

  return `${year}-${month}-${day}`;
};