import AsyncStorage from "@react-native-async-storage/async-storage";
import { IStorage } from "../Storage";
import { Key, keys } from "../keys";

export class StorageAsyncStorage implements IStorage {
  async save(key: Key, data: any): Promise<void> {
    return AsyncStorage.setItem(keys[key], JSON.stringify(data));
  }
  async get<T = any>(key: Key): Promise<T> {
    return AsyncStorage.getItem(keys[key]).then((data) =>
      data ? JSON.parse(data) : null
    );
  }
  async delete(key: Key): Promise<void> {
    return AsyncStorage.removeItem(keys[key]);
  }
  async clearAll(): Promise<void> {
    return AsyncStorage.clear();
  }
}
