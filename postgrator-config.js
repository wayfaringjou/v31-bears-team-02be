require('dotenv').config();

const {
  NODE_ENV, RDS_HOSTNAME, RDS_USERNAME, RDS_PASSWORD, RDS_PORT, RDS_DB_NAME, TEST_RDS_DB_NAME
} = process.env;

let config;

if (NODE_ENV === 'test' || NODE_ENV === 'development') {
  config = {
    migrationsDirectory: 'migrations',
    driver: 'pg',
    host: RDS_HOSTNAME,
    port: RDS_PORT,
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: NODE_ENV === 'test' ? TEST_RDS_DB_NAME : RDS_DB_NAME,
  };
} else {
  config = {
    migrationsDirectory: 'migrations',
    driver: 'pg',
    host: RDS_HOSTNAME,
    port: RDS_PORT,
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: NODE_ENV === 'test' ? TEST_RDS_DB_NAME : RDS_DB_NAME,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}
console.log(config)
module.exports = config;
