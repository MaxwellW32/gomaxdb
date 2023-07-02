"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import startShapes from "@/utilities/StartShapes";
import type { baseReadData } from "@/app/page";
import ReactPlayer from "react-player/youtube";

export default function BoardInput({
  newBoard,
}: {
  newBoard: (input: baseReadData) => Promise<void>;
}) {
  const [usingCustomSett, usingCustomSettSet] = useState(false);
  const recordTextTA = useRef<HTMLTextAreaElement>(null!)
  const allDataInitialValue: baseReadData = {
    id: undefined,
    createdAt: undefined,
    text: "",
    username: "",
    speed: undefined,
    gravity: undefined,
    shapes: undefined,
    colors: "",
    angle: undefined,
    audioLink: "",
    ytLinks: "",
    imgLinks: "",
  };

  const [allData, allDataSet] = useState({ ...allDataInitialValue });

  const [singleImageInput, singleImageInputSet] = useState("");
  const [singleYtInput, singleYtInputSet] = useState("");

  const [showInptForm, showInptFormSet] = useState(false)

  function saveImgArr(input: string) {
    if (input) {

      allDataSet(prevData => {
        let pastSeenImgArr: string[] = []

        if (prevData.imgLinks) {
          pastSeenImgArr = JSON.parse(prevData.imgLinks)
        }


        return { ...prevData, imgLinks: JSON.stringify([input, ...pastSeenImgArr]) }
      })

      singleImageInputSet("")
    }

  }

  function saveYtArr(input: string) {
    if (input) {

      allDataSet(prevData => {
        let pastSeenYtArr: string[] = []

        if (prevData.ytLinks) {
          pastSeenYtArr = JSON.parse(prevData.ytLinks!)
        }


        return { ...prevData, ytLinks: JSON.stringify([input, ...pastSeenYtArr]) }
      })

      singleYtInputSet("")
    }

  }

  function submit() {
    //validation test
    const newObj = { ...allData };

    newBoard(newObj);
  }

  const [colorComb, colorCombSet] = useState<string[]>(["", ""]);

  //combine color combination into allData
  useEffect(() => {

    let newColor1 = colorComb[0] ? colorComb[0] : "undefined"
    let newColor2 = colorComb[1] ? colorComb[1] : "undefined";

    let newColor = newColor1 + "|" + newColor2

    allDataSet((prevData) => {
      return { ...prevData, colors: newColor };
    });

  }, [colorComb]);

  console.clear()
  console.log(allData.gravity)

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
    }
  }, []);


  return (
    <div className={styles.mainContDiv}>
      <div
        className={styles.showformbttn}
        onClick={() => {
          showInptFormSet(prev => !prev)
        }}>
        <p>Something to add?</p>

        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M151.6 469.6C145.5 476.2 137 480 128 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L96 365.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V365.7l32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H320c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H320c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H320c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H320c-17.7 0-32-14.3-32-32s14.3-32 32-32z" /></svg>
      </div>

      <div style={{ translate: showInptForm ? "0 0" : "-100% 0" }} className={styles.inputCont}>

        <svg
          onClick={() => {
            showInptFormSet(prev => !prev)
          }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"> <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" /></svg>

        {allData.username.length > 0 ? (
          <h4>Signed in as <span>{allData.username}</span></h4>
        ) : (
          <h4>Send a message to sign in</h4>
        )}

        <label htmlFor="usernameInput">Username</label>
        <input
          id="usernameInput"
          placeholder="Enter Username "
          onChange={(e) => {
            const name = e.target.value;

            allDataSet((prevData) => {
              return { ...prevData, username: name };
            });
          }}
          value={allData.username}
        />


        <label htmlFor="recordText">Text</label>
        <textarea
          ref={recordTextTA}
          id="recordText"
          placeholder="Share a message"
          onChange={(e) => {
            const text = e.target.value;
            allDataSet((prevData) => {
              return { ...prevData, text: text };
            });
          }}
          onInput={() => {
            recordTextTA.current.style.height = 'auto';
            recordTextTA.current.style.height = recordTextTA.current.scrollHeight + 'px';
          }}
          value={allData.text}
        />


        <label htmlFor="audioLink">Audio Link</label>
        <input
          id="audioLink"
          placeholder="Play youtube music"
          onChange={(e) => {
            allDataSet((prevData) => {
              return { ...prevData, audioLink: e.target.value };
            });
          }}
          value={allData.audioLink}
        />

        {allData.audioLink &&
          <div className={styles.prevAudioCont}>
            <svg
              className={styles.previewContCloseBttn}
              onClick={() => {
                allDataSet(prevData => {
                  return { ...prevData, audioLink: allDataInitialValue.audioLink }
                })
              }}
              xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"> <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" /></svg>
            <PreviewAudio input={allData.audioLink} />
          </div>
        }


        <label htmlFor="ytLink">Youtube Vid</label>
        <input
          id="ytLink"
          placeholder="Share videos"
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
            {JSON.parse(allData.ytLinks).map((eachLink: string, index: number) => (
              <div className={styles.prevYtIndivCont}>
                <svg
                  className={styles.previewContCloseBttn}
                  onClick={() => {

                    allDataSet(prevData => {
                      let pastSeenYtArr: string[] = []
                      pastSeenYtArr = JSON.parse(prevData.ytLinks!)

                      let newYtArr = pastSeenYtArr.filter((val, count) => {
                        return count !== index;
                      });
                      return { ...prevData, ytLinks: newYtArr.length > 0 ? JSON.stringify([...newYtArr]) : undefined }
                    })
                  }}
                  xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"> <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" /></svg>

                <PreviewYtVids key={index} input={eachLink} />
              </div>
            ))}
          </div>
        }


        <label htmlFor="imgLink">Images</label>
        <input
          id="imgLink"
          placeholder="Show the world anything"
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
            {JSON.parse(allData.imgLinks).map((eachLink: string, index: number) => (
              <div className={styles.prevImgIndivCont}>
                <svg
                  className={styles.previewContCloseBttn}
                  onClick={() => {

                    allDataSet(prevData => {
                      let pastSeenImgArr: string[] = []
                      pastSeenImgArr = JSON.parse(prevData.imgLinks!)

                      let newImgArr = pastSeenImgArr.filter((val, count) => {
                        return count !== index;
                      });

                      return { ...prevData, imgLinks: newImgArr.length > 0 ? JSON.stringify([...newImgArr]) : undefined }
                    })
                  }}
                  xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"> <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" /></svg>



                <PreviewImages key={index} input={eachLink} />
              </div>
            ))}
          </div>
        }

        <div className={styles.bttnHolder}>
          <button
            style={{
              backgroundColor: usingCustomSett ? "#002755" : "#0027559e",
              opacity: usingCustomSett ? "1" : ".4",
            }}
            className="mainBttn"
            onClick={() => {
              usingCustomSettSet((prev) => !prev);
            }}
          >
            Board Customization
          </button>

          <button
            className="mainBttn"
            disabled={!allData.text || allData.username.length < 1}
            style={{ filter: allData.text && allData.username.length > 0 ? "brightness(100%)" : "brightness(40%)" }}
            onClick={() => {
              saveUsername(allData.username);
              submit();
              setTimeout(() => {
                //reset to initial
                allDataSet((prevData => {
                  return { ...allDataInitialValue, username: prevData.username }
                }));

                colorCombSet(["", ""])

              }, 500);
              showInptFormSet(prev => !prev)
              usingCustomSettSet(false)
            }}
          >
            Post
          </button>
        </div>

        {usingCustomSett && (
          <div className={styles.cstmSettings}>
            <label htmlFor="gravAmt">Gravity</label>
            <input
              id="gravAmt"
              placeholder="Smaller the stronger"
              type="number"
              onChange={(e) => {
                allDataSet((prevSettings) => {
                  let newGrav: number | undefined = parseInt(e.target.value);
                  if (isNaN(newGrav)) {
                    newGrav = undefined;
                  }

                  if (newGrav! > 10000) {
                    return { ...prevSettings };
                  }

                  return { ...prevSettings, gravity: newGrav };
                });
              }}
              value={allData.gravity}
            />

            <label htmlFor="speedAmt">Speed</label>
            <input
              id="speedAmt"
              placeholder="Smaller the faster"
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

            <label htmlFor="colorName1">Colors - #Hex or Name</label>
            <div className={styles.colorInputCont}>
              <input
                id="colorName1"
                placeholder="Enter first Color"
                type="text"
                style={{ borderRight: allData.colors && allData.colors!.split("|")[0] !== "undefined" ? `10px solid ${allData.colors!.split("|")[0]}` : "none" }}
                onChange={(e) => {
                  colorCombSet((prevColorArr) => {
                    prevColorArr[0] = e.target.value;

                    return [...prevColorArr];
                  });
                }}
                value={colorComb[0]}
              />

              <input
                id="colorName2"
                placeholder="Enter second Color"
                type="text"
                style={{ borderRight: allData.colors && allData.colors!.split("|")[1] !== "undefined" ? `10px solid ${allData.colors!.split("|")[1]}` : "none" }}
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
            <div className={styles.angleColCont}>
              <div className={styles.showAngleColor} style={{

                background: `linear-gradient(${allData.angle}deg, 
                  
                ${allData.colors && allData.colors!.split("|")[0] !== "undefined" ? allData.colors!.split("|")[0] : "transparent"}, 
              
                ${allData.colors && allData.colors!.split("|")[1] !== "undefined" ? allData.colors!.split("|")[1] : "transparent"})`,

                transition: "all 2s"
              }}></div>
              <input
                id="angleAmt"
                placeholder="Angle your background"
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
            </div>

            <label htmlFor="shapesName">Shapes</label>
            <input
              id="shapesName"
              placeholder="Enter two Letters A - Z"
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

      </div >

    </div>

  );
}


function PreviewAudio({ input }: { input: string }) {
  const widthVal = 100
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
