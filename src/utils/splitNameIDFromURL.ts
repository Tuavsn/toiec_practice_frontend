import { Name_ID } from "./types/type";

export default function SplitNameIDFromURL<T extends string>(nameIDPair: Name_ID<T>) {

    const [name, id] = nameIDPair.split('___');
    console.log(decodeURIComponent(name));
    
    return [decodeURIComponent(name), id];
}