export enum CreateNotificationSaga {
    TRANSACTION = 'send-notification-transaction',
    COMPENSATION = 'notification-compensation',
    OK = 'notification-sent-ok',
    ERROR = 'notification-error'
}