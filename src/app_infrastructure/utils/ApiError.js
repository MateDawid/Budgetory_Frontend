class ApiError extends Error {
  constructor(data) {
    const message = ApiError.getMessage(data)
    super(message);
    this.name = 'ApiError';
    this.data = data;
  }

  /**
   * Generates message for ApiError.
   * @param {string|object} apiErrors - ID of Budget to be deleted.
   * @return {string} Error message.
   */
  static getMessage(apiErrors) {
    if (typeof apiErrors === 'string') {
      return apiErrors
    }
    if (apiErrors.detail) {
      switch (typeof apiErrors.detail) {
        case "string": {
          return `API Error: ${apiErrors.detail}`
        }
        default: {
          return `API Error`
        }
      }
    }
  }
}

export default ApiError;
