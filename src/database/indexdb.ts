import { DBSchema, openDB } from 'idb';
import { QuestionListByPart, TestDocument, WritingSheetData } from '../utils/types/type';

const DB_NAME = 'TOEICWritingAppDB';
const DB_VERSION = 1; // Increment this if schema changes
const STORE_NAME = 'sheets_part1';

// Định nghĩa schema của IndexedDB
interface TestDB extends DBSchema {

    questionListByPart: {
        key: number; // Key là chỉ số (index) của phần (partNum)
        value: QuestionListByPart; // Giá trị là dữ liệu của questionList
    };
}

// Hàm khởi tạo cơ sở dữ liệu
const initTestDB = async () => {
    return openDB<TestDB>('TestDatabase', DB_VERSION, {
        upgrade(db) {
            // Tạo object store cho questionListByPart nếu chưa tồn tại
            if (!db.objectStoreNames.contains('questionListByPart')) {
                db.createObjectStore('questionListByPart', { autoIncrement: true }); // Sử dụng autoIncrement
            }
        },
    });
};



// Hàm thêm dữ liệu vào questionListByPart
export const addQuestionListByPartIndex = async (data: TestDocument) => {
    const db = await initTestDB(); // Mở database
    const tx = db.transaction('questionListByPart', 'readwrite'); // Tạo transaction cho questionListByPart
    const store = tx.objectStore('questionListByPart');

    // Thêm từng phần tử vào store, sử dụng index làm key
    await Promise.all(data.map((item, i) => store.put(item, i)));

    await tx.done; // Kết thúc transaction
    console.log('Dữ liệu questionListByPart đã được thêm thành công');
};

// Hàm truy vấn dữ liệu theo partNum
export const queryByPartIndex = async (partNum: number): Promise<QuestionListByPart> => {
    const db = await initTestDB(); // Mở database
    // Lấy dữ liệu từ questionListByPart
    const questions = await db.get('questionListByPart', partNum);

    // Kiểm tra nếu không có dữ liệu
    if (!questions) {
        console.error(`Không tìm thấy dữ liệu cho partNum: ${partNum}`);
        throw new Error(`Không tìm thấy dữ liệu cho partNum: ${partNum}`);
    }

    return questions // Trả về kết quả
};

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * @function getDb
 * @description Initializes and returns a promise for the IDBDatabase instance.
 * Handles database creation and upgrades.
 * @returns {Promise<IDBDatabase>}
 */
function getDb(): Promise<IDBDatabase> {
    if (dbPromise) {
        return dbPromise;
    }

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("Lỗi mở IndexedDB:", event);
            reject(new Error("Không thể mở cơ sở dữ liệu IndexedDB."));
            dbPromise = null; // Reset promise on error
        };

        request.onsuccess = (event) => {
            console.log("IndexedDB đã mở thành công.");
            resolve((event.target as IDBOpenDBRequest).result as IDBDatabase);
        };

        request.onupgradeneeded = (event) => {
            console.log("Nâng cấp IndexedDB...");
            const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                // Index for sorting/querying by creation timestamp
                store.createIndex('createdAt_idx', 'createdAt', { unique: false });
                // Index for status if we need to query by it often (optional for now)
                // store.createIndex('status_idx', 'status', { unique: false });
                console.log(`Object store "${STORE_NAME}" đã được tạo.`);
            }
            // Handle other version upgrades here if schema changes in the future
        };
    });
    return dbPromise;
}

/**
 * @function performDbOperation
 * @description Helper to perform a DB operation with a transaction.
 * @param {(store: IDBObjectStore) => IDBRequest} operation - Function that takes a store and returns a request.
 * @param {IDBTransactionMode} mode - Transaction mode ('readonly' or 'readwrite').
 * @returns {Promise<any>} Result of the operation.
 */
async function performDbOperation<T>(
    operation: (store: IDBObjectStore) => IDBRequest<T>,
    mode: IDBTransactionMode = 'readonly'
): Promise<T> {
    const db = await getDb();
    return new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        const request = operation(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => {
            console.error("Lỗi thao tác DB:", (event.target as IDBRequest).error);
            reject((event.target as IDBRequest).error || new Error("Lỗi thao tác IndexedDB không xác định."));
        };
        transaction.oncomplete = () => { /* console.log(`Giao dịch ${mode} hoàn tất.`); */ };
        transaction.onerror = (event) => {
            console.error("Lỗi giao dịch DB:", (event.target as IDBTransaction).error);
            reject((event.target as IDBTransaction).error || new Error("Lỗi giao dịch IndexedDB."));
        };
    });
}


//------------------------------------------------------
// Public API for Sheets
//------------------------------------------------------

