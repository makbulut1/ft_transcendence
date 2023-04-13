import { Controller, Get, Query } from "@nestjs/common";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('callback')
  getHello(@Query() query : any): Promise<string> {
    return this.appService.getHello(query);
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  @Get('helloWorld')
  async helloWorld(@Query('id') id: string): Promise<string> {
  await this.sleep(1000);
  return `Hello World ${id}`
  }
}