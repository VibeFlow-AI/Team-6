export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: new AuthError('Invalid email or password', 401),
  USER_EXISTS: new AuthError('User with this email already exists', 400),
  INVALID_ROLE: new AuthError('Invalid user role', 400),
  VALIDATION_ERROR: (details: any) => new AuthError('Validation error', 400, details),
  INTERNAL_ERROR: new AuthError('Internal server error', 500),
  UNAUTHORIZED: new AuthError('Unauthorized access', 401),
  FORBIDDEN: new AuthError('Forbidden access', 403),
}; 