//get all boards
//save this to the boardStorage.json

import { NextResponse } from "next/server";
import boardStorageData from "../../boardStorage.json"

//get all notes
export async function GET(request: Request) {

    // const { searchParams } = new URL(request.url)
    // const id = searchParams.get('id')


    return NextResponse.json(boardStorageData)
}

//create a board


//update specific board


//delete specific board
