import {ParsedQs} from 'qs';

export interface PaginationQuery extends ParsedQs {
	page?: string;
	size?: string;
}


