import fs from 'fs';
import type { baseReadData } from "@/app/page";

export default function SaveBackupRecords(allRecords: baseReadData) {

    const newDate = new Date
    

  const fileName = `BackupBoardsRecordNew.ts`;
  const fileContent = `
  const oldRecords = ${JSON.stringify(allRecords)} 
  
  export default oldRecords
  `;

  

  try {
      fs.writeFileSync(fileName, fileContent, 'utf-8');
      console.log(`working making file`);
  } catch (error) {
    console.error(`Error writing to '${fileName}':`, error);
  }
}

// async function restoreOldRecords() {

//     const oldRecArr = MeanSomething

//     oldRecArr.map(async (eachObj) => {

//       await prisma.base.create({
//         data: eachObj,
//       });
//     })

//   }

//   // restoreOldRecords()