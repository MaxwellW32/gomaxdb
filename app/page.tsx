import Image from "next/image";
import styles from "./page.module.css";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import Board from "@/Components/homepage/Board";
import BoardInput from "@/Components/homepage/BoardInput";
import startShapes from "@/utilities/StartShapes";

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

    console.log(input)

    await prisma.base.update({
      where: {
        id: input.id,
      },
      data: input,
    })

    revalidatePath("/");
  }

  async function newBoard(input: baseReadData) {
    "use server";

    //check if each item exists
    //if they dont exist make rnd data for them

    function addRndData(input: baseReadData) {

      const rndData = {
        singleColor: () => {
          // Generate random RGB values
          let r = Math.floor(Math.random() * 256);
          let g = Math.floor(Math.random() * 256);
          let b = Math.floor(Math.random() * 256);

          // Convert RGB to hexadecimal
          let hexR = r.toString(16).padStart(2, '0');
          let hexG = g.toString(16).padStart(2, '0');
          let hexB = b.toString(16).padStart(2, '0');

          // Concatenate hexadecimal values
          let hexColor = '#' + hexR + hexG + hexB;

          return hexColor;
        },
        angle: Math.floor(Math.random() * 361),
        gravity: Math.floor(Math.random() * 11) * 1000,
        shapes: startShapes[Math.floor(Math.random() * startShapes.length)] + startShapes[Math.floor(Math.random() * startShapes.length)],
        speed: Math.floor(Math.random() * 6001)
      }

      const inputCols = input.colors!.split("|")

      if (inputCols[0] === "undefined") {
        inputCols[0] = rndData.singleColor()
      }

      if (inputCols[1] === "undefined") {
        inputCols[1] = rndData.singleColor()
      }

      input.colors = `${inputCols[0]}|${inputCols[1]}`

      //add em together

      if (input.angle === undefined) {
        input.angle = rndData.angle
      }

      if (input.gravity === undefined) {
        input.gravity = rndData.gravity
      }

      if (input.speed === undefined) {
        input.speed = rndData.speed
      }

      if (!input.shapes) {
        input.shapes = rndData.shapes
      }

    }

    addRndData(input)

    await prisma.base.create({
      data: input,
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
