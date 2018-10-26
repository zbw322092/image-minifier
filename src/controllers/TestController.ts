import { Controller, Get } from 'routing-controllers';

@Controller()
export default class TestController {

  @Get('/test')
  public post() {
    return {
      code: '0000',
      message: 'success',
      data: {}
    };
  }
}