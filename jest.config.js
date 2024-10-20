/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  globals: {
    TextDecoder: require("util").TextDecoder,
    TextEncoder: require("util").TextEncoder,
  },
  preset: "ts-jest",
  setupFilesAfterEnv: ["./setup-jest.js"],
  testEnvironment: "jsdom",
};
