import * as CryptoJS from 'crypto-js';
import {environment} from "@env/environment";

export class CryptoJsUtil {
  /**
   * @param data An input to encrypt.
   * */
  public static encrypt(data: any): string {
    return CryptoJS.AES.encrypt(
      data,
      environment.appConfigStorageKey
    ).toString();
  }

  /**
   * @param data An encrypted stream of data or object.
   * */
  public static decrypt(data: any): string {
    return CryptoJS.AES.decrypt(data, environment.appConfigStorageKey).toString(
      CryptoJS.enc.Utf8
    );
  }
}
