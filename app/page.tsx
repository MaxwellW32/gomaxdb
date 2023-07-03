import Image from "next/image";
import styles from "./page.module.css";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import Board from "@/Components/homepage/Board";
import BoardInput from "@/Components/homepage/BoardInput";
import addRndData from "@/utilities/AddRandomData";

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
}


export type { baseReadData };

export default async function Home() {
  let allInfo: baseReadData[] = [];

  try {
    allInfo = await prisma.base.findMany(
      {
        orderBy: {
          createdAt: 'desc', // Sort by createdAt field in descending order (latest first)
        },
      }
    );

  } catch (error) {
    console.log("couldnt fetch", error);
  }

  async function updateBoard(input: baseReadData) {
    "use server";

    await prisma.base.update({
      where: {
        id: input.id,
      },
      data: addRndData(input),
    })

    revalidatePath("/");
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

    const seenId = input;

    await prisma.base.delete({
      where: { id: seenId },
    });
    console.log(`deleted specific ${seenId}`);
    revalidatePath("/");
  }

  if (!allInfo) return "not yet found";

  return (
    <main className={styles.mainDiv}>
      <h1>Community Board</h1>

      <BoardInput newBoard={newBoard}
        updateBoard={updateBoard}
      />


      <div className={styles.BoardsHolder}>
        {allInfo.map((eachBoard) => (
          <Board
            key={eachBoard.id}
            {...eachBoard}
            deleteBoard={deleteBoard}
          />
        ))}
      </div>

    </main>
  );
}
