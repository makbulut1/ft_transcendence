import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { config } from 'dotenv';


@Injectable()
export class AppService {
  async getHello(query: any): Promise<string> {
    config();
    const authData: any = await axios.post(config().parsed.TokenURL, {
      grant_type: config().parsed.GrantType,
      code : query.code,
      client_id : config().parsed.ClientID,
      client_secret: config().parsed.SecretID,
      redirect_uri : config().parsed.RedirectURL,
    });
    const user = await axios.get(config().parsed.UserMeURL, {
      headers: {
        Authorization: `Bearer ${authData?.data?.access_token}`,
      },
    });
    console.log(user.data.email);
    return 'Hello World!';
  }
}