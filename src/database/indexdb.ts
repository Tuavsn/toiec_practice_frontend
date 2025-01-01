import { DBSchema, openDB } from 'idb';
import { QuestionListByPart, TestDocument } from '../utils/types/type';

// Định nghĩa schema của IndexedDB
interface TestDB extends DBSchema {

    questionListByPart: {
        key: number; // Key là chỉ số (index) của phần (partNum)
        value: QuestionListByPart; // Giá trị là dữ liệu của questionList
    };
}

// Hàm khởi tạo cơ sở dữ liệu
const initDB = async () => {
    return openDB<TestDB>('TestDatabase', 1, {
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
    const db = await initDB(); // Mở database
    const tx = db.transaction('questionListByPart', 'readwrite'); // Tạo transaction cho questionListByPart
    const store = tx.objectStore('questionListByPart');

    // Thêm từng phần tử vào store, sử dụng index làm key
    await Promise.all(data.map((item, i) => store.put(item, i)));

    await tx.done; // Kết thúc transaction
    console.log('Dữ liệu questionListByPart đã được thêm thành công');
};

// Hàm truy vấn dữ liệu theo partNum
export const queryByPartIndex = async (partNum: number): Promise<QuestionListByPart> => {
    const db = await initDB(); // Mở database
    // Lấy dữ liệu từ questionListByPart
    const questions = await db.get('questionListByPart', partNum);

    // Kiểm tra nếu không có dữ liệu
    if (!questions) {
        console.error(`Không tìm thấy dữ liệu cho partNum: ${partNum}`);
        throw new Error(`Không tìm thấy dữ liệu cho partNum: ${partNum}`);
    }

    return questions // Trả về kết quả
};
