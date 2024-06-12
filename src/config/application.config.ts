const databaseConfig = {
  DB_SCHEMA: process.env.DB_SCHEMA,
  DB_HOST: process.env.DB_HOST || 'localhost',
  BD_PORT: Number(process.env.BD_PORT) || 3306,
  DB_USERNAME: process.env.DB_USERNAME || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD,
};

export const AppConfig = () => ({
  PORT: 3000,
  DEV_MODE: true,
  JWT_SECRET: process.env.JWT_SECRET,
  ...databaseConfig,
});
