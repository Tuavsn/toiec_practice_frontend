function HasSessionStorageItem(key: string): boolean {
    return sessionStorage.getItem(key) !== null;
}
function HasLocalStorageItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
}

export {
    HasLocalStorageItem, HasSessionStorageItem
};
