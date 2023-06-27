"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import startShapes from "@/utilities/StartShapes";
import type { baseReadData } from "@/app/page";
import ReactPlayer from "react-player/youtube";

export default function RecordInput({
  newRecord,
}: {
  newRecord: (input: baseReadData) => Promise<void>;
}) {
  const labelRef = useRef<HTMLLabelElement>(null!);
  const [showMore, showMoreSet] = useState(false);
  const [usingCustomSett, usingCustomSettSet] = useState(false);

  const allDataInitialValue: baseReadData = {
    id: undefined,
    createdAt: undefined,
    text: "",
    username: "",
    speed: undefined,
    gravity: undefined,
    shapes: undefined,
    colors: undefined,
    angle: undefined,
    audioLink: null,
    ytLinks: null,
    imgLinks: null,
  };

  const [allData, allDataSet] = useState({ ...allDataInitialValue });

  const [singleImageInput, singleImageInputSet] = useState("");
  const [singleYtInput, singleYtInputSet] = useState("");


  function saveImgArr(input: string) {
    if (input.length > 0) {

      allDataSet(prevData => {
        let pastSeenImgArr: string[] = []

        if (prevData.imgLinks) {
          pastSeenImgArr = JSON.parse(prevData.imgLinks!)
        }


        return { ...prevData, imgLinks: JSON.stringify([...pastSeenImgArr, input]) }
      })

      singleImageInputSet("")
    }

  }

  function saveYtArr(input: string) {
    if (input.length > 0) {

      allDataSet(prevData => {
        let pastSeenImgArr: string[] = []

        if (prevData.ytLinks) {
          pastSeenImgArr = JSON.parse(prevData.ytLinks!)
        }


        return { ...prevData, ytLinks: JSON.stringify([...pastSeenImgArr, input]) }
      })

      singleYtInputSet("")
    }

  }

  function submit() {
    //validation test
    const newObj = { ...allData };

    newRecord(newObj);
  }

  const [colorComb, colorCombSet] = useState<(undefined | string)[]>([undefined, undefined]);

  //combine color combination into allData
  useEffect(() => {
    let newColor1 = colorComb[0] ? colorComb[0] : "undefined"
    let newColor2 = colorComb[1] ? colorComb[1] : "undefined";

    let newColor = newColor1 + "|" + newColor2

    allDataSet((prevData) => {
      return { ...prevData, colors: newColor };
    });
  }, [colorComb]);

  function saveUsername(name: string) {
    //write to browser cookies
    localStorage.setItem("loggedInAs", name);
  }
  //get is signed in?
  useEffect(() => {
    const name = localStorage.getItem("loggedInAs");
    if (name) {
      allDataSet((prevData) => {
        return { ...prevData, username: name };
      });
      labelRef.current.innerHTML = `Signed in as ${name}`;
    }
  }, []);

  return (
    <div className={styles.recInputMainDiv}>
      <div className={styles.InputCont}>
        <label ref={labelRef}>Send a message to sign in</label>

        {showMore && (
          <>
            <input
              placeholder="Enter Username "
              onChange={(e) => {
                const name = e.target.value.toLowerCase();

                allDataSet((prevData) => {
                  return { ...prevData, username: name };
                });
              }}
              value={allData.username}
            />


            <label htmlFor="recordText">Text</label>
            <input
              placeholder="anything to say? "
              id="recordText"
              onChange={(e) => {
                const text = e.target.value;
                allDataSet((prevData) => {
                  return { ...prevData, text: text };
                });
              }}
              value={allData.text}
            />


            <label htmlFor="audioLink">Audio Link</label>
            <input
              placeholder="yt links only"
              id="audioLink"
              onChange={(e) => {
                allDataSet((prevData) => {
                  return { ...prevData, audioLink: e.target.value };
                });
              }}
              value={allData.audioLink === null ? "" : allData.audioLink}
            />

            {allData.audioLink &&
              <PreviewAudio input={allData.audioLink} />
            }



            <label htmlFor="ytLink">Youtube Vid</label>
            <input
              placeholder="Something I should watch? "
              id="ytLink"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveYtArr(singleYtInput)
                }
              }}
              onBlur={() => {
                saveYtArr(singleYtInput)
              }}
              onChange={(e) => {
                singleYtInputSet(e.target.value)
              }}
              value={singleYtInput}
            />
            {allData.ytLinks &&

              <div className={styles.prevYtCont}>
                {JSON.parse(allData.ytLinks).map((eachLink: string) => (
                  <PreviewYtVids input={eachLink} />
                ))}
              </div>
            }


            <label htmlFor="imgLink">Images</label>

            <input
              placeholder="Show me something "
              id="imgLink"
              onChange={(e) => {
                singleImageInputSet(e.target.value)
              }}
              value={singleImageInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveImgArr(singleImageInput)
                }
              }}
              onBlur={() => {
                saveImgArr(singleImageInput)
              }}
            />

            {allData.imgLinks &&
              <div className={styles.prevImageCont}>
                {JSON.parse(allData.imgLinks).map((eachLink: string) => (
                  <PreviewImages input={eachLink} />
                ))}
              </div>
            }


          </>
        )}

        <p
          style={{ textAlign: "center" }}
          onClick={() => {
            showMoreSet((prev) => !prev);
          }}
        >
          {!showMore ? "show more" : "show less"}
        </p>


      </div>

      <div style={{ display: showMore ? "grid" : "none" }} className={styles.bttnCont}>
        <label
          style={{
            backgroundColor: usingCustomSett ? "aqua" : "white",
          }}
          className={styles.customButton}
          onClick={() => {
            usingCustomSettSet((prev) => !prev);
          }}
        >
          Customize
        </label>

        {usingCustomSett && (
          <div className={styles.cstmSettings}>
            <label htmlFor="gravAmt">Gravity</label>
            <input
              placeholder="Smaller the stronger"
              id="gravAmt"
              type="number"
              onChange={(e) => {
                allDataSet((prevSettings) => {
                  let newGrav = parseInt(e.target.value);
                  if (isNaN(newGrav)) {
                    newGrav = 0;
                  }

                  if (newGrav > 10000) {
                    return { ...prevSettings };
                  }

                  return { ...prevSettings, gravity: newGrav };
                });
              }}
              value={allData.gravity ? allData.gravity : undefined}
            />

            <label htmlFor="speedAmt">Speed</label>
            <input
              placeholder="Smaller the faster"
              id="speedAmt"
              type="number"
              onChange={(e) => {
                allDataSet((prevSettings) => {
                  let newSpeed = parseInt(e.target.value);
                  if (isNaN(newSpeed)) {
                    newSpeed = 0;
                  }

                  if (newSpeed > 10000) {
                    return { ...prevSettings };
                  }

                  return { ...prevSettings, speed: newSpeed };
                });
              }}
              value={allData.speed ? allData.speed : undefined}
            />

            <label htmlFor="colorName1">Colors - # or name</label>
            <div className={styles.colorInputCont}>
              <input
                placeholder="Enter first Color"
                id="colorName1"
                type="text"
                onChange={(e) => {
                  colorCombSet((prevColorArr) => {
                    prevColorArr[0] = e.target.value;

                    return [...prevColorArr];
                  });
                }}
                value={colorComb[0]}
              />

              <input
                placeholder="Enter second Color"
                id="colorName2"
                type="text"
                onChange={(e) => {
                  colorCombSet((prevColorArr) => {
                    prevColorArr[1] = e.target.value;

                    return [...prevColorArr];
                  });
                }}
                value={colorComb[1]}
              />
            </div>

            <label htmlFor="angleAmt">Angle</label>
            <input
              placeholder="Angle your background"
              id="angleAmt"
              type="number"
              onChange={(e) => {
                allDataSet((prevSettings) => {
                  let newAngle = parseInt(e.target.value);
                  if (isNaN(newAngle)) {
                    newAngle = 0;
                  }

                  if (newAngle > 360) {
                    return { ...prevSettings };
                  }

                  return { ...prevSettings, angle: newAngle };
                });
              }}
              value={allData.angle ? allData.angle : undefined}
            />

            <label htmlFor="shapesName">Shapes</label>
            <input
              placeholder="Enter two Letters A - P"
              id="shapesName"
              type="text"
              onChange={(e) => {
                allDataSet((prevSettings) => {
                  let rawText = e.target.value.toUpperCase();
                  let inRange = false;

                  for (let index = 0; index < startShapes.length; index++) {
                    if (startShapes[index] === rawText[rawText.length - 1]) {
                      inRange = true;
                      break;
                    }
                  }

                  let newText = "";

                  if (inRange) {
                    newText = rawText;
                  }

                  if (newText.length > 2) {
                    return { ...prevSettings };
                  }

                  return { ...prevSettings, shapes: newText };
                });
              }}
              value={allData.shapes ? allData.shapes : undefined}
            />
          </div>
        )}

        <button
          disabled={!allData.text || allData.username.length < 1}
          onClick={() => {
            saveUsername(allData.username);
            submit();
            labelRef.current.innerHTML = `Signed in as ${allData.username}`;
            setTimeout(() => {
              //reset to initial
              allDataSet({
                ...allDataInitialValue,
                username: allData.username,
              });

              colorCombSet([undefined, undefined])
            }, 500);
          }}
        >
          new record
        </button>
      </div>


    </div>
  );
}
function PreviewAudio({ input }: { input: string }) {
  const widthVal = 150
  const aspec = 9 / 16
  const height = widthVal * aspec

  return (
    <ReactPlayer
      width={widthVal}
      height={height}
      playing={true}
      url={input}
    />
  )
}


function PreviewImages({ input }: { input: string }) {
  const widthVal = 150
  const aspec = 9 / 16
  const height = widthVal * aspec


  return (
    <img width={widthVal} height={height} src={input} alt={input} />
  )
}


function PreviewYtVids({ input }: { input: string }) {
  const widthVal = 150
  const aspec = 9 / 16
  const height = widthVal * aspec

  return (
    <ReactPlayer
      width={widthVal}
      height={height}
      playing={false}
      url={input}
    />
  )
}
