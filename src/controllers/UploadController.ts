import { Controller, Post, UseBefore, Req, Res } from 'routing-controllers';
import busboy from 'connect-busboy';
import chalk from 'chalk';
import { join } from 'path';
import fs from 'fs';
import ImageCompressor from '../utils/ImageCompressor';
import randomString from '../utils/randomString';
import DirArchiver from '../utils/DirArchiver';
const imageCompressor = new ImageCompressor();

const uploadPath = join(process.cwd(), './upload/raw');
const distPath = join(process.cwd(), './upload/compressed');
const zipPath = join(process.cwd(), './upload/zip');

@Controller()
export default class UploadController {

  private randomDirName = () => {
    return `${Date.now()}-${randomString()}`;
  }

  @Post('/upload')
  @UseBefore(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
  }))
  public async uploadFile(@Req() req, @Res() res) {
    if (req.busboy) {
      const busboy = req.busboy;
      req.pipe(req.busboy);
      await new Promise(() => {
        let filesCounter = 0;
        let hasFinish = false;
        const rawFiles: string[] = [];
        const randomDirName = this.randomDirName();
        const rawDir = join(uploadPath, `./${randomDirName}`);
        const compressedDir = join(distPath, `./${randomDirName}`);
        const zipFilePath = join(zipPath, `./compressed_images_${randomDirName}.zip`);
        if (!fs.existsSync(rawDir)) {
          fs.mkdirSync(rawDir);
        }
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
          ++filesCounter;
          console.log(chalk.green('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype));

          file.on('data', (data) => {
            console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
          });
          file.on('end', function () {
            console.log('File [' + fieldname + '] Finished');
          });


          const rawFilePath = join(rawDir, filename);
          rawFiles.push(rawFilePath);
          const fsStream = fs.createWriteStream(rawFilePath);
          file.pipe(fsStream);
          fsStream.on('close', async () => {
            --filesCounter;
            console.log(`Upload of '${filename}' finished`);

            if (hasFinish && filesCounter === 0) {
              await imageCompressor.compress(rawFiles, compressedDir);
              const dirArchiver = new DirArchiver();
              const zipOutput = dirArchiver.archive(compressedDir, zipFilePath);
              zipOutput.on('close', () => {
                res.json({
                  filename: `compressed_images_${randomDirName}.zip`
                });
              });
            }
          });
        });

        busboy.on('finish', () => {
          hasFinish = true;
          console.log(`busboy finish`);
        });
      });
    }
  }
}