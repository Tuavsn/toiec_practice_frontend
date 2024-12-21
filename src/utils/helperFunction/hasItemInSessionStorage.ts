export default function hasSessionStorageItem(key: string): boolean {
    return sessionStorage.getItem(key) !== null;
}