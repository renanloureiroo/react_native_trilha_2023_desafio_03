import { Key } from "./keys";

export interface IStorage {
  save(key: Key, data: any): Promise<void>;
  get<T = any>(key: Key): Promise<T>;
  delete(key: Key): Promise<void>;
  clearAll(): Promise<void>;
}
