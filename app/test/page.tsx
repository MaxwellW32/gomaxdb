"use client"

import { useState } from "react"

export default function Test() {
    const music = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t"]
    const rndStart = 0
    // const rndStart = Math.floor(Math.random() * music.length)
    return (
        <div>

            {rndStart}
            <br />
            {music.length}

            {music.map((eachLetter, index) => {

                const arrIndexToSend = rndStart + index
                //choose a random index in the array
                //5 % 10 = 0
                // use the map index of each element to go from that random point - ensures no duplicates
                // if that number is greater than the amount of things in the array, wrap back around
                //ensure there are enough songs for notes
                //index only increments if default song seen


                return (
                    <>
                        <br />
                        <br />
                        <br />
                        {arrIndexToSend}
                        <MusicPlayer arrPointSeen={music[arrIndexToSend % music.length]} />
                    </>)
            })}

        </div>
    )
}


function MusicPlayer({ arrPointSeen }: { arrPointSeen: string }) {

    return (
        <>
            <p>Seeing {arrPointSeen}</p>
        </>
    )

}