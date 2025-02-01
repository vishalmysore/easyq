export const environment = {
  production: true,
  apiUrl: process.env['VITE_API_URL'] || 'https://default-api-url',  // Fallback if env var is not found
  apiUser: process.env['VITE_API_USER'] || 'default-user',
  apiPass: process.env['VITE_API_PASS'] || 'default-password'
};
