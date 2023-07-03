import type { baseReadData } from "@/app/page";
import startShapes from "@/utilities/StartShapes";

export default function addRndData(inputBefore: baseReadData) {
    //check if each item exists
    //if they dont exist make rnd data for them    

    const input = { ...inputBefore }

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

    if (!inputCols[0]) {
        inputCols[0] = rndData.singleColor()
    }

    if (!inputCols[1]) {
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

    return input
}
