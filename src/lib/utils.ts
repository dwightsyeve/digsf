export const formatError = (error: any): string => {
  if (!error) return 'An unexpected error occurred';
  const message = error.message || String(error);
  
  // Strip "Firebase:" prefix and technical wrappers
  let cleanMessage = message
    .replace(/^Firebase:\s*/, '')
    .replace(/Error\s*\(auth\//, '')
    .replace(/Error\s*\(firestore\//, '')
    .replace(/\)\.?$/, '')
    .replace(/-/g, ' ');

  // Professional mapping for common codes
  const code = error.code;
  if (code === 'auth/user-not-found') return 'No account found with this email.';
  if (code === 'auth/wrong-password') return 'Incorrect password. Please try again.';
  if (code === 'auth/invalid-email') return 'Please enter a valid email address.';
  if (code === 'auth/email-already-in-use') return 'An account already exists with this email.';
  if (code === 'auth/weak-password') return 'Password should be at least 6 characters.';
  if (code === 'auth/popup-closed-by-user') return 'Login window was closed.';
  if (code === 'auth/network-request-failed') return 'Connectivity issue. Please check your internet.';
  if (code === 'permission-denied') return 'You do not have permission to perform this action.';
  if (code === 'unavailable') return 'The service is temporarily unavailable. Please try again.';
  
  if (message.includes('offline')) return 'Connectivity issue. Please check your internet.';
  if (message.includes('insufficient balance')) return 'Insufficient wallet balance for this operation.';

  // Capitalize first letter
  return cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1) || 'Operation failed. Please try again.';
};
