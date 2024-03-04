export enum CreateOrderSaga {
    TRANSACTION = 'create-order-transaction',
    COMPENSATION = 'order-compensation',
    OK = 'order-created-ok',
    ERROR = 'order-error'
}