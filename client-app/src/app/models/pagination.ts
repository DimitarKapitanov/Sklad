export default interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedResult<T> {
    data: T;
    pagination: Pagination;
    search: string;

    constructor(data: T, pagination: Pagination, search: string) {
        this.data = data;
        this.pagination = pagination;
        this.search = search;
    }
}

export class PagingParams {
    pageNumber;
    pageSize;

    constructor(pageNumber = 1, pageSize = 20,) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}