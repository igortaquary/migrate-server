export interface IPaginateData {
  count: number;

  data: any[];

  page: number;

  limit: number;
}
export interface IPaginateDataResult<T> {
  data: Array<T>;
  count: number;
  currentPage: number;
  nextPage: number;
  prevPage: number;
  lastPage: number;
}
