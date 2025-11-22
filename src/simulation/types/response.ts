export interface IBaseResponse<T> {
  data: T;
}

export interface IBaseData<TParams = Record<string, unknown>> {
  label: string;
  unit: string;
  years: number[];
  parameters: TParams;
}

export interface Params {
  name: string;
  average: number;
  growth: (number | null)[];
  values: (number | null)[];
}

export type IApiData = IBaseData<Omit<Params, "average" | "growth">[]>;
export type IBaselineData = IBaseData<Params[]>;
export type IApiRes = IBaseResponse<IApiData>;
