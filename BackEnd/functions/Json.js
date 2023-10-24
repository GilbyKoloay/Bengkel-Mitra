import fs from 'fs';
import path from 'path';



export default function Json(pathToJson, dataToWrite=null) {
  const filePath = path.join(process.cwd(), `/database/${pathToJson}.json`);

  if (!dataToWrite) {
    const data = JSON.parse(fs.readFileSync(filePath));
    return data;
  }
  else {
    fs.writeFileSync(filePath, JSON.stringify(dataToWrite));
  }
};
