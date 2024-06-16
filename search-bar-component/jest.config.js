module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!axios)"],
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}", // Specify the paths to collect coverage from
    "!src/**/*.d.ts", // Exclude declaration files
    "!src/setupTests.ts", // Exclude setup files
    "!src/**/index.ts", // Exclude index files
  ],
  coverageDirectory: "coverage", // Directory to output coverage reports
  coverageReporters: ["json", "lcov", "text", "clover"], // Report formats
};
