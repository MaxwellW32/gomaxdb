"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import useShapesLookup, { shapesLookup } from "@/utilities/ShapesLookup";
import startShapes from "@/utilities/StartShapes";
import ReactPlayer from "react-player/youtube";
import type { baseReadData } from "@/app/page";
import Moment from 'react-moment';
import YoutubeDefaultList from "@/utilities/YoutubeDefaultList";
import { useAtom } from "jotai/react";
import { noteSelected } from "@/utilities/GlobalState";

export default function Board({
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
  createdAt,
  deleteBoard: deleteBoard,
}: baseReadData &
  { deleteBoard: (input: string) => void }) {
  const seenColors = colors!.split("|");
  const mainBoxRef = useRef<HTMLDivElement>(null!);
  const ball = useRef<HTMLDivElement>(null!);

  const [position, setPosition] = useState(0);
  gravity! += 500
  speed! += 500
  const ballAnimTime = speed!;

  const [seenImgLinks, seenImgLinksSet] = useState<string[] | undefined>(() => {
    if (imgLinks) {
      return JSON.parse(imgLinks)
    } else {
      return undefined
    }
  })

  const [seenYtLinks, seenYtLinksSet] = useState<string[] | undefined>(() => {
    if (ytLinks) {
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

  const [statsText, statsTextSet] = useState("");

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
  const canClick = username !== latestSignInAs || !latestSignInAs.length;
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
        statsTextSet(newArr[arrPos]);
        arrPos++;
        if (arrPos > newArr.length - 1) {
          arrPos = 0;
        }
      }, 1000);
    }

    return () => {
      statsTextSet("");

      return clearInterval(myInterv);
    };
  }, [mouseHovering, adminSignin]);

  const [defaultAudio,] = useState<string>(() => {
    return YoutubeDefaultList[Math.floor(Math.random() * YoutubeDefaultList.length)]
  })
  const [mouseClicked, mouseClickedSet] = useState(false);

  const [activeNoteSelected, activeNoteSelectedSet] = useAtom(noteSelected)

  function sendBoardForEdit() {

    let newObj: baseReadData = {
      id: id,
      speed: speed,
      gravity: gravity,
      shapes: shapes,
      colors: colors,
      angle: angle,
      text: text,
      username: username,
      audioLink: audioLink,
      imgLinks: imgLinks,
      ytLinks: ytLinks,
      createdAt: createdAt
    }

    activeNoteSelectedSet(newObj)
  }

  return (
    <div
      onMouseEnter={() => mouseHoveringSet(true)}
      onMouseLeave={() => mouseHoveringSet(false)}
      onClick={() => {

        mouseClickedSet((prev) => !prev)
      }}
      style={{
        background: `linear-gradient(${angle}deg, ${seenColors[0]}, ${seenColors[1]})`,
        transition: "all 2s"
      }}
      className={styles.mainBox}
      ref={mainBoxRef}
    >

      <div
        style={{
          display: !shouldDisa ? "block" : "none",
          opacity: mouseHovering ? "1" : "0",
        }}
        className={styles.notesSettingsCont}>

        <svg
          className={styles.editButton}
          onClick={(e) => {
            e.stopPropagation()
            sendBoardForEdit();
          }}
          xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" /></svg>

        <svg
          className={styles.deleteButton}

          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
          onClick={(e) => {
            e.stopPropagation()
            deleteBoard(id!);
          }}
        >
          <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
        </svg>

      </div>


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
            audioLink
              ? audioLink
              : defaultAudio
          }
        />
      </div>

      <div
        style={{
          translate: `${position}px -50%`,
          transition: `translate ${ballAnimTime}ms, scale 10s`,
          scale: mouseClicked ? 4 : audioLink ? 2 : 1,
          top: "50%",
          backgroundColor: mouseClicked ? `blue` : audioLink ? "#ffa200" : "black",
          animation: mouseClicked ? `colorShow 4s infinite linear` : `none`
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
          musicPlaying={mouseClicked}
        />
      ))}

      <div className={styles.contentCont}>



        <div className={styles.textCont}>
          <p className={styles.squareText}>{text}</p>

          <p className={styles.displayName}>{username} -{" "}

            <Moment fromNow>{createdAt}</Moment>
          </p>

          <p
            style={{ display: mouseHovering && adminSignin ? "block" : "none" }}
            className={styles.squareTextStats}
          >
            {statsText}
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
  musicPlaying
}: {
  gravity: number;
  shapes: string;
  parentHeight: number;
  musicPlaying: boolean
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
        filter: musicPlaying ? `invert(100%)` : `none`
      }}
      className={styles.droplet}
      ref={dropletRef}
    >
      {shapes[rndShapeSelect]}
    </div>
  );
}


