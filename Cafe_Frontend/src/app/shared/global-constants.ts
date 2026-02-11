export class GlobalConstants {
  //message
  public static genericErrorMessage: string = "Something went wrong. Please try again later.";
  public static unauthorized: string = "You are not authorized to access this page.";
  public static productExistError: string = "Product already exists.";
  public static productAdded: string = "Product already successfully!";
  //regex
  public static nameRegex: String = "[a-zA-Z0-9 ]*";
  public static emailRegex: String = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";
  public static contactNumberRegex: String = "^[e0-9]{10,10}$";
  //variable
  public static error: String = "error";
}
