import { SearchParams } from "../SearchForm/types.ts";

export type SearchParamsHistory = SearchParams & {
  date: string;
};
