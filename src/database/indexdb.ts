import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { ChatMessage, Part2EmailContext, QuestionListByPart, SessionData, TestDocument, TestDraft, TestID, WritingSheetData, WritingToeicPart2SheetData, WritingToeicPart3SheetData } from '../utils/types/type';

const DB_PRACTICE_NAME = 'TOEICWritingAppDB' as const;
const DB_PRACTICE_VERSION = 3 as const;
const STORE_PRACTICE_NAME_PART1 = 'sheets_part1' as const;
const STORE_PRACTICE_NAME_PART2 = 'sheets_part2' as const;
const STORE_PRACTICE_NAME_PART3 = 'sheets_part3' as const;

const DB_TEST_PAPER_NAME = 'TestDatabase' as const;
const DB_TEST_PAPER_VERSION = 2 as const;

const CHATBOX_DB_NAME = 'chatBox_DB_CHATBOX_NAME' as const;
const CHATBOX_DB_VERSION = 1 as const;
const CHATBOX_SESSION_STORE = 'chatBox_sessions' as const;
const CHATBOX_MESSAGES_STORE = 'chatBox_messages' as const;

// Định nghĩa schema của IndexedDB
interface TestDB extends DBSchema {

    questionListByPart: {
        key: number; // Key là chỉ số (index) của phần (partNum)
        value: QuestionListByPart; // Giá trị là dữ liệu của questionList
    };
    meta: {
        key: string;
        value: string;
    };
}

interface ChatBoxDB {
  chatBox_sessions: SessionData;
  chatBox_messages: ChatMessage[];
}


// Hàm khởi tạo cơ sở dữ liệu
export const initTestDB = async (): Promise<IDBPDatabase<TestDB>> => {
    return openDB<TestDB>(DB_TEST_PAPER_NAME, DB_TEST_PAPER_VERSION, {
        upgrade(db, oldVersion) {
            //------------------------------------------------------
            // Nếu phiên bản cũ < 1: tạo questionListByPart
            //------------------------------------------------------
            if (oldVersion < 1) {
                db.createObjectStore('questionListByPart', { autoIncrement: true });
            }
            //------------------------------------------------------
            // Nếu phiên bản cũ < 2: tạo meta store
            //------------------------------------------------------
            if (oldVersion < 2) {
                const metaStore = db.createObjectStore('meta');
                const now = new Date().toISOString();
                metaStore.put(now, 'createdAt');
            }
        },
    });
};



/**
 * Đọc ngày tạo database
 */
export const getDbCreationDate = async (): Promise<Date> => {
    const db = await initTestDB();
    const iso = await db.get('meta', 'createdAt');
    if (!iso) {
        throw new Error('Không tìm thấy ngày tạo trong meta store');
    }
    return new Date(iso);
};

export const addQuestionListByPartIndex = async (data: TestDocument): Promise<void> => {
    //------------------------------------------------------
    // Guard clause: nếu array rỗng thì thôi
    //------------------------------------------------------
    if (!data.length) {
        console.warn('No items to add');
        return;
    }

    const db = await initTestDB();
    const tx = db.transaction('questionListByPart', 'readwrite');
    const store = tx.objectStore('questionListByPart');

    await Promise.all(data.map((item, i) => store.put(item, i)));
    await tx.done;
    console.log('Added questionListByPart successfully');
};

