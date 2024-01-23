// This is a default constants for local testing purposes

export default {
  port: 3000,
  dbUri: "mongodb://localhost:27017/infynno_practical",
  users: [
    { username: "yash", email: "yash@gmail.com", password: "yash123" },
    { username: "test", email: "tes@gmail.com", password: "test@123" },
  ],
  jwt_secret: "secretkey123",
};
