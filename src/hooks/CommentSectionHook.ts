import { useState, useEffect } from 'react';
import { TableData, ApiResponse } from '../utils/types/type';




interface UseCommentsResult {
  comments: Comment[];
  meta: TableData<Comment>['meta'];
  loading: boolean;
  error: string | null;
  fetchComments: (page: number, pageSize: number) => void;
}

export const useComments = (): UseCommentsResult => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [meta, setMeta] = useState<TableData<Comment>['meta']>({
    current: 1,
    pageSize: 5,
    totalPages: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async (page: number, pageSize: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/comments?page=${page}&size=${pageSize}`
      );
      const data: ApiResponse<TableData<Comment>> = await response.json();

      if (data.statusCode === 200) {
        setComments(data.data.result);
        setMeta(data.data.meta);
      } else {
        setError(data.message || 'Failed to fetch comments');
      }
    } catch (err) {
      setError('An error occurred while fetching comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1, 5); // Fetch initial page
  }, []);

  return { comments, meta, loading, error, fetchComments };
};
