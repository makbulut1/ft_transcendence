import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    // Read the existing data from the JSON file
  } else if (req.method === 'POST'){
    const authData: any = await axios.post('https://api.intra.42.fr/oauth/token', {
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
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
      avatar: user?.data?.image.link,
    }
    res.status(200).json(data)
  }
}
