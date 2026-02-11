import { ObjectUtil } from "./ObjectUtil";
import { environment } from "@env/environment";
import { CryptoJsUtil } from "./CryptoJsUtil";

export class LocalStorageUtil {
  private static isStorageAvailable(): boolean {
    return typeof window !== 'undefined' && window.localStorage !== undefined;
  }

  /**
   * @description
   * Get an instance of LocalStorage.
   */
  public static getStorage(): LocalStorage {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage is not available in this environment');
      return {} as LocalStorage;
    }

    const storedData = localStorage.getItem(environment.appConfigName);
    if (!storedData) {
      return {} as LocalStorage;
    }

    try {
      const decryptedData = CryptoJsUtil.decrypt(storedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error parsing stored data:', error);
      return {} as LocalStorage;
    }
  }

  /**
   * @param data A local storage instance to save.
   *
   * @description
   * Make sure you use LocalStorageUtil.getStorage() method before
   * to get instance of LocalStorage. Edit the instance and use
   * LocalStorageUtil.setStorage() to set in the browser's localStorage.
   */
  public static setStorage(data: LocalStorage): void {
    if (!this.isStorageAvailable()) {
      console.warn('Cannot set storage: localStorage is not available');
      return;
    }

    try {
      const encryptedData = CryptoJsUtil.encrypt(JSON.stringify(data));
      localStorage.setItem(environment.appConfigName, encryptedData);
    } catch (error) {
      console.error('Error setting storage:', error);
    }
  }

  /**
   * @description
   * Passes empty JSON to clear the storage.
   */
  public static clearStorage(): void {
    if (!this.isStorageAvailable()) {
      console.warn('Cannot clear storage: localStorage is not available');
      return;
    }

    try {
      localStorage.removeItem(environment.appConfigName);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export class LocalStorage {
  at: string | undefined;
  rt: string | undefined;
  ty: string | undefined;
  et: string | undefined;
  username: string | undefined;
  applicantId: string | undefined;
  customerName: string | undefined;
  roleName: string | undefined;
  email: string | undefined;
  userId: string | undefined;
  userFullName: string | undefined;
  isDefaultPassword: boolean | undefined;
  isServerCompression: boolean | undefined;
  isImageCompression: boolean | undefined;
  isPdfCompression: boolean | undefined;
  isVideoCompression: boolean | undefined;
  isDefaultPasswordChanged: boolean | undefined;
  logsStream: any | undefined;
  isAutoDealer: boolean = false;
  dealerId: string | undefined;
}
