module.exports = {
  apps: [
    {
      name: "nina-storage",
      port: "3003",
      exec_mode: "cluster",
      instances: "max",
      script: "npm",
      args: "start",
    },
  ],
};
