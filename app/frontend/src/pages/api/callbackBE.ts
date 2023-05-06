import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    // Read the existing data from the JSON file
  } else if (req.method === 'POST'){
    console.log(req.body)
    const authData: any = await axios.post('https://api.intra.42.fr/oauth/token', {
      grant_type: 'authorization_code',
      client_id: 'u-s4t2ud-240411a646735096c38638f3719456168613f906bbd4a1a94fa2a949cf943638',
      client_secret: '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',
      code: req.body.code,
      redirect_uri: 'http://localhost:3000/callback',
    })
    const user = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: {
        Authorization: `Bearer ${authData?.data?.access_token}`,
      },
    })
    const data = {
      id: user?.data?.id,
      token: authData?.data?.access_token,
      fullName: user?.data?.usual_full_name,
      email: user?.data?.email,
      login: user?.data?.login,
    }
    console.log('data', data)
    res.status(200).json(data)
  }
}
