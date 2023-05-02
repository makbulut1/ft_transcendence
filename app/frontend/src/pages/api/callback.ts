import { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    // Read the existing data from the JSON file
    console.log(req.query)
  } else if (req.method === 'POST'){
    console.log(req.body)
    res.status(200).json({ message: 'Success' });
  }
}