interface shapesLookup {
  width: number;
  rotation: number;
  url: string;
}

export const shapesLookup: { [key: string]: shapesLookup } = {
  A: { width: 21, rotation: 261, url: "" },
  B: { width: 18, rotation: 61, url: "" },
  C: { width: 12, rotation: 321, url: "" },
  D: { width: 49, rotation: 276, url: "" },
  E: { width: 35, rotation: 119, url: "" },
  F: { width: 30, rotation: 5, url: "" },
  G: { width: 19, rotation: 201, url: "" },
  H: { width: 19, rotation: 176, url: "" },
  I: { width: 47, rotation: 101, url: "" },
  J: { width: 25, rotation: 354, url: "" },
  K: { width: 12, rotation: 40, url: "" },
  L: { width: 15, rotation: 88, url: "" },
  M: { width: 39, rotation: 110, url: "" },
  N: { width: 35, rotation: 132, url: "" },
  O: { width: 24, rotation: 218, url: "" },
  P: { width: 22, rotation: 283, url: "" },
};
export default function useShapesLookup(letter: string) {
  return shapesLookup[letter];
}

function createRandomValues() {
  //give random values

  const newObj = JSON.parse(JSON.stringify(shapesLookup));

  for (const key in newObj) {
    newObj[key].width = Math.floor(Math.random() * 40) + 10;
    newObj[key].rotation = Math.floor(Math.random() * 361);
  }

  // eg - A : {width: 33, rotation: 276, url: ''},

  let fullString = "";

  for (const key in newObj) {
    fullString += `${key} : {width: ${newObj[key].width}, rotation: ${newObj[key].rotation}, url: '${newObj[key].url}'}, \n`;
  }
  console.log(shapesLookup);
  console.log(newObj);
  console.log(fullString);
}
