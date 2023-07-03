import type { baseReadData } from "@/app/page";
import { atom } from "jotai"

export const noteSelected = atom<baseReadData>({
    username: "",
    text: "",
    id: undefined,
    createdAt: undefined,
    speed: undefined,
    gravity: undefined,
    shapes: "",
    colors: "",
    angle: undefined,
    audioLink: "",
    ytLinks: "",
    imgLinks: "",
})
