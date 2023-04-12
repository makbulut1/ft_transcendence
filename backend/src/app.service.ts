import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  async getHello(query: any): Promise<string> {
    const authData: any = await axios.post("https://api.intra.42.fr/oauth/token", {
      grant_type: 'authorization_code',
      code : query.code,
      client_id : "u-s4t2ud-c112189c2f1ede5884b8248a776c5305c4cf48c9fcb633c8f357c5eb6f70e779",
      client_secret: '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',
      redirect_uri : "http://64.226.97.1:3000/callback",
    });
    const user = await axios.get('https://api.intra.42.fr/v2/users/ysay', {
      headers: {
        Authorization: `Bearer ${authData?.data?.access_token}`,
      },
    });
    return 'Hello World!';
  }
}