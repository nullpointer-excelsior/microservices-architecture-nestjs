import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StorageCLient {

    constructor(private readonly client: S3Client) {}

    async getObject(bucket: string, objectId: string) {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: objectId,
        });
        return this.client.send(command)
    }
}