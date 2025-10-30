// This file is deprecated - authentication is now handled by AuthContext
// Kept for backward compatibility during migration

/**
 * @deprecated Use useAuth hook from AuthContext instead
 */
export const isAuthenticated = (): boolean => {
  return false; // Will be handled by AuthContext
};

/**
 * @deprecated Use useAuth hook from AuthContext instead
 */
export const getCurrentUser = () => {
  return null;
};

/**
 * @deprecated Use useAuth hook from AuthContext instead
 */
export const logout = () => {
  // Will be handled by AuthContext
};
