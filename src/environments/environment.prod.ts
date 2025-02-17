export const environment = {
  apiUrl: "https://vishalmysore-easyqserver.hf.space/api/",
  authUrl: "https://vishalmysore-easyqserver.hf.space/auth/",
  wsUrl: "wss://vishalmysore-easyqserver.hf.space/ws/",
  broadcastUrl: "https://vishalmysore-easyqserver.hf.space/bs/",
  googleClientId: "992082477434-5durkouoia0lo1o7pk9lpmp08mbcnfru.apps.googleusercontent.com",
  easyQZUrl:"https://easyqz.online",
  production: true,
};
if (environment.production) {
console.log = function () {}; // Override console.log in production

}
