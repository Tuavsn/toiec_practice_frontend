import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as api from '../../api/api';
import { emptyDate } from '../../utils/types/emptyValue';
import { LectureRow, Meta } from '../../utils/types/type';
import LecturePage from './LecturePage';

// Mock SetWebPageTitle to prevent DOM manipulation errors
jest.mock('../../utils/helperFunction/setTitlePage', () => ({
    __esModule: true,
    default: jest.fn(),
  }));

// Mock các dependencies
jest.mock('../../api/api', () => ({
  // Explicitly type the mock function with jest.Mock
  callGetLectureCard: jest.fn() as jest.Mock,
}));

describe('LecturePage Component', () => {
  // Dữ liệu mô phỏng cho các bài học
  const mockLectures: LectureRow[] = [
    {
      id: '1',
      name: 'Lecture 1',
      topic: [{
        createdAt: emptyDate,
        updatedAt: emptyDate,
        id: 'topic1',
        name: 'Topic A',
        solution: 'Solution A',
        overallSkill: 'Từ vựng',
        active: true
      }],
      createdAt: emptyDate,
      updatedAt: emptyDate,
      active: true
    },
    {
      id: '2',
      name: 'Lecture 2',
      topic: [{
        createdAt: emptyDate,
        updatedAt: emptyDate,
        id: 'topic2',
        name: 'Topic B',
        solution: 'Solution B',
        overallSkill: 'Ngữ pháp',
        active: true
      }],
      createdAt: emptyDate,
      updatedAt: emptyDate,
      active: true
    },
  ];

  beforeEach(() => {
    // Mock dữ liệu trả về từ API call
    (api.callGetLectureCard as jest.Mock).mockResolvedValue({
      result: mockLectures,
      meta: { current: 1, pageSize: 5, totalPages: 2, totalItems: 10 } as Meta,
    });
  });

  test('nên render trang đúng cách', async () => {
    render(<LecturePage />);

    // Kiểm tra tiêu đề trang
    expect(screen.getByText('Các bài học nên thử')).toBeInTheDocument();

    // Kiểm tra trường input tìm kiếm có xuất hiện
    expect(screen.getByPlaceholderText('Tìm bài học...')).toBeInTheDocument();

    // Kiểm tra các bài học được render
    await waitFor(() => expect(screen.getByTestId('lecture-list')).toBeInTheDocument());
    expect(screen.getByTestId('lecture-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('lecture-card-2')).toBeInTheDocument();
  });

  test('nên lọc các bài học theo từ khóa tìm kiếm', async () => {
    render(<LecturePage />);

    // Mô phỏng việc gõ vào trường tìm kiếm
    fireEvent.change(screen.getByTestId('lecture-search-input'), { target: { value: 'Lecture 1' } });

    // Chờ cho danh sách bài học được lọc
    await waitFor(() => expect(screen.getByTestId('lecture-card-1')).toBeInTheDocument());
    expect(screen.queryByTestId('lecture-card-2')).not.toBeInTheDocument();
  });

  test('nên hiển thị skeleton loader khi không có bài học', async () => {
    // Mock dữ liệu trả về là null
    (api.callGetLectureCard as jest.Mock).mockResolvedValueOnce(null);

    render(<LecturePage />);

    // Chờ cho skeleton loader xuất hiện
    await waitFor(() => expect(screen.getByTestId('lecture-skeletons')).toBeInTheDocument());
  });

  test('nên xử lý phân trang đúng cách', async () => {
    render(<LecturePage />);

    // Mô phỏng thay đổi trang
    fireEvent.click(screen.getByTestId('lecture-paginator'));

    // Kiểm tra API được gọi với index trang mới
    expect(api.callGetLectureCard).toHaveBeenCalledWith(1); // Giả sử pageIndex bắt đầu từ 0
  });

  test('nên xử lý lỗi khi gọi API bị null', async () => {
    // Mock dữ liệu trả về là null
    (api.callGetLectureCard as jest.Mock).mockResolvedValueOnce(null);

    render(<LecturePage />);

    // Vì không có thay đổi UI cho trường hợp lỗi, chỉ cần đảm bảo không bị crash
    await waitFor(() => expect(screen.getByTestId('lecture-list')).toBeInTheDocument());
  });
});
