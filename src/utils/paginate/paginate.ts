import { IPaginateData, IPaginateDataResult } from './paginate.interface';

export function paginate<T>({
  count,
  data,
  limit,
  page,
}: IPaginateData): IPaginateDataResult<T> {
  const lastPage = Math.ceil(count / limit);
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;

  return {
    data: [...data],
    count: count,
    currentPage: page,
    nextPage: nextPage,
    prevPage: prevPage,
    lastPage: lastPage,
  };
}
