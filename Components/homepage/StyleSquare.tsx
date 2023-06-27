"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import useShapesLookup, { shapesLookup } from "@/utilities/ShapesLookup";
import startShapes from "@/utilities/StartShapes";
import ReactPlayer from "react-player/youtube";
import type { baseReadData } from "@/app/page";

export default function StyleSquare({
  id,
  speed,
  gravity,
  shapes,
  colors,
  angle,
  text,
  username,
  audioLink,
  imgLinks,
  ytLinks,
  deleteSpecific,
}: baseReadData & { deleteSpecific: (input: string) => void }) {
  const seenColors = colors!.split("|");
  const mainBoxRef = useRef<HTMLDivElement>(null!);
  const ball = useRef<HTMLDivElement>(null!);

  const [position, setPosition] = useState(0);
  const ballAnimTime = speed;

  const [seenImgLinks, seenImgLinksSet] = useState<string[] | undefined>(() => {
    if (imgLinks!.length > 0) {
      return JSON.parse(imgLinks!)
    } else {
      return undefined
    }
  })

  const [seenYtLinks, seenYtLinksSet] = useState<string[] | undefined>(() => {
    if (ytLinks!.length > 0) {
      return JSON.parse(ytLinks!)
    } else {
      return undefined
    }
  })



  //animate ball
  useEffect(() => {
    let atStart = true;

    const animationId = setInterval(() => {
      if (atStart) {
        setPosition(mainBoxRef.current.offsetWidth - ball.current.offsetWidth);
      } else {
        setPosition(0);
      }

      atStart = !atStart;
    }, ballAnimTime);

    return () => clearInterval(animationId);
  }, []);

  const [amountOfDroplets, amountOfDropletsSet] = useState<number[]>([]);

  //parse shapes
  useEffect(() => {
    const firstLetter = shapes![0];

    let counter = 0;

    for (counter; counter < startShapes.length; counter++) {
      if (firstLetter === startShapes[counter]) {
        break;
      }
    }

    counter++;

    const newArr: number[] = [];
    for (let index = 0; index < counter; index++) {
      newArr.push(index);
    }

    amountOfDropletsSet(newArr);
  }, []);

  const [parentBoxHeight, parentBoxHeightSet] = useState(0);

  useEffect(() => {
    parentBoxHeightSet(mainBoxRef.current.offsetHeight);
  }, []);

  const [currentText, currentTextSet] = useState("");

  const [mouseHovering, mouseHoveringSet] = useState(false);

  const [latestSignInAs, latestSignInAsSet] = useState("");

  //latest sign in on mouse hover
  useEffect(() => {
    if (mouseHovering) {
      latestSignInAsSet(() => {
        let nameSeen = localStorage.getItem("loggedInAs");
        if (!nameSeen) {
          nameSeen = "";
        }

        return nameSeen;
      });
    }
  }, [mouseHovering]);

  const adminSignin = latestSignInAs === "admin";
  const canClick = username !== latestSignInAs || latestSignInAs.length < 1;
  const shouldDisa = adminSignin ? false : canClick;

  //display stats
  useEffect(() => {
    const newArr = [
      `speed: ${speed}`,
      `gravity: ${gravity}`,
      `shapes: ${shapes}`,
      `backgroundColors: ${seenColors[0]} + ${seenColors[1]}`,
      `color rotation: ${angle}`,
    ];

    let arrPos = 0;

    let myInterv: NodeJS.Timer;

    if (mouseHovering && adminSignin) {
      myInterv = setInterval(() => {
        currentTextSet(newArr[arrPos]);
        arrPos++;
        if (arrPos > newArr.length - 1) {
          arrPos = 0;
        }
      }, 1000);
    }

    return () => {
      currentTextSet("");

      return clearInterval(myInterv);
    };
  }, [mouseHovering, adminSignin]);

  const [mouseClicked, mouseClickedSet] = useState(false);
  return (
    <div
      onMouseEnter={() => mouseHoveringSet(true)}
      onMouseLeave={() => mouseHoveringSet(false)}
      onClick={() => mouseClickedSet((prev) => !prev)}
      style={{
        background: `linear-gradient(${angle}deg, ${seenColors[0]}, ${seenColors[1]})`,
      }}
      className={styles.mainBox}
      ref={mainBoxRef}
    >
      <button
        className={styles.deleteButton}
        style={{
          display: !shouldDisa ? "block" : "none",
          opacity: mouseHovering ? "1" : "0",
        }}
        onClick={(e) => {
          e.stopPropagation()
          deleteSpecific(id!);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
        >
          <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
        </svg>
      </button>

      <div
        style={{ pointerEvents: "none", display: "none" }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ReactPlayer
          loop={true}
          playing={mouseClicked}
          url={
            audioLink!.length > 0
              ? audioLink
              : "https://www.youtube.com/watch?v=l9LNIUNa7x4&ab_channel=Tatsumi"
          }
        />
      </div>

      <div
        style={{
          translate: `${position}px`,
          transition: `translate ${ballAnimTime}ms`,
        }}
        className={styles.ball}
        ref={ball}
      ></div>

      {amountOfDroplets.map((eachItem) => (
        <Droplet
          key={eachItem}
          gravity={gravity!}
          shapes={shapes!}
          parentHeight={parentBoxHeight}
        />
      ))}

      <div className={styles.contentCont}>

        <div className={styles.textCont}>
          <p className={styles.squareText}>{text}</p>

          <p className={styles.displayName}>
            {username} {username.length > 0 ? "-" : ""}
          </p>

          <p
            style={{ display: mouseHovering && adminSignin ? "block" : "none" }}
            className={styles.squareTextStats}
          >
            {currentText}
          </p>
        </div>

        {seenImgLinks && <>
          {seenImgLinks.map((eachLink, index) => (
            <img key={index} src={eachLink} />
          ))}
        </>}


        {seenYtLinks && <>
          {seenYtLinks.map((eachLink, index) => (
            <ReactPlayer
              key={index}
              playing={false}
              url={eachLink}
            />
          ))}
        </>}

      </div>



    </div>
  );
}

function Droplet({
  gravity,
  shapes,
  parentHeight,
}: {
  gravity: number;
  shapes: string;
  parentHeight: number;
}) {
  const [rndX, rndXSet] = useState(Math.random() * 101);
  const [rndShapeSelect] = useState(Math.floor(Math.random() * 2));

  const dropletRef = useRef<HTMLDivElement>(null!);

  const {
    width: seenWidth,
    rotation: seenRotation,
    url,
  } = useShapesLookup(shapes[rndShapeSelect]);

  const [initialYPos] = useState(0 - seenWidth);
  const [yPos, setYPos] = useState(initialYPos);

  const [initialTransitionVal] = useState(
    gravity - Math.floor(Math.random() * 251)
  );
  const [transitionVal, setTransitionVal] = useState(initialTransitionVal);

  useEffect(() => {
    let atBottom = false;
    const rndTimer = Math.floor(Math.random() * 3001) + 200;

    setTimeout(() => {
      const fallInterval = setInterval(() => {
        if (!atBottom) {
          setTransitionVal(initialTransitionVal);
          setYPos(parentHeight);
        } else {
          setTransitionVal(0);
          setYPos(initialYPos);
          rndXSet(Math.random() * 101);
        }

        atBottom = !atBottom;
      }, transitionVal);
    }, rndTimer);
  }, []);

  return (
    <div
      style={{
        left: `${rndX}%`,
        translate: `0 ${yPos}px`,
        transition: `translate ${transitionVal}ms linear`,
        width: `${seenWidth}px`,
        rotate: `${seenRotation}deg`,
      }}
      className={styles.droplet}
      ref={dropletRef}
    >
      {shapes[rndShapeSelect]}
    </div>
  );
}


