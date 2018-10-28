import { dirname, basename, relative } from 'path';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import chalk from 'chalk';

export default class ImageCompressor {
  public printCompressImagelog = (files: any[], buildFolder) => {
    files.map((file) => {
      const fileAbsName = file.path;
      const fileBasename = basename(fileAbsName);
      const fileDirname = dirname(fileAbsName);
      const folder = relative(buildFolder, fileDirname);

      console.log(
        `➩ ${folder}/${chalk.cyan(fileBasename)}`
      );
    });
  }

  public compress = (images: string | string[], distFolder: string) => {
    if (typeof images === 'string') {
      images = [images];
    }
    images = images.filter((image) => {
      return /\.(png|jpg|git)$/.test(image.split('?')[0]);
    });

    console.log(chalk.green('Optimizing images...\n'));
    return imagemin(images, distFolder, {
        plugins: [
          imageminJpegtran(),
          imageminPngquant({ quality: '65-80' })
        ]
      })
      .then((files) => {
        this.printCompressImagelog(files, distFolder);
        console.log(chalk.green(`\nOptimizing images successfully.\n`));
        return files;
      })
      .catch((err) => {
        console.log(chalk.red(`\nOptimizing image error: \n`), err);
      });
  }
}