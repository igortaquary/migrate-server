const databaseConfig = {
  DB_SCHEMA: process.env.DB_SCHEMA,
  DB_HOST: process.env.DB_HOST || 'localhost',
  BD_PORT: Number(process.env.BD_PORT) || 3306,
  DB_USERNAME: process.env.DB_USERNAME || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD,
};

const minioConfig = {
  MINIO_SSL: process.env.MINIO_SSL,
  MINIO_HOST: process.env.MINIO_HOST || 'localhost',
  MINIO_PORT: process.env.MINIO_PORT,
  MINIO_BUCKET: process.env.MINIO_BUCKET || 'migrate',
};

export const AppConfig = () => ({
  PORT: 3000,
  DEV_MODE: process.env.DEV_MODE === 'true',
  JWT_SECRET: process.env.JWT_SECRET,
  ...databaseConfig,
  ...minioConfig,
});
