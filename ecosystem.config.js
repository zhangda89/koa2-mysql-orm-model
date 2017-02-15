module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: "koa-mysql-orm-model-production",
      script: "app/app.babel.js",
      error_file: "log/wap.out",
      out_file: "log/wap.out",
      watch: false,
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production: {
        NODE_ENV: "production",
        NODE_CONFIG_DIR: __dirname + "/app/config",
        NODE_APP_INSTANCE: "",

      }
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: "node",
      host: "212.83.163.1",
      ref: "origin/master",
      repo: "git@github.com:repo.git",
      path: "/var/www/production",
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.json --env production"
    },
    dev: {
      user: "node",
      host: "212.83.163.1",
      ref: "origin/master",
      repo: "git@github.com:repo.git",
      path: "/var/www/development",
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.json --env dev",
      env: {
        NODE_ENV: "dev"
      }
    }
  }
}
