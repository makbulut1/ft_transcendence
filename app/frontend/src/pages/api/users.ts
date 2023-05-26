import fsPromises from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data/users.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    // Read the existing data from the JSON file
    const jsonData = await fsPromises.readFile(dataFilePath);
    const objectData = JSON.parse(jsonData.toString());

    res.status(200).json(objectData);
  } else if (req.method === 'POST'){
    const jsonWriteData = JSON.stringify(req.body);
    const writeData = await fsPromises.writeFile(dataFilePath, jsonWriteData);
    res.status(200).json({ message: 'Success' });
  }
}
