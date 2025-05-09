module.exports = {
  apps: [
    {
      name: "nina-storage",
      port: "3003",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
