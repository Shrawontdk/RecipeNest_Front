export enum AlertType {
  SUCCESS = 'Success',
  ERROR = 'Error',
  INFO = 'Info',
  WARNING = 'Warning',
  DANGER = 'Danger'
}

export class Alert {
  constructor(readonly type: AlertType) {
  }
}

