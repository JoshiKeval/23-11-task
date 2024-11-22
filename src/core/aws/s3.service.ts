import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger('S3Service');
  private client: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.client = this.s3Config();
  }

  private s3Config() {
    return new S3Client({
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
      region: this.configService.get('AWS_REGION'),
    });
  }

  public async uploadFile(file: any, key: string): Promise<string> {
    try {
      const bucket = this.configService.get('AWS_BUCKET');
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });
      await this.client.send(command);
      const objectUrl = `https://${bucket}.s3.amazonaws.com/${encodeURIComponent(
        key,
      )}`;
      return objectUrl;
    } catch (err) {
      this.logger.error(err, 's3 upload file error');
      throw err;
    }
  }
}
