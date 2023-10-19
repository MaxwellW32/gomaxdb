import Image from "next/image";
import styles from "./page.module.css";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import Board from "@/Components/homepage/Board";
import BoardInput from "@/Components/homepage/BoardInput";
import addRndData from "@/utilities/AddRandomData";
import YoutubeDefaultList from "@/utilities/YoutubeDefaultList";
// import SaveBackupRecords from "@/utilities/SaveBackupRecords";
import boardStorageData from "../boardStorageBackup.json"
import { v4 as uuidv4 } from 'uuid';



const prisma = new PrismaClient();

interface baseReadData {
  username: string;
  text: string;

  id: string | undefined;
  createdAt: Date | undefined;
  speed: number | undefined;
  gravity: number | undefined;
  shapes: string | undefined;
  colors: string | undefined;
  angle: number | undefined;

  audioLink: string | undefined;
  ytLinks: string | undefined;
  imgLinks: string | undefined;
  canBeDeleted: boolean | undefined
}


export type { baseReadData };

async function saveToBackup(boardArr: baseReadData | baseReadData[]) {
  "use server"

  const fs = require('fs');

  let jsonString = ""

  if (Array.isArray(boardArr)) {
    jsonString = JSON.stringify(boardArr);
  } else {
    jsonString = JSON.stringify([boardArr]);
  }


  if (jsonString.length < 1) {
    return
  }

  fs.writeFile('boardStorageBackup.json', jsonString, 'utf8', (err: Error) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('File written successfully');
  });

}


async function readBoards() {
  "use server";

  let newArr = []

  try {
    newArr = await prisma.base.findMany(
      {
        orderBy: {
          createdAt: 'desc', // Sort by createdAt field in descending order (latest first)
        },
      }
    );

    // SaveBackupRecords(allInfo)
    return newArr

  } catch (error) {
    console.log("couldnt fetch", error);
  }



}

async function updateBoard(inputObj: baseReadData) {
  "use server";

  const validateOldObj = await prisma.base.findUnique({
    where: { id: inputObj.id },
  });

  if (!validateOldObj) {
    console.log(`couldnt even validate the oldObj for security`)
    return
  }

  //push all the latest updates

  if (validateOldObj.canBeDeleted) {
    const newInputObj = addRndData(inputObj)

    await prisma.base.update({
      where: {
        id: validateOldObj.id,
      },
      data: newInputObj,
    })

    revalidatePath("/");
  } else {
    //only take updated background info
    const oldObjInfo = { ...validateOldObj }
    const newInputObj = addRndData(inputObj)

    oldObjInfo.speed = newInputObj.speed!
    oldObjInfo.gravity = newInputObj.gravity!
    oldObjInfo.colors = newInputObj.colors!
    oldObjInfo.shapes = newInputObj.shapes!
    oldObjInfo.angle = newInputObj.angle!

    //take original info
    //update - grav, speed, colors, shapes, angle from user input 

    await prisma.base.update({
      where: {
        id: validateOldObj.id,
      },
      data: oldObjInfo,
    })

    revalidatePath("/");

  }

}

async function newBoard(input: baseReadData) {
  "use server";

  const newBoard = addRndData(input)

  await prisma.base.create({
    data: newBoard
  })

  revalidatePath("/")
}

async function deleteBoard(input: string) {
  "use server";

  const validateOldObj = await prisma.base.findUnique({
    where: { id: input },
  });

  if (!validateOldObj) {
    console.log(`couldnt even validate the oldObj for security`)
    return
  }

  if (validateOldObj.canBeDeleted) {
    const seenId = validateOldObj.id;

    await prisma.base.delete({
      where: { id: seenId },
    });
    console.log(`deleted specific ${seenId}`);
    revalidatePath("/");
  } else {
    console.log(`Cannot delete ${validateOldObj.username}, this person is special to me ${validateOldObj.text.substring(0, 20)}`)
  }
}


export default async function Home() {
  let allInfo: baseReadData[] = [];

  const rndStart = Math.floor(Math.random() * YoutubeDefaultList.length)
  let arrIndex = 0

  //read normally from db 
  allInfo = await readBoards() as unknown as baseReadData[]

  //donwload db and save to json
  // if (allInfo) saveToBackup(allInfo)

  //when editing use lcoal data
  // allInfo = boardStorageData as unknown as baseReadData[]

  if (!allInfo) return "not yet found";

  return (
    <main className={styles.mainDiv}>
      <h1>Community Board</h1>

      <BoardInput newBoard={newBoard}
        updateBoard={updateBoard}
      />


      <div className={styles.BoardsHolder}>

        {allInfo.map((eachBoard) => {

          const arrIndexToSend = rndStart + arrIndex
          const canSendDefaultAudio = !eachBoard.audioLink
          if (!eachBoard.audioLink) {
            arrIndex++
          }

          return (
            <Board
              key={eachBoard.id}
              {...eachBoard}
              deleteBoard={deleteBoard}
              defaultMusic={canSendDefaultAudio ? YoutubeDefaultList[arrIndexToSend % YoutubeDefaultList.length] : ""}
            />
          )
        })}
      </div>

    </main>
  );
}
