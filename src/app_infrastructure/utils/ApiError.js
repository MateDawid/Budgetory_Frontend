class ApiError extends Error {
  constructor(message, data) {
    super(message);
    this.name = this.constructor.name;
    this.data = data;
  }
}

export default ApiError;