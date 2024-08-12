import { Client, DEFAULT_REGION } from 'minio';

export class StorageProvider {
  private bucketName = process.env.MINIO_BUCKET;
  private client: Client;
  constructor() {
    this.client = new Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT),
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
      useSSL: process.env.MINIO_SSL === 'true',
    });
  }

  async init() {
    const exists = await this.client.bucketExists(this.bucketName);
    if (!exists) {
      await this.client.makeBucket(this.bucketName, DEFAULT_REGION, {
        ObjectLocking: false,
      });
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              AWS: ['*'],
            },
            Action: ['s3:GetBucketLocation', 's3:ListBucket'],
            Resource: ['arn:aws:s3:::migrate'],
          },
          {
            Effect: 'Allow',
            Principal: {
              AWS: ['*'],
            },
            Action: ['s3:GetObject'],
            Resource: ['arn:aws:s3:::migrate/*'],
          },
        ],
      };
      await this.client.setBucketPolicy(
        this.bucketName,
        JSON.stringify(policy),
      );
    }

    return this.client;
  }

  async addImage(file: File, filename: string) {
    await this.init();
    const buffer = Buffer.from(await file.arrayBuffer());
    await this.client.putObject(this.bucketName, filename, buffer, file.size);

    return this.getPublicUrl(filename);
  }

  publicUrlBaseHref =
    (process.env.MINIO_SSL === 'true' ? 'https://' : 'http://') +
    process.env.MINIO_ENDPOINT +
    ':' +
    process.env.MINIO_PORT +
    '/' +
    process.env.MINIO_BUCKET +
    '/';

  getPublicUrl(filename: string) {
    return this.publicUrlBaseHref + filename;
  }

  getFilenameFromPublicUrl(url: string) {
    return url.split(this.publicUrlBaseHref).pop();
  }

  deleteImage(imageStorageUrl: string) {
    const filename = this.getFilenameFromPublicUrl(imageStorageUrl);
    return this.client.removeObject(this.bucketName, filename);
  }
}
