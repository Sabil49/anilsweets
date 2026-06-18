const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

function extractErrorText(input: unknown): string {
  if (!input && input !== 0) return '';
  if (typeof input === 'string') return input;
  if (input instanceof Error) return input.message;

  if (typeof input === 'object') {
    const value = input as Record<string, unknown>;
    return extractErrorText(
      value.error ?? value.message ?? value.details ?? value.data ?? value.code,
    );
  }

  return String(input);
}

export function getUserFriendlyErrorMessage(
  input: unknown,
  fallback = DEFAULT_ERROR_MESSAGE,
): string {
  const raw = extractErrorText(input).trim();
  const normalized = raw.toLowerCase();

  if (!raw) return fallback;

  if (
    normalized.includes('auth/invalid-credential') ||
    normalized.includes('auth/wrong-password') ||
    normalized.includes('auth/user-not-found') ||
    normalized.includes('invalid credential') ||
    normalized.includes('incorrect password')
  ) {
    return 'Email or password is wrong. Please try again with the right credentials.';
  }
  if (normalized.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (normalized.includes('auth/email-already-in-use')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  if (normalized.includes('auth/weak-password')) {
    return 'Please choose a stronger password with at least 6 characters.';
  }
  if (
    normalized.includes('auth/too-many-requests') ||
    normalized.includes('too many attempts')
  ) {
    return 'Too many attempts. Please wait a few minutes and try again.';
  }
  if (
    normalized.includes('auth/network-request-failed') ||
    normalized.includes('network error') ||
    normalized.includes('failed to fetch')
  ) {
    return 'Please check your internet connection and try again.';
  }
  if (normalized.includes('auth/requires-recent-login')) {
    return 'For your security, please sign in again before continuing.';
  }
  if (normalized.includes('auth/user-disabled')) {
    return 'This account has been disabled. Please contact support.';
  }
  if (normalized.includes('permission-denied')) {
    return 'You do not have permission to do that. Please sign in again.';
  }
  if (
    normalized.includes('validation failed') ||
    normalized.includes('validation error')
  ) {
    return 'Some information is missing or invalid. Please check your details and try again.';
  }
  if (normalized.includes('order creation failed')) {
    return 'We could not place your order. Please check your details and try again.';
  }
  if (
    normalized.includes('no checkout url') ||
    normalized.includes('failed to create checkout')
  ) {
    return 'We could not open the payment page. Please try again.';
  }
  if (/stock|insufficient|only has/.test(normalized)) {
    return raw
      .replace(/^firebase:\s*/i, '')
      .replace(/\s*\([^)]*\/[^)]*\)\.?$/i, '')
      .trim();
  }

  // Technical provider errors, serialized objects, and server internals should
  // never be shown directly to customers.
  if (
    normalized.includes('firebase') ||
    normalized.includes('auth/') ||
    normalized.includes('internal server error') ||
    normalized.includes('unexpected token') ||
    /^[{\[]/.test(raw)
  ) {
    return fallback;
  }

  return raw.replace(/[\[\]{}"]/g, '').trim() || fallback;
}

export function sanitizeErrorMessage(input: unknown): string {
  return getUserFriendlyErrorMessage(input);
}
