export const success = (data: unknown) => ({
  success: true,
  data,
});

export const failure = (message: string) => ({
  success: false,
  message,
});