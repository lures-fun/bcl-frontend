export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}年${month}月${day}日`;
};

export const formatDateTime = (dateTime: Date | string) => {
  const dateObject =
    typeof dateTime === 'string' ? new Date(dateTime) : dateTime;

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');
  const hour = String(dateObject.getHours()).padStart(2, '0');
  const minute = String(dateObject.getMinutes()).padStart(2, '0');

  return `${year}年${month}月${day}日${hour}:${minute}`;
};
