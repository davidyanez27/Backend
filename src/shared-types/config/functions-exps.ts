export const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const formatDate = (value: unknown) => {
  const d = value instanceof Date ? value : new Date(value as any);
  return new Intl.DateTimeFormat("en-US", options).format(d);
};