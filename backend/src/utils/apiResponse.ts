export const success = <T>(data: T, message = "OK") => ({
  status: "success" as const,
  message,
  data
});
