import { paginate } from './paginate';
import { IPaginateData } from './paginate.interface';

describe('PaginateHelper', () => {
  it('should be defined', () => {
    expect(paginate).toBeDefined();
  });

  it('paginate should return correct pagination', () => {
    const paginateData: IPaginateData = {
      count: 15,
      data: [],
      limit: 10,
      page: 1,
    };
    const result = paginate(paginateData);

    expect(result).toMatchObject({
      data: [],
      count: 15,
      currentPage: 1,
      nextPage: 2,
      prevPage: null,
      lastPage: 2,
    });
  });
});
