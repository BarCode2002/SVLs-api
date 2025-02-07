import {
  Controller,
  HttpException,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import axios, { AxiosResponse } from 'axios';
import { Multer } from 'multer';
import * as FormData from 'form-data';

interface IPFSResponse {
  Hash: string;
}

@Controller('upload')
export class UploadController {
  @UseInterceptors(
    FilesInterceptor('file', 20, {
      fileFilter: (_req, file, cb) => {
        const allowedMimes = [
          'application/octet-stream',
          'image/jpeg',
          'image/png',
        ];
        if (!allowedMimes.includes(file.mimetype)) {
          return cb(
            new HttpException(
              'Only mimetypes application/octet-stream, image/jpeg and image/png are allowed!',
              400,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @Post()
  async uploadFiles(@UploadedFiles() files: Multer.File[]) {
    try {
      const uploadedFilesCIDs: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        formData.append('file', file.buffer, file.originalname);

        const response: AxiosResponse<IPFSResponse> = await axios.post(
          'http://127.0.0.1:5001/api/v0/add',
          formData,
          {
            headers: formData.getHeaders(),
          },
        );

        if (response.status === 200) {
          uploadedFilesCIDs.push(response.data.Hash);
        } else {
          throw new HttpException('Failed to upload file to IPFS', 500);
        }
      }
      return {
        cids: uploadedFilesCIDs,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new HttpException(errorMessage, 500);
    }
  }
}
