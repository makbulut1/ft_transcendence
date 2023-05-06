import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  async callback(code: string): Promise<any> {
    try {
      console.log('code', code)
      const authData: any = await axios.post('https://api.intra.42.fr/oauth/token', {
        grant_type: 'authorization_code',
        client_id: 'u-s4t2ud-240411a646735096c38638f3719456168613f906bbd4a1a94fa2a949cf943638',
        client_secret: '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',
        code: code,
        redirect_uri: 'http://localhost:3000/callback',
      })
      console.log('authData', authData)
      const user = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${authData?.data?.access_token}`,
        },
      })
      console.log('user', user)
      const returnUser = {
        id: user?.data?.id,
        token: authData?.data?.access_token,
        fullName: user?.data?.usual_full_name,
        email: user?.data?.email,
        login: user?.data?.login,
      }
      console.log('returnUser', returnUser)
      return returnUser;
    }
    catch (e) {
      console.log(e)
      return e;
    }
  }
}
