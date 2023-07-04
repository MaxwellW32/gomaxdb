import Image from "next/image";
import styles from "./page.module.css";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import Board from "@/Components/homepage/Board";
import BoardInput from "@/Components/homepage/BoardInput";
import addRndData from "@/utilities/AddRandomData";
import YoutubeDefaultList from "@/utilities/YoutubeDefaultList";
// import SaveBackupRecords from "@/utilities/SaveBackupRecords";

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

  await prisma.base.create({
    data: addRndData(input),
  });

  revalidatePath("/");

  // if (usingCustomSett) {
  //   //validation
  //   const preValidData = { ...input };

  //   preValidData.speed = preValidData.speed >= 500 ? preValidData.speed : 500;
  //   preValidData.shapes =
  //     preValidData.shapes && preValidData.shapes.length > 1
  //       ? preValidData.shapes
  //       : "BA";
  //   preValidData.gravity =
  //     preValidData.gravity >= 500 ? preValidData.gravity : 500;
  //   preValidData.angle = preValidData.angle >= 0 ? preValidData.angle : 0;

  //   newRecordObj = { ...preValidData };
  // } else {
  //   newRecordObj = { ...input, ...mkRndBgData() };
  // }
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
  const rndStart = 0
  // const rndStart = Math.floor(Math.random() * YoutubeDefaultList.length)

  let arrIndex = 0
  try {
    allInfo = await prisma.base.findMany(
      {
        orderBy: {
          createdAt: 'desc', // Sort by createdAt field in descending order (latest first)
        },
      }
    );

    // SaveBackupRecords(allInfo)

  } catch (error) {
    console.log("couldnt fetch", error);
  }

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
