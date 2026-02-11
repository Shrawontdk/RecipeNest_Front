import {environment} from "@env/environment";

export class ApiConfig {
  public static URL = environment.apiUrl + '/v1';
}
