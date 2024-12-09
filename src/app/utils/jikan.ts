const API_URL = 'https://api.jikan.moe/v4';

export interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
  order_by?: 'title' | 'start_date' | 'end_date' | 'episodes' | 'score' | 'rank' | 'popularity';
  sort?: 'desc' | 'asc';
  genres_exclude?:string
}

export const searchAnime = async ({
  q,
  page = 1,
  limit = 10,
  order_by = 'title',
  sort = 'asc',
  genres_exclude='12'
}: SearchParams) => {
  const params = new URLSearchParams({
    q,
    page: page.toString(),
    limit: limit.toString(),
    order_by,
    sort,
    genres_exclude
  });

  const response = await fetch(`${API_URL}/anime?${params}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};

