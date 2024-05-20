class AppError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export default AppError;
