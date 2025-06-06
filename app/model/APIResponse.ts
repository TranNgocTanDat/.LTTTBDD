

export interface APIResponse<T> {
  data: any;
  code: number;
  result: T;
}