import Image from "next/image";
import styles from "./page.module.css";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import StyleSquare from "@/Components/homepage/StyleSquare";
import RecordInput from "@/Components/homepage/RecordInput";
import startShapes from "@/utilities/StartShapes";

const prisma = new PrismaClient();

interface baseReadData {
  id: string;
  createdAt: Date;
  username: string;
  speed: number;
  gravity: number;
  shapes: string;
  colors: string;
  angle: number;
  text: string;
  audioLink: string | null;
  ytLinks: string | null;
  imgLinks: string | null;
}

interface baseSendData extends Omit<baseReadData, "id" | "createdAt"> { }

export type { baseReadData, baseSendData };

export default async function Home() {
  let allInfo: baseReadData[] = [];

  try {
    allInfo = await prisma.base.findMany();
  } catch (error) {
    alert("couldnt fetch");
  }

  async function newRecord(input: baseSendData, usingCustomSett: boolean) {
    "use server";

    let newRecordObj = {} as baseSendData;

    if (usingCustomSett) {
      //validation
      const preValidData = { ...input };

      preValidData.speed = preValidData.speed >= 500 ? preValidData.speed : 500;
      preValidData.shapes =
        preValidData.shapes && preValidData.shapes.length > 1
          ? preValidData.shapes
          : "BA";
      preValidData.gravity =
        preValidData.gravity >= 500 ? preValidData.gravity : 500;
      preValidData.angle = preValidData.angle >= 0 ? preValidData.angle : 0;

      newRecordObj = { ...preValidData };
    } else {
      newRecordObj = { ...input, ...mkRndBgData() };
    }

    function mkRndBgData() {
      const colors = [
        "red",
        "blue",
        "yellow",
        "green",
        "purple",
        "orange",
        "pink",
      ];

      const newObj = {
        colors:
          colors[Math.floor(Math.random() * colors.length)] +
          "|" +
          colors[Math.floor(Math.random() * colors.length)],
        speed: Math.floor(Math.random() * 6000) + 500,
        shapes:
          startShapes[Math.floor(Math.random() * startShapes.length)] +
          startShapes[Math.floor(Math.random() * startShapes.length)],
        gravity: Math.floor(Math.random() * 11) * 1000 + 500,
        angle: Math.floor(Math.random() * 361),
      };

      return newObj;
    }

    await prisma.base.create({
      data: newRecordObj,
    });

    revalidatePath("/");
  }

  async function deleteSpecific(input: string) {
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
      <h1>Public Notes</h1>

      <RecordInput newRecord={newRecord} />

      <div className={styles.squareHolder}>
        {allInfo.map((eachRecord) => (
          <StyleSquare
            key={eachRecord.id}
            {...eachRecord}
            deleteSpecific={deleteSpecific}
          />
        ))}
      </div>
    </main>
  );
}
