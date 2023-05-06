import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AppService } from './app.service';
import axios from "axios";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post("callback")
  async callback(@Body() body: any): Promise<any> {
    console.log(body);
  try{  const authData: any = await axios.post('https://api.intra.42.fr/oauth/token', {
      grant_type: 'authorization_code',
      client_id: "u-s4t2ud-2bfb79667cee369f84ff6967104ee61277be6f58cedeb832183a259967e47f11",
      client_secret: "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",
      code: body.code,
      redirect_uri: "http://localhost:3000/callback",
    })
    console.log('authData', authData)}
    catch(e){
      console.log(e)
    }
    return "authData";
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