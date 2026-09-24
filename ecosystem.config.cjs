module.exports = {
  apps: [
    {
      name: "layafood-web",
      cwd: "/var/www/layafood/layafood-web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