export const queryByPartIndex = async (partNum: number): Promise<QuestionListByPart> => {
    if (partNum < 0) {
        throw new Error('partNum phải >= 0');
    }

    const db = await initTestDB();
    const result = await db.get('questionListByPart', partNum);
    if (!result) {
        throw new Error(`Không tìm thấy dữ liệu cho partNum: ${partNum}`);
    }
    return result;
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
        const request = indexedDB.open(DB_PRACTICE_NAME, DB_PRACTICE_VERSION);

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
            const transaction = (event.target as IDBOpenDBRequest).transaction; // Lấy transaction từ event

            const oldVersion = event.oldVersion;
            if (oldVersion < 1 && !db.objectStoreNames.contains(STORE_PRACTICE_NAME_PART1)) {
                const store = db.createObjectStore(STORE_PRACTICE_NAME_PART1, { keyPath: 'id', autoIncrement: true });
                // Index for sorting/querying by creation timestamp
                store.createIndex('createdAt_idx', 'createdAt', { unique: false });
                // Index for status if we need to query by it often (optional for now)
                // store.createIndex('status_idx', 'status', { unique: false });
                console.log(`Object store "${STORE_PRACTICE_NAME_PART1}" đã được tạo.`);
            }
            // Tạo store MỚI cho Part 2 nếu chưa có (từ version < 2)
            if (oldVersion < 2 && !db.objectStoreNames.contains(STORE_PRACTICE_NAME_PART2)) {
                const storeP2 = db.createObjectStore(STORE_PRACTICE_NAME_PART2, { keyPath: 'id', autoIncrement: true });
                // Index để sắp xếp/truy vấn theo thời gian tạo
                storeP2.createIndex('createdAt_idx_p2', 'createdAt', { unique: false });
                // Index cho status nếu cần truy vấn thường xuyên (tùy chọn)
                // storeP2.createIndex('status_idx_p2', 'status', { unique: false });
                console.log(`Object store "${STORE_PRACTICE_NAME_PART2}" đã được tạo.`);
            }
            if (event.oldVersion < 3 && !db.objectStoreNames.contains(STORE_PRACTICE_NAME_PART3)) {
                const storeP3 = db.createObjectStore(STORE_PRACTICE_NAME_PART3, { keyPath: 'id', autoIncrement: true });
                // Index để sắp xếp/truy vấn theo thời gian tạo
                storeP3.createIndex('createdAt_idx_p3', 'createdAt', { unique: false });
                // Index cho status nếu cần truy vấn thường xuyên (tùy chọn)
                // storeP3.createIndex('status_idx_p3', 'status', { unique: false });
                console.log(`Object store "${STORE_PRACTICE_NAME_PART3}" đã được tạo.`);
            }
            // Xử lý các nâng cấp version khác ở đây nếu có trong tương lai
            if (transaction) {
                transaction.oncomplete = () => {
                    console.log(`Giao dịch nâng cấp DB version ${DB_PRACTICE_VERSION} hoàn tất.`);
                };
            }
        };
    });
    return dbPromise;
}

/**
 * @function performPart1DbOperation
 * @description Helper to perform a DB operation with a transaction.
 * @param {(store: IDBObjectStore) => IDBRequest} operation - Function that takes a store and returns a request.
 * @param {IDBTransactionMode} mode - Transaction mode ('readonly' or 'readwrite').
 * @returns {Promise<any>} Result of the operation.
 */
async function performPart1DbOperation<T>(
    operation: (store: IDBObjectStore) => IDBRequest<T>,
    mode: IDBTransactionMode = 'readonly'
): Promise<T> {
    const db = await getDb();
    return new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE_PRACTICE_NAME_PART1, mode);
        const store = transaction.objectStore(STORE_PRACTICE_NAME_PART1);
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
 * @function addPart1Sheet
 * @description Adds a new sheet to the database.
 * @param {Partial<Omit<WritingSheetData, 'id'>>} sheetPartialData - Data for the new sheet (id is auto-generated).
 * @returns {Promise<number>} The ID of the newly added sheet.
 */
export async function addPart1Sheet(sheetPartialData: Partial<Omit<WritingSheetData, 'id'>>): Promise<number> {
    // Ensure createdAt is set if not provided
    const dataToAdd = {
        ...sheetPartialData,
        createdAt: sheetPartialData.createdAt || Date.now(),
    } as Omit<WritingSheetData, 'id'>; // Cast needed as 'id' is omitted

    return performPart1DbOperation<number>((store) => store.add(dataToAdd) as IDBRequest<number>, 'readwrite');
}

/**
 * @async
 * @function getPart1SheetById
 * @description Retrieves a sheet by its ID.
 * @param {number} id - The ID of the sheet to retrieve.
 * @returns {Promise<WritingSheetData | undefined>} The sheet data or undefined if not found.
 */
export async function getPart1SheetById(id: number): Promise<WritingSheetData | undefined> {
    return performPart1DbOperation<WritingSheetData | undefined>((store) => store.get(id));
}

/**
 * @async
 * @function updatePart1SheetToDB
 * @description Updates an existing sheet. The `id` within `sheetData` identifies the sheet.
 * @param {WritingSheetData} sheetData - The full sheet data with updates.
 * @returns {Promise<number>} The ID of the updated sheet.
 */
export async function updatePart1SheetToDB(sheetData: WritingSheetData): Promise<number> {
    // Ensure 'id' is present for updating
    if (typeof sheetData.id !== 'number') {
        return Promise.reject(new Error("ID của sheet là bắt buộc để cập nhật."));
    }
    return performPart1DbOperation<number>((store) => store.put(sheetData) as IDBRequest<number>, 'readwrite');
}

/**
 * @async
 * @function getAllPart1SheetsFromDB
 * @description Retrieves all sheets from the database.
 * @returns {Promise<WritingSheetData[]>} An array of all sheets.
 */
export async function getAllPart1SheetsFromDB(): Promise<WritingSheetData[]> {
    return performPart1DbOperation<WritingSheetData[]>((store) => store.getAll());
}


