export class ObjectUtil {
  static isEmpty(input: any) {
    return input === undefined || input === null || input === '' || input === 'null' || input === 'undefined' || input === 'Infinity' || input === '{}';
  }

  public static setUndefinedIfNull(input: any): any {
    return this.isEmpty(input) ? undefined : input;
  }
}
