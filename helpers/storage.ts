import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
  static async getItem(key: string) {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') {
        return null;
      }
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  }
  static async removeItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.removeItem(key);
    }
    return AsyncStorage.removeItem(key);
  }
  static async setItem(key: string, value: any) {
    if (Platform.OS === 'web') {
      return localStorage.setItem(key, value);
    }
    return AsyncStorage.setItem(key, value);
  }
}

export default Storage;
