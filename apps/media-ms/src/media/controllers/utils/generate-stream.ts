import { S3ObjectResponseDTO } from "../../model/s3object-response.dto";
import type { Response } from 'express';

export async function generateStream(res: Response, dto: S3ObjectResponseDTO) {
    
    const { Body, ContentType, ContentLength } = dto;
    const bytesArray = await Body.transformToByteArray();
    const buffer = Buffer.from(bytesArray);

    res.setHeader('Content-Type', ContentType);
    res.setHeader('Content-Length', ContentLength);
    res.send(buffer);

}