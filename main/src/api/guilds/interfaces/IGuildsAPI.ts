export interface IPagedRequest {
  per_page?: number;
  page?: number;
}

export interface IPagedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface IRequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string | object | undefined;
  version?: 1 | 2;
}