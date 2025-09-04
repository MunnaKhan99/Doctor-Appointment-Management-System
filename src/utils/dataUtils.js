export const formatDateTime = (date, time) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const [hours, minutes] = time.split(':');
  return `${year}-${month}-${day} ${hours}:${minutes}:00`;
};