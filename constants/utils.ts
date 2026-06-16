export function sanitizeErrorMessage(input: any): string {
  if (!input && input !== 0) return 'Something went wrong.';
  if (typeof input === 'string') {
    // remove surrounding braces and square brackets and extra quotes
    return input.replace(/[\[\]{}]/g, '').replace(/"/g, '').trim();
  }
  try {
    if (typeof input === 'object') {
      if (input.error) return sanitizeErrorMessage(input.error);
      if (input.message) return sanitizeErrorMessage(input.message);
      if (input.details) return sanitizeErrorMessage(input.details);
      return JSON.stringify(input);
    }
    return String(input);
  } catch (e) {
    return 'Something went wrong.';
  }
}
