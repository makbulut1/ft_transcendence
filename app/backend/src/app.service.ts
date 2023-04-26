import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { config } from 'dotenv';


@Injectable()
export class AppService {
  async getHello(query: any): Promise<string> {
    config();
    const authData: any = await axios.post('https://api.intra.42.fr/oauth/token', {
      grant_type: 'authorization_code',
      code : query.code,
      client_id : config().parsed.ClientID,
      client_secret: config().parsed.SecretID,
      redirect_uri : config().parsed.RedirectURL,
    });
    const user = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: {
        Authorization: `Bearer ${authData?.data?.access_token}`,
      },
    });
    return 'Hello World!';
  }
}