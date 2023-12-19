import { Injectable } from "@nestjs/common";
import { GetObjectCommand, S3, S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StorageService {

    private readonly accesKeyId: string;
    private readonly secretAccessKey: string;
    private readonly bucket: string;
    private readonly client: S3Client;

    constructor(private config: ConfigService) {
        this.accesKeyId = this.config.get('MINIO_ACCESS_KEY_ID');
        this.secretAccessKey = this.config.get('MINIO_SECRET_ACCESS_KEY');
        this.bucket = this.config.get('MUSIC_LIBRARY_BUCKET_NAME');
        console.log(this.accesKeyId, this.secretAccessKey, this.bucket)
        this.client = new S3Client({
            endpoint: "http://127.0.0.1:9000",
            credentials: {
                accessKeyId: "N6MihZ1IE4i60WhohE91",
                secretAccessKey: "jI1rbJPxauGG8F7P6MCWEqk5j1Izdwg0A42kof3L",
            
            }
        });
    }

    async getSongObject(objectId: string) {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: objectId,
            
        });
        return this.client.send(command);
    }
}