/**
 * @async
 * @function addSheet
 * @description Adds a new sheet to the database.
 * @param {Partial<Omit<WritingSheetData, 'id'>>} sheetPartialData - Data for the new sheet (id is auto-generated).
 * @returns {Promise<number>} The ID of the newly added sheet.
 */
export async function addSheet(sheetPartialData: Partial<Omit<WritingSheetData, 'id'>>): Promise<number> {
    // Ensure createdAt is set if not provided
    const dataToAdd = {
        ...sheetPartialData,
        createdAt: sheetPartialData.createdAt || Date.now(),
    } as Omit<WritingSheetData, 'id'>; // Cast needed as 'id' is omitted

    return performDbOperation<number>((store) => store.add(dataToAdd) as IDBRequest<number>, 'readwrite');
}

/**
 * @async
 * @function getSheetById
 * @description Retrieves a sheet by its ID.
 * @param {number} id - The ID of the sheet to retrieve.
 * @returns {Promise<WritingSheetData | undefined>} The sheet data or undefined if not found.
 */
export async function getSheetById(id: number): Promise<WritingSheetData | undefined> {
    return performDbOperation<WritingSheetData | undefined>((store) => store.get(id));
}

/**
 * @async
 * @function updateSheetToDB
 * @description Updates an existing sheet. The `id` within `sheetData` identifies the sheet.
 * @param {WritingSheetData} sheetData - The full sheet data with updates.
 * @returns {Promise<number>} The ID of the updated sheet.
 */
export async function updateSheetToDB(sheetData: WritingSheetData): Promise<number> {
    // Ensure 'id' is present for updating
    if (typeof sheetData.id !== 'number') {
        return Promise.reject(new Error("ID của sheet là bắt buộc để cập nhật."));
    }
    return performDbOperation<number>((store) => store.put(sheetData) as IDBRequest<number>, 'readwrite');
}

/**
 * @async
 * @function getAllSheetsFromDB
 * @description Retrieves all sheets from the database.
 * @returns {Promise<WritingSheetData[]>} An array of all sheets.
 */
export async function getAllSheetsFromDB(): Promise<WritingSheetData[]> {
    return performDbOperation<WritingSheetData[]>((store) => store.getAll());
}


/**
 * @async
 * @function getSheetsCountFromDB
 * @description Gets the total number of sheets in the store.
 * @returns {Promise<number>} The total count of sheets.
 */
export async function getSheetsCountFromDB(): Promise<number> {
    return performDbOperation<number>((store) => store.count());
}

/**
 * @async
 * @function getLatestSheetByTimestamp
 * @description Retrieves the sheet with the most recent 'createdAt' timestamp.
 * @returns {Promise<WritingSheetData | undefined>} The latest sheet or undefined if store is empty.
 */
export async function getLatestSheetByTimestampFromDB(): Promise<WritingSheetData | undefined> {
    const db = await getDb();
    return new Promise<WritingSheetData | undefined>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('createdAt_idx'); // Use the index

        // Open a cursor to get the last record (highest timestamp)
        const cursorRequest = index.openCursor(null, 'prev'); // 'prev' for descending order

        cursorRequest.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
                resolve(cursor.value as WritingSheetData);
            } else {
                resolve(undefined); // No records found
            }
        };
        cursorRequest.onerror = (event) => {
            console.error("Lỗi khi lấy sheet mới nhất theo timestamp:", event);
            reject((event.target as IDBRequest).error || new Error("Lỗi lấy sheet mới nhất."));
        };
    });
}

/**
 * @async
 * @function getLatestSheetById
 * @description Retrieves the sheet with the highest ID.
 * This is useful if 'id' is auto-incrementing and represents the latest entry numerically.
 * @returns {Promise<WritingSheetData | undefined>} The sheet with the highest ID or undefined.
 */
export async function getLatestSheetByIdFromDB(): Promise<WritingSheetData | undefined> {
    const db = await getDb();
    return new Promise<WritingSheetData | undefined>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        // Open a cursor on the main store (keyPath 'id') in 'prev' direction to get the last item.
        const cursorRequest = store.openCursor(null, 'prev');

        cursorRequest.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
                resolve(cursor.value as WritingSheetData); // The record with the highest ID
            } else {
                resolve(undefined); // Store is empty
            }
        };
        cursorRequest.onerror = (event) => {
            console.error("Lỗi khi lấy sheet mới nhất theo ID:", event);
            reject((event.target as IDBRequest).error || new Error("Lỗi lấy sheet mới nhất theo ID."));
        };
    });
}

/**
 * @function initializeDB
 * @description A simple function to ensure the DB is opened and initialized when app starts.
 * @returns {Promise<IDBDatabase>}
 */
export async function initializeDB(): Promise<IDBDatabase> {
    return getDb();
}