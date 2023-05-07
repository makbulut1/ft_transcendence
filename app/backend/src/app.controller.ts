import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AppService } from './app.service';
import axios from "axios";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post("callback")
  async callback(@Body() body: any): Promise<any> {
    return this.appService.callback(body);
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