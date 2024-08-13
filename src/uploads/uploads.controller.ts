import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Storage } from '@google-cloud/storage';
import { UploadsService } from './uploads.service';



/*[
  {
    fieldname: 'attachment[]',
    originalname: 'clean.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 43 00 06 04 05 06 05 04 06 06 05 06 07 07 06 08 0a 10 0a 0a 09 09 0a 14 0e 0f 0c ... 47254 more bytes>,
    size: 47304
  }
]
  */

@Controller('attachments')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}


  
  @Post()
  @UseInterceptors(FilesInterceptor('attachment[]'))
  async uploadFile(@UploadedFiles() attachment: Array<Express.Multer.File>) {
    console.log(attachment);
    const Uploadfiles = (file:Express.Multer.File,folderName:string)=>{
      return new Promise((resolve:any, reject) => {
        const d = new Date();

        const fileName = `file.originalname_${d.getUTCDate}`;
        const filePath = `${folderName}/${fileName}`;



        const UploadBucket = new Storage({
          projectId: process.env.Projectid,
          credentials: {
              // clientEmail: process.env.GOOGLE_APPLICATION_CREDENTIALS,
              type: process.env.GOOGLE_APPLICATION_CREDENTIALS_type,
              projectId: process.env.GOOGLE_APPLICATION_CREDENTIALS_project_id,
              private_key_id: process.env.GOOGLE_APPLICATION_CREDENTIALS_private_key_id,
              private_key: (process.env.GOOGLE_APPLICATION_CREDENTIALS_private_key).replace(/\\n/g,'\n',),
              client_email: process.env.GOOGLE_APPLICATION_CREDENTIALS_client_email,
              client_id: process.env.GOOGLE_APPLICATION_CREDENTIALS_client_id,
              // auth_uri: process.env.GOOGLE_APPLICATION_CREDENTIALS_auth_uri,
              // token_uri: process.env.GOOGLE_APPLICATION_CREDENTIALS_token_uri,
              // auth_provider_x509_cert_url: process.env.GOOGLE_APPLICATION_CREDENTIALS_auth_provider_x509_cert_url,
              // client_x509_cert_url: process.env.GOOGLE_APPLICATION_CREDENTIALS_client_x509_cert_url,
              universe_domain: process.env.GOOGLE_APPLICATION_CREDENTIALS_universe_domain
          }
      })

      const bucketName = 'mmc.nodekidos.com'; //  Google Cloud Storage bucket name
      const bucket = UploadBucket.bucket(bucketName);

  
        const blob = bucket.file(filePath);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });
  
        blobStream.on('error', (err) => {
            reject(err);
        });
  
        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
            resolve(publicUrl);
        });
  
        blobStream.end(file.buffer);
    });

    }

    if(arguments.length==0)
      return null;

    const folderName = "samsons-test";


   const responses = attachment.map((fle)=>Uploadfiles(fle,folderName));
   const Urls = await Promise.all(responses) as any[];



   

    console.log(Urls);
    return Urls;


    // return [
    //   {
    //     id: '883',
    //     original:
    //       'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/881/aatik-tasneem-7omHUGhhmZ0-unsplash%402x.png',
    //     thumbnail:
    //       'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/881/conversions/aatik-tasneem-7omHUGhhmZ0-unsplash%402x-thumbnail.jpg',
    //   },
    // ];
  }
}