/**
 * @async
 * @function getSheetsCountFromDB
 * @description Gets the total number of sheets in the store.
 * @returns {Promise<number>} The total count of sheets.
 */
export async function getPart1SheetsCountFromDB(): Promise<number> {
    return performPart1DbOperation<number>((store) => store.count());
}

/**
 * @async
 * @function getLatestSheetByTimestamp
 * @description Retrieves the sheet with the most recent 'createdAt' timestamp.
 * @returns {Promise<WritingSheetData | undefined>} The latest sheet or undefined if store is empty.
 */
export async function getLatestPart1SheetByTimestampFromDB(): Promise<WritingSheetData | undefined> {
    const db = await getDb();
    return new Promise<WritingSheetData | undefined>((resolve, reject) => {
        const transaction = db.transaction(STORE_PRACTICE_NAME_PART1, 'readonly');
        const store = transaction.objectStore(STORE_PRACTICE_NAME_PART1);
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
export async function getLatestPart1SheetByIdFromDB(): Promise<WritingSheetData | undefined> {
    const db = await getDb();
    return new Promise<WritingSheetData | undefined>((resolve, reject) => {
        const transaction = db.transaction(STORE_PRACTICE_NAME_PART1, 'readonly');
        const store = transaction.objectStore(STORE_PRACTICE_NAME_PART1);

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
 * @function performPart2DbOperation
 * @description Hàm helper để thực hiện một thao tác DB với transaction cho store của Part 2.
 * @param {(store: IDBObjectStore) => IDBRequest} operation - Hàm nhận vào store và trả về một request.
 * @param {IDBTransactionMode} mode - Chế độ transaction ('readonly' hoặc 'readwrite').
 * @returns {Promise<any>} Kết quả của thao tác.
 * @template T - Kiểu dữ liệu mong đợi trả về.
 * @comment Bình luận bằng tiếng Việt: Hàm tiện ích này giúp giảm thiểu code lặp lại khi tương tác với IndexedDB cho Part 2.
 */
async function performPart2DbOperation<T>(
    operation: (store: IDBObjectStore) => IDBRequest<T> | IDBRequest<IDBValidKey[]>, // IDBRequest có thể trả về T hoặc IDBValidKey[] (ví dụ cho getAllKeys)
    mode: IDBTransactionMode = 'readonly'
): Promise<T> { // Luôn resolve về T (ví dụ, IDBValidKey[] sẽ được cast nếu cần, hoặc hàm gọi sẽ biết kiểu T)
    const db = await getDb(); // Đảm bảo getDb đã được gọi và dbPromise được resolve
    return new Promise<T>((resolve, reject) => {
        // Kiểm tra db có tồn tại không trước khi tạo transaction
        if (!db) {
            console.error("performPart2DbOperation: DB instance không tồn tại.");
            reject(new Error("Kết nối cơ sở dữ liệu không thành công."));
            return;
        }
        const transaction = db.transaction(STORE_PRACTICE_NAME_PART2, mode);
        const store = transaction.objectStore(STORE_PRACTICE_NAME_PART2);
        const request = operation(store) as IDBRequest<T>; // Cast sang IDBRequest<T>

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => {
            console.error("Lỗi thao tác DB Part 2:", (event.target as IDBRequest).error);
            reject((event.target as IDBRequest).error || new Error("Lỗi thao tác IndexedDB (Part 2) không xác định."));
        };
        transaction.oncomplete = () => { /* console.log(`Giao dịch Part 2 (${mode}) hoàn tất.`); */ };
        transaction.onerror = (event) => {
            console.error("Lỗi giao dịch DB Part 2:", (event.target as IDBTransaction).error);
            reject((event.target as IDBTransaction).error || new Error("Lỗi giao dịch IndexedDB (Part 2)."));
        };
    });
}

//------------------------------------------------------
// Section: Public API cho Sheets của Part 2
//------------------------------------------------------

/**
 * @async
 * @function addPart2Sheet
 * @description Thêm một sheet Part 2 mới vào database.
 * @param {Partial<Omit<WritingToeicPart2SheetData, 'id'>>} sheetPartialData - Dữ liệu cho sheet mới (id được tự động tạo).
 * @returns {Promise<number>} ID của sheet vừa được thêm.
 * @comment Bình luận bằng tiếng Việt: Hàm này dùng để lưu một bài làm Part 2 mới.
 */
export async function addPart2Sheet(sheetPartialData: Partial<Omit<WritingToeicPart2SheetData, 'id'>>): Promise<number> {
    const dataToAdd = {
        ...sheetPartialData,
        createdAt: sheetPartialData.createdAt || Date.now(), // Đảm bảo có createdAt
    } as Omit<WritingToeicPart2SheetData, 'id'>;
    return performPart2DbOperation<number>((store) => store.add(dataToAdd) as IDBRequest<number>, 'readwrite');
}

/**
 * @async
 * @function getPart2SheetById
 * @description Lấy một sheet Part 2 theo ID.
 * @param {number} id - ID của sheet cần lấy.
 * @returns {Promise<WritingToeicPart2SheetData | undefined>} Dữ liệu sheet hoặc undefined nếu không tìm thấy.
 * @comment Bình luận bằng tiếng Việt: Dùng để tải một bài làm Part 2 cụ thể dựa vào ID.
 */
export async function getPart2SheetById(id: number): Promise<WritingToeicPart2SheetData | undefined> {
    return performPart2DbOperation<WritingToeicPart2SheetData | undefined>((store) => store.get(id));
}

/**
 * @async
 * @function updatePart2Sheet
 * @description Cập nhật một sheet Part 2 đã có. `id` trong `sheetData` xác định sheet cần cập nhật.
 * @param {WritingToeicPart2SheetData} sheetData - Dữ liệu sheet đầy đủ với các cập nhật.
 * @returns {Promise<number>} ID của sheet đã được cập nhật.
 * @comment Bình luận bằng tiếng Việt: Cập nhật thông tin cho một bài làm Part 2 đã tồn tại.
 */
export async function updatePart2Sheet(sheetData: WritingToeicPart2SheetData): Promise<number> {
    if (typeof sheetData.id !== 'number') {
        return Promise.reject(new Error("ID của sheet Part 2 là bắt buộc để cập nhật."));
    }
    return performPart2DbOperation<number>((store) => store.put(sheetData) as IDBRequest<number>, 'readwrite');
}

/**
 * @async
 * @function getPart2SheetsCount
 * @description Lấy tổng số sheet Part 2 trong store.
 * @returns {Promise<number>} Tổng số sheet Part 2.
 * @comment Bình luận bằng tiếng Việt: Dùng cho Paginator để biết tổng số bài làm Part 2.
 */
export async function getPart2SheetsCount(): Promise<number> {
    return performPart2DbOperation<number>((store) => store.count());
}

/**
 * @async
 * @function getLatestPart2SheetByTimestamp
 * @description Lấy sheet Part 2 có 'createdAt' timestamp gần nhất.
 * @returns {Promise<WritingToeicPart2SheetData | undefined>} Sheet mới nhất hoặc undefined nếu store rỗng.
 * @comment Bình luận bằng tiếng Việt: Dùng để tải bài làm Part 2 gần nhất khi người dùng vào trang.
 */
export async function getLatestPart2SheetByTimestamp(): Promise<WritingToeicPart2SheetData | undefined> {
    const db = await getDb();
    return new Promise<WritingToeicPart2SheetData | undefined>((resolve, reject) => {
        const transaction = db.transaction(STORE_PRACTICE_NAME_PART2, 'readonly');
        const store = transaction.objectStore(STORE_PRACTICE_NAME_PART2);
        const index = store.index('createdAt_idx_p2'); // Sử dụng index đã tạo cho Part 2

        const cursorRequest = index.openCursor(null, 'prev'); // 'prev' để lấy theo thứ tự giảm dần (mới nhất trước)

        cursorRequest.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            resolve(cursor ? (cursor.value as WritingToeicPart2SheetData) : undefined);
        };
        cursorRequest.onerror = (event) => {
            console.error("Lỗi khi lấy sheet Part 2 mới nhất theo timestamp:", event);
            reject((event.target as IDBRequest).error || new Error("Lỗi lấy sheet Part 2 mới nhất."));
        };
    });
}

/**
 * @async
 * @function getLatestPart2SheetById
 * @description Lấy sheet Part 2 có ID lớn nhất (nếu ID tự tăng).
 * @returns {Promise<WritingToeicPart2SheetData | undefined>} Sheet có ID lớn nhất hoặc undefined.
 * @comment Bình luận bằng tiếng Việt: Hữu ích để lấy bài làm Part 2 được nhập cuối cùng về mặt số thứ tự.
 */
export async function getLatestPart2SheetById(): Promise<WritingToeicPart2SheetData | undefined> {
    const db = await getDb();
    return new Promise<WritingToeicPart2SheetData | undefined>((resolve, reject) => {
        const transaction = db.transaction(STORE_PRACTICE_NAME_PART2, 'readonly');
        const store = transaction.objectStore(STORE_PRACTICE_NAME_PART2);
        const cursorRequest = store.openCursor(null, 'prev'); // 'prev' trên keyPath mặc định (id)

        cursorRequest.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            resolve(cursor ? (cursor.value as WritingToeicPart2SheetData) : undefined);
        };
        cursorRequest.onerror = (event) => {
            console.error("Lỗi khi lấy sheet Part 2 mới nhất theo ID:", event);
            reject((event.target as IDBRequest).error || new Error("Lỗi lấy sheet Part 2 mới nhất theo ID."));
        };
    });
}

// Hàm initializeDB có thể giữ nguyên, vì nó gọi getDb() sẽ tự động xử lý việc nâng cấp version.
// export async function initializeDB(): Promise<IDBDatabase> {
//     return getDb();
// }

// Bạn cũng có thể muốn thêm hàm getAllPart2Sheets nếu cần, tương tự như Part 1.
/**
 * @async
 * @function getAllPart2Sheets
 * @description Lấy tất cả các sheet Part 2 từ database.
 * @returns {Promise<WritingToeicPart2SheetData[]>} Một mảng tất cả các sheet Part 2.
 * @comment Bình luận bằng tiếng Việt: Lấy toàn bộ lịch sử làm bài Part 2.
 */
export async function getAllPart2Sheets(): Promise<WritingToeicPart2SheetData[]> {
    return performPart2DbOperation<WritingToeicPart2SheetData[]>((store) => store.getAll());
}


export async function getLastestPart2TopicFromDB(limit: number = 10): Promise<Part2EmailContext[] | undefined> {
    const db = await getDb(); // Đảm bảo getDb() trả về Promise<IDBDatabase>
    return new Promise<Part2EmailContext[]>((resolve, reject) => { // Không trả về undefined ở đây nữa, luôn là mảng
        const transaction = db.transaction(STORE_PRACTICE_NAME_PART2, "readonly");
        const store = transaction.objectStore(STORE_PRACTICE_NAME_PART2);
        const index = store.index("createdAt_idx_p2"); // Đảm bảo index này tồn tại

        const part2EmailContextList: Part2EmailContext[] = [];
        let count = 0;

        const cursorRequest = index.openCursor(null, "prev"); // 'prev' để lấy mới nhất trước

        cursorRequest.onerror = (event) => {
            console.error("Lỗi mở cursor trong getLastestPart2TopicFromDB:", (event.target as IDBRequest).error);
            reject(new Error("Lỗi khi mở cursor để lấy danh sách chủ đề email Part 2"));
        };

        cursorRequest.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

            if (cursor && count < limit) {
                // Cursor hợp lệ và chưa đạt giới hạn số lượng
                const sheetData = cursor.value as WritingToeicPart2SheetData;
                const {
                    promptReceivedEmailSenderEmail: email, // Đảm bảo đây là trường bạn muốn cho 'email'
                    promptReceivedEmailSubject: subject,
                    promptReceivedEmailTasks: tasksArray, // Đổi tên biến để rõ ràng đây là một mảng
                    promptRecipientName: _recipientName
                } = sheetData;

                // Chỉ thêm vào danh sách nếu các trường cần thiết tồn tại và tasksArray có nội dung
                if (email && subject && tasksArray && tasksArray.length > 0) {
                    part2EmailContextList.push({
                        email,
                        subject,
                        recipientName: _recipientName ?? "friend",
                        tasks: tasksArray // Gán tasksArray cho thuộc tính task của Part2EmailContext
                    });
                    count++;
                }
                cursor.continue();
            } else {// Không còn cursor (đã duyệt hết) hoặc đã đạt giới hạn
                console.log(`getLastestPart2TopicFromDB: Hoàn tất, lấy được ${part2EmailContextList.length} chủ đề.`);
                resolve(part2EmailContextList); // Trả về danh sách đã thu thập được
            }
        };

        transaction.oncomplete = () => {
            // Giao dịch hoàn tất. Nếu resolve chưa được gọi (ví dụ do lỗi logic nào đó),
            // điều này có thể giúp phát hiện. Nhưng với logic cursor đúng, resolve sẽ được gọi trước.
            // console.log("Transaction completed for getLastestPart2TopicFromDB (oncomplete).");
        };

        transaction.onerror = (event) => {
            // Lỗi ở transaction cũng nên reject Promise
            console.error("Lỗi transaction trong getLastestPart2TopicFromDB:", (event.target as IDBTransaction).error);
            reject(new Error("Lỗi giao dịch khi lấy danh sách chủ đề email Part 2"));
        };
    });
}

/**
 * @function performPart3DbOperation
 * @description Hàm helper để thực hiện một thao tác DB với transaction cho store của Part 3.
 * @param {(store: IDBObjectStore) => IDBRequest<T> | IDBRequest<IDBValidKey[]>} operation - Hàm nhận vào store và trả về một request.
 * @param {IDBTransactionMode} mode - Chế độ transaction ('readonly' hoặc 'readwrite').
 * @returns {Promise<T>} Kết quả của thao tác.
 * @template T - Kiểu dữ liệu mong đợi trả về.
 * @comment Bình luận bằng tiếng Việt: Hàm tiện ích này giúp giảm thiểu code lặp lại khi tương tác với IndexedDB cho Part 3.
 */
async function performPart3DbOperation<T>(
    operation: (store: IDBObjectStore) => IDBRequest<T> | IDBRequest<IDBValidKey[]>,
    mode: IDBTransactionMode = 'readonly'
): Promise<T> {
    const db = await getDb();
    return new Promise<T>((resolve, reject) => {
        if (!db) {
            console.error("performPart3DbOperation: DB instance không tồn tại.");
            reject(new Error("Kết nối cơ sở dữ liệu không thành công cho Part 3."));
            return;
        }
        const transaction = db.transaction(STORE_PRACTICE_NAME_PART3, mode);
        const store = transaction.objectStore(STORE_PRACTICE_NAME_PART3);
        const request = operation(store) as IDBRequest<T>;

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => {
            console.error("Lỗi thao tác DB Part 3:", (event.target as IDBRequest).error);
            reject((event.target as IDBRequest).error || new Error("Lỗi thao tác IndexedDB (Part 3) không xác định."));
        };
        transaction.onerror = (event) => {
            console.error("Lỗi giao dịch DB Part 3:", (event.target as IDBTransaction).error);
            reject((event.target as IDBTransaction).error || new Error("Lỗi giao dịch IndexedDB (Part 3)."));
        };
    });
}

//------------------------------------------------------
// Section: Public API cho Sheets của Part 3 (MỚI)
//------------------------------------------------------

/**
 * @async
 * @function addPart3Sheet
 * @description Thêm một sheet Part 3 mới vào database.
 * @param {Partial<Omit<WritingToeicPart3SheetData, 'id'>>} sheetPartialData - Dữ liệu cho sheet mới.
 * @returns {Promise<number>} ID của sheet vừa được thêm.
 * @comment Bình luận bằng tiếng Việt: Lưu một bài luận Part 3 mới.
 */
export async function addPart3Sheet(sheetPartialData: Partial<Omit<WritingToeicPart3SheetData, 'id'>>): Promise<number> {
    const dataToAdd = {
        ...sheetPartialData,
        createdAt: sheetPartialData.createdAt || Date.now(),
    } as Omit<WritingToeicPart3SheetData, 'id'>;
    return performPart3DbOperation<number>((store) => store.add(dataToAdd) as IDBRequest<number>, 'readwrite');
}

/**
 * @async
 * @function getPart3SheetById
 * @description Lấy một sheet Part 3 theo ID.
 * @param {number} id - ID của sheet cần lấy.
 * @returns {Promise<WritingToeicPart3SheetData | undefined>} Dữ liệu sheet hoặc undefined.
 * @comment Bình luận bằng tiếng Việt: Tải một bài luận Part 3 cụ thể.
 */
export async function getPart3SheetById(id: number): Promise<WritingToeicPart3SheetData | undefined> {
    return performPart3DbOperation<WritingToeicPart3SheetData | undefined>((store) => store.get(id));
}

/**
 * @async
 * @function updatePart3Sheet
 * @description Cập nhật một sheet Part 3 đã có.
 * @param {WritingToeicPart3SheetData} sheetData - Dữ liệu sheet đầy đủ với các cập nhật.
 * @returns {Promise<number>} ID của sheet đã được cập nhật.
 * @comment Bình luận bằng tiếng Việt: Cập nhật thông tin cho một bài luận Part 3.
 */
export async function updatePart3Sheet(sheetData: WritingToeicPart3SheetData): Promise<number> {
    if (typeof sheetData.id !== 'number') {
        return Promise.reject(new Error("ID của sheet Part 3 là bắt buộc để cập nhật."));
    }
    return performPart3DbOperation<number>((store) => store.put(sheetData) as IDBRequest<number>, 'readwrite');
}

/**
 * @async
 * @function getPart3SheetsCount
 * @description Lấy tổng số sheet Part 3.
 * @returns {Promise<number>} Tổng số sheet Part 3.
 * @comment Bình luận bằng tiếng Việt: Dùng cho Paginator của Part 3.
 */
export async function getPart3SheetsCount(): Promise<number> {
    return performPart3DbOperation<number>((store) => store.count());
}

/**
 * @async
 * @function getLatestPart3SheetByTimestamp
 * @description Lấy sheet Part 3 có 'createdAt' timestamp gần nhất.
 * @returns {Promise<WritingToeicPart3SheetData | undefined>} Sheet mới nhất hoặc undefined.
 * @comment Bình luận bằng tiếng Việt: Tải bài luận Part 3 làm gần nhất.
 */
export async function getLatestPart3SheetByTimestamp(): Promise<WritingToeicPart3SheetData | undefined> {
    const db = await getDb();
    return new Promise<WritingToeicPart3SheetData | undefined>((resolve, reject) => {
        const transaction = db.transaction(STORE_PRACTICE_NAME_PART3, 'readonly');
        const store = transaction.objectStore(STORE_PRACTICE_NAME_PART3);
        const index = store.index('createdAt_idx_p3'); // Sử dụng index của Part 3

        const cursorRequest = index.openCursor(null, 'prev');
        cursorRequest.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            resolve(cursor ? (cursor.value as WritingToeicPart3SheetData) : undefined);
        };
        cursorRequest.onerror = (event) => {
            console.error("Lỗi khi lấy sheet Part 3 mới nhất theo timestamp:", event);
            reject((event.target as IDBRequest).error || new Error("Lỗi lấy sheet Part 3 mới nhất."));
        };
    });
}

/**
 * @async
 * @function getLatestPart3SheetById
 * @description Lấy sheet Part 3 có ID lớn nhất.
 * @returns {Promise<WritingToeicPart3SheetData | undefined>} Sheet có ID lớn nhất hoặc undefined.
 * @comment Bình luận bằng tiếng Việt: Lấy bài luận Part 3 cuối cùng theo số thứ tự.
 */
export async function getLatestPart3SheetById(): Promise<WritingToeicPart3SheetData | undefined> {
    const db = await getDb();
    return new Promise<WritingToeicPart3SheetData | undefined>((resolve, reject) => {
        const transaction = db.transaction(STORE_PRACTICE_NAME_PART3, 'readonly');
        const store = transaction.objectStore(STORE_PRACTICE_NAME_PART3);
        const cursorRequest = store.openCursor(null, 'prev');

        cursorRequest.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            resolve(cursor ? (cursor.value as WritingToeicPart3SheetData) : undefined);
        };
        cursorRequest.onerror = (event) => {
            console.error("Lỗi khi lấy sheet Part 3 mới nhất theo ID:", event);
            reject((event.target as IDBRequest).error || new Error("Lỗi lấy sheet Part 3 mới nhất theo ID."));
        };
    });
}

/**
 * @async
 * @function getAllPart3Sheets
 * @description Lấy tất cả các sheet Part 3 từ database. (Tùy chọn, nếu cần)
 * @returns {Promise<WritingToeicPart3SheetData[]>} Một mảng tất cả các sheet Part 3.
 * @comment Bình luận bằng tiếng Việt: Lấy toàn bộ lịch sử làm bài luận Part 3.
 */
export async function getAllPart3Sheets(): Promise<WritingToeicPart3SheetData[]> {
    return performPart3DbOperation<WritingToeicPart3SheetData[]>((store) => store.getAll());
}

export async function getSomeHistoryTopicsForPart3(limit: number = 10): Promise<string[] | undefined> {
    const db = await getDb(); // Đảm bảo getDb() trả về Promise<IDBDatabase>
    return new Promise<string[]>((resolve, reject) => { // Không trả về undefined ở đây nữa, luôn là mảng
        const transaction = db.transaction(STORE_PRACTICE_NAME_PART3, "readonly");
        const store = transaction.objectStore(STORE_PRACTICE_NAME_PART3);
        const index = store.index("createdAt_idx_p3"); // Đảm bảo index này tồn tại

        const part3TopicList: string[] = [];
        let count = 0;

        const cursorRequest = index.openCursor(null, "prev"); // 'prev' để lấy mới nhất trước

        cursorRequest.onerror = (event) => {
            console.error("Lỗi mở cursor trong getSomeHistoryTopicsForPart3:", (event.target as IDBRequest).error);
            reject(new Error("Lỗi khi mở cursor để lấy danh sách chủ đề Part 3"));
        };

        cursorRequest.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

            if (cursor && count < limit) {
                // 1. Cursor vẫn còn và chúng ta chưa đạt đủ số lượng 'limit'
                const sheetData = cursor.value as WritingToeicPart3SheetData;

                // Chỉ thêm vào danh sách nếu essayQuestion thực sự tồn tại và không rỗng
                if (sheetData.essayQuestion && sheetData.essayQuestion.trim() !== "") {
                    part3TopicList.push(sheetData.essayQuestion);
                    count++;
                }

                // 2. Yêu cầu cursor di chuyển đến item tiếp theo
                cursor.continue();
            } else {
                // 3. Điều kiện dừng: Không còn cursor (đã duyệt hết) HOẶC đã đạt đủ 'limit'
                console.log(`getSomeHistoryTopicsForPart3: Hoàn tất, lấy được ${part3TopicList.length} chủ đề.`);
                resolve(part3TopicList); // Resolve Promise với danh sách đã thu thập được
            }
        };

        transaction.oncomplete = () => {
            console.log("Transaction completed for getSomeHistoryTopicsForPart3 (oncomplete).");
        };

        transaction.onerror = (event) => {
            // Lỗi ở transaction cũng nên reject Promise
            console.error("Lỗi transaction trong getSomeHistoryTopicsForPart3:", (event.target as IDBTransaction).error);
            reject(new Error("Lỗi giao dịch khi lấy danh sách chủ đề Part 3"));
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



//------------------------------------------------------
// Define IndexedDB schema
//------------------------------------------------------
interface DraftDBSchema extends DBSchema {
    drafts: {
        key: TestID;
        value: TestDraft;
    };
}

let dbDraftPromise: Promise<IDBPDatabase<DraftDBSchema>>;
//------------------------------------------------------
// Initialize or get IndexedDB instance with named store
//------------------------------------------------------
function getDB() {
    if (!dbDraftPromise) {
        dbDraftPromise = openDB<DraftDBSchema>('TestDraftDB', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('drafts')) {
                    db.createObjectStore('drafts', { keyPath: undefined });
                }
            },
        });
    }
    return dbDraftPromise;
}

//------------------------------------------------------
// Check if a draft exists for a given testID
//------------------------------------------------------
export async function checkDraftInIndexDB(testID: TestID): Promise<number | null> {
    const db = await getDB();
    const tx = db.transaction('drafts', 'readonly');
    const store = tx.objectStore('drafts');
    const record = await store.get(testID);
    await tx.done;
    if (record) {
        return record.version;
    }

    return null;
}

//------------------------------------------------------
// Get existing draft or throw if none
//------------------------------------------------------
export async function getDraftFromIndexDB(testID: TestID): Promise<TestDraft | null> {
    const db = await getDB();
    const tx = db.transaction('drafts', 'readonly');
    const store = tx.objectStore('drafts');
    const record = await store.get(testID);
    await tx.done;

    // guard clause: nếu không tìm thấy draft
    if (!record) {
        console.warn(`No draft found for testID: ${testID}`);
        return null;
    }

    return record;
}

//------------------------------------------------------
// Upsert (insert or update) draft into IndexedDB
//------------------------------------------------------
export async function upsertDraftToIndexDB(
    testID: TestID,
    draft: TestDraft,
): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('drafts', 'readwrite');
    const store = tx.objectStore('drafts');
    await store.put(draft, testID);
    await tx.done;
}

