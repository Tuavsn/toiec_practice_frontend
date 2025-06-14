import { LectureCardRoadmap, MilestoneItem, TestCardRoadmap } from "../types/type";

/**
 * Phân bổ các bài giảng và bài test thành một lộ trình có cấu trúc và linh hoạt.
 * Các bài test sẽ đóng vai trò là các cột mốc chính. Tất cả các bài giảng (bắt buộc và tùy chọn)
 * sẽ được phân bổ đều vào giữa các cột mốc này.
 *
 * @param tests - Mảng các bài test.
 * @param lectures - Mảng TẤT CẢ các bài giảng (cả bắt buộc và tùy chọn).
 * @returns Một mảng các MilestoneItem đã được sắp xếp thành lộ trình.
 */
export const distributeRoadmapItems = (
    tests: TestCardRoadmap[],
    lectures: LectureCardRoadmap[]
): MilestoneItem[] => {
    //------------------------------------------------------
    // 1. Phân loại bài giảng 
    //------------------------------------------------------
    const mustTakeLectures: LectureCardRoadmap[] = [];
    const optionalLectures: LectureCardRoadmap[] = [];
    lectures.forEach((lecture) => {
        if (lecture.mustTake) {
            mustTakeLectures.push(lecture);
        } else {
            optionalLectures.push(lecture);
        }
    });

    //------------------------------------------------------
    // 2. Guard Clause & Fallback 
    //------------------------------------------------------
    // Nếu không có bài test nào, không thể tạo "chương".
    // Trả về danh sách bài giảng theo thứ tự ưu tiên: bắt buộc trước, tùy chọn sau.
    if (tests.length === 0) {
        console.warn('No tests provided. Returning a simple lecture list.');
        const allLectures = [...mustTakeLectures, ...optionalLectures];
        return allLectures.map(lec => ({ ...lec, type: 'lecture' }));
    }

    //------------------------------------------------------
    // 3. Phân bổ bài giảng vào các chương (*** NEW LOGIC ***)
    //------------------------------------------------------
    const numChapters = tests.length;
    // Tạo một mảng các "chương", mỗi chương ban đầu là một mảng rỗng.
    const chapters: MilestoneItem[][] = Array.from({ length: numChapters }, () => []);

    // Phân bổ các bài giảng bắt buộc vào các chương một cách tuần tự
    mustTakeLectures.forEach((lecture, index) => {
        chapters[index % numChapters].push({ ...lecture, type: 'lecture' });
    });

    // Tiếp tục phân bổ các bài giảng tùy chọn vào các chương
    optionalLectures.forEach((lecture, index) => {
        // Chúng ta tiếp tục vòng lặp phân bổ dựa trên tổng số bài giảng đã có
        const chapterIndex = (mustTakeLectures.length + index) % numChapters;
        chapters[chapterIndex].push({ ...lecture, type: 'lecture' });
    });


    //------------------------------------------------------
    // 4. Lắp ráp lộ trình cuối cùng (*** NEW LOGIC ***)
    //------------------------------------------------------
    const roadmap: MilestoneItem[] = [];
    chapters.forEach((chapterLectures, index) => {
        // Thêm tất cả bài giảng của chương hiện tại
        roadmap.push(...chapterLectures);
        // Thêm bài test tương ứng để kết thúc chương
        roadmap.push({ ...tests[index], type: 'test' });
    });

    return roadmap;
};