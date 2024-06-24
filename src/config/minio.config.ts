import { Client } from 'minio';

export class StorageProvider {
  private bucketName = process.env.MINIO_BUCKET;
  private client: Client;
  constructor() {
    this.client = new Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT),
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
      useSSL: false,
    });
  }

  async init() {
    const exists = await this.client.bucketExists(this.bucketName);
    if (!exists) await this.client.makeBucket(this.bucketName);

    return this.client;
  }

  async addImage(file: File, filename: string) {
    await this.init();
    const buffer = Buffer.from(await file.arrayBuffer());
    await this.client.putObject(this.bucketName, filename, buffer, file.size);

    return this.getPublicUrl(filename);
  }

  getPublicUrl(filename: string) {
    return (
      process.env.MINIO_ENDPOINT +
      ':' +
      process.env.MINIO_PORT +
      '/' +
      process.env.MINIO_BUCKET +
      '/' +
      filename
    );
  }
}