//------------------------------------------------------
// Delete draft from IndexedDB
//------------------------------------------------------
export async function deleteDraftFromIndexDB(testID: TestID): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('drafts', 'readwrite');
    const store = tx.objectStore('drafts');
    await store.delete(testID);
    await tx.done;
    console.log("delete completed");

}

let chatBoxDbPromise: Promise<IDBPDatabase<ChatBoxDB>>;

function chatBoxGetDb(): Promise<IDBPDatabase<ChatBoxDB>> {
  if (!chatBoxDbPromise) {
    chatBoxDbPromise = openDB<ChatBoxDB>(CHATBOX_DB_NAME, CHATBOX_DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(CHATBOX_SESSION_STORE)) {
          db.createObjectStore(CHATBOX_SESSION_STORE);
        }
        if (!db.objectStoreNames.contains(CHATBOX_MESSAGES_STORE)) {
          db.createObjectStore(CHATBOX_MESSAGES_STORE);
        }
      },
    });
  }
  return chatBoxDbPromise;
}

export async function chatBoxGetSession(questionId: string): Promise<SessionData | undefined> {
  const db = await chatBoxGetDb();
  return db.get(CHATBOX_SESSION_STORE, questionId);
}

export async function chatBoxSetSession(questionId: string, data: SessionData): Promise<void> {
  const db = await chatBoxGetDb();
  await db.put(CHATBOX_SESSION_STORE, data, questionId);
}

export async function chatBoxDeleteSession(questionId: string): Promise<void> {
  const db = await chatBoxGetDb();
  await db.delete(CHATBOX_SESSION_STORE, questionId);
}

export async function chatBoxGetMessages(questionId: string): Promise<ChatMessage[] | undefined> {
  const db = await chatBoxGetDb();
  return db.get(CHATBOX_MESSAGES_STORE, questionId);
}

export async function chatBoxSetMessages(questionId: string, messages: ChatMessage[]): Promise<void> {
  const db = await chatBoxGetDb();
  await db.put(CHATBOX_MESSAGES_STORE, messages, questionId);
}

export async function chatBoxDeleteMessages(questionId: string): Promise<void> {
  const db = await chatBoxGetDb();
  await db.delete(CHATBOX_MESSAGES_STORE, questionId);
}