import { Controller, Post, Res, UseBefore, Req } from 'routing-controllers';
import busboy from 'connect-busboy';
import chalk from 'chalk';

@Controller()
export default class UploadController {

  @Post('/upload')
  @UseBefore(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
  }))
  public async uploadFile(@Req() req, @Res() res) {
    if (req.busboy) {
      const busboy = req.busboy;
      req.pipe(req.busboy);
      await new Promise(() => {
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
          console.log(chalk.green('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype));
  
          file.on('data', (data) => {
            console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
          });
          file.on('end', function () {
            console.log('File [' + fieldname + '] Finished');
          });
        });
  
        busboy.on('finish', () => {
          return res.json({
            code: '0000',
            message: 'success',
            data: {}
          });
        });
      });
      return res;
    }
  }
}