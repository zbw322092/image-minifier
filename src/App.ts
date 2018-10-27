import express, { Application } from 'express';
import { useExpressServer } from 'routing-controllers';
import chalk from 'chalk';
import compression from 'compression';
import { join } from 'path';

const ENV = process.env;

export default class App {

  private createApp (): Application {
    const app = express();

    const publicPath = join(process.cwd(), './public');
    app.use('/', compression(), express.static(publicPath));

    useExpressServer(app, {
      routePrefix: '/api',
      controllers: [__dirname + "/controllers/*.ts"]
    });
    return app;
  }

  public async start() {
    console.log('starting node server...');
    const host = process.env.NODE_ENV === 'dev' ? 'localhost' : (ENV.HOST || 'localhost');
    let port = Number(ENV.PORT) || 9988;

    const app = this.createApp();

    app.listen(port, host, (err) => {
      if (err) { return console.log(err); }

      console.log(chalk.cyan.bold(`Server is listening on port ${port}`));
    });
  }
}