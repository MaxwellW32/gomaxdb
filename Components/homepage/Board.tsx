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
  canBeDeleted,
  deleteBoard,
}: baseReadData &
  { deleteBoard: (input: string) => void }) {
  const seenColors = colors!.split("|");
  const mainBoxRef = useRef<HTMLDivElement>(null!);


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

  const [parentBoxHeightWidth, parentBoxHeightWidthSet] = useState<number[]>([]);

  useEffect(() => {
    parentBoxHeightWidthSet([mainBoxRef.current.offsetHeight, mainBoxRef.current.offsetWidth]);
  }, []);

  const [statsText, statsTextSet] = useState("");

  const [mouseHovering, mouseHoveringSet] = useState(false);

  const [latestSignInAs, latestSignInAsSet] = useState("");

  const [userTriedToDelete, userTriedToDeleteSet] = useState(false)

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
    let myInterv: NodeJS.Timer;

    if (mouseHovering && adminSignin) {

      let fullObj: { [key: string]: any } = { id, speed, gravity, shapes, colors, angle, createdAt, canBeDeleted }

      const newArr: string[] = [];

      for (const key in fullObj) {
        newArr.push(`${key}: ${fullObj[key]}`)
      }

      let arrPos = 0;

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

  const [, activeNoteSelectedSet] = useAtom(noteSelected)

  const [moreSettingsClicked, moreSettingsClickedSet] = useState(false)
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
      createdAt: createdAt,
      canBeDeleted: canBeDeleted
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

      <div className={styles.moreSettingsCont}
        style={{ backgroundColor: moreSettingsClicked ? "#111111e6" : "transparent", display: shouldDisa ? "none" : "flex", opacity: mouseHovering ? "1" : "0", }}
        onClick={(e) => {
          e.stopPropagation()
        }}

      >

        <ul
          className={styles.notesSettingsCont}
          style={{ display: moreSettingsClicked ? "flex" : "none" }}

        >
          <li
            onClick={(e) => {
              e.stopPropagation()
              moreSettingsClickedSet(false)
              sendBoardForEdit();
            }}
          >
            <svg
              className={styles.editButton}

              xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" /></svg>
            <p>Edit</p>


          </li>
          <li
            onClick={(e) => {
              e.stopPropagation()
              if (canBeDeleted) {
                userTriedToDeleteSet(true)
              } else {
                alert("Immortal Board Sorry")
              }
              moreSettingsClickedSet(false)

            }}
          >
            <svg
              className={styles.deleteButton}

              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"

            >
              <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
            </svg>
            <p>Delete</p>
          </li>

        </ul>

        <svg
          style={{ fill: moreSettingsClicked ? "#fff" : "#000" }}

          onClick={() => {
            moreSettingsClickedSet(prev => !prev)
          }}
          xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" /></svg>
      </div>
      <div className={styles.deleteConfirmation}
        style={{
          display: userTriedToDelete ? "flex" : "none",
          background: `linear-gradient(${angle! * -1}deg, ${seenColors[0]}, ${seenColors[1]})`,
          "--customColor1": seenColors[0],
          "--customColor2": seenColors[1],
        } as React.CSSProperties}>

        <p>Are you sure you want to delete this Board?</p>
        <div>
          <button
            className="mainBttn"
            onClick={(e) => {
              deleteBoard(id!);
              userTriedToDeleteSet(false)
              e.stopPropagation()

            }}
          >yes</button>
          <button
            className="mainBttn"
            onClick={(e) => {
              userTriedToDeleteSet(false)
              e.stopPropagation()
            }}
          >no</button>
        </div>
        <div className={styles.displayDeleteTextCont}>
          <p>Created by {username} - {" "}
            <Moment fromNow>{createdAt}</Moment>
          </p>
          content seen:
          <p>{text}</p>


        </div>
      </div>

      {/* audio */}
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

      <Ball speed={speed!} mouseClicked={mouseClicked} audioLink={audioLink!}
        parentWidth={parentBoxHeightWidth[1]}
      />

      {amountOfDroplets.map((eachItem, index) => (
        <Droplet
          key={eachItem}
          gravity={gravity!}
          shapes={shapes!}
          parentHeight={parentBoxHeightWidth[0]}
          musicPlaying={mouseClicked}
          dropletNumber={index + 1}
          totalDropletNumber={amountOfDroplets.length}
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
  musicPlaying,
  dropletNumber,
  totalDropletNumber,
}: {
  gravity: number,
  shapes: string,
  parentHeight: number,
  musicPlaying: boolean,
  dropletNumber: number,
  totalDropletNumber: number
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

  const [initialTransitionVal] = useState((gravity + 500) - Math.floor(Math.random() * 251));
  const [transitionVal, setTransitionVal] = useState(initialTransitionVal);

  useEffect(() => {
    let atBottom = false;
    const rndTimer = ((gravity + 500) / totalDropletNumber * dropletNumber) - Math.floor(Math.random() * 251)

    setTimeout(() => {

      setTransitionVal(initialTransitionVal);
      setYPos(parentHeight);
      atBottom = true

      const fallInterval = setInterval(() => {
        if (!atBottom) {
          //at top
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


function Ball({ speed, mouseClicked, audioLink, parentWidth }: { speed: number, mouseClicked: boolean, audioLink: string, parentWidth: number }) {
  const ball = useRef<HTMLDivElement>(null!);

  const [position, setPosition] = useState(0);

  const ballAnimTime = speed! + 500;

  //animate ball
  useEffect(() => {
    let atStart = true;

    const animationId = setInterval(() => {
      if (atStart) {
        setPosition(parentWidth - ball.current.offsetWidth);
      } else {
        setPosition(0);
      }

      atStart = !atStart;
    }, ballAnimTime);

    return () => clearInterval(animationId);
  }, [parentWidth]);

  return (
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
  )
}

