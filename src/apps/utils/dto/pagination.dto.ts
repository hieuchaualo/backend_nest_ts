export class Pagination {
  constructor(
    data: any,
    limit: number,
    currentPage: number,
    totalPages: number,
  ) {
    this.data = data;
    this.limit = limit;
    this.currentPage = currentPage;
    this.totalPages = totalPages;
  }

  data: any;
  limit: number;
  currentPage: number;
  totalPages: number;
}

export default Pagination;
