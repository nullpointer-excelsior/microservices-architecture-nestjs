import { SagaExecutionCoordinator } from "./saga-execution-coordinator";
import { Saga } from "../model/saga";
import { SagaResult } from "../model/saga.result";
import { StartSagaBuilder } from "./saga.builder";

describe('SagaExecutionCoordinator', () => {

    let coordinator: SagaExecutionCoordinator;
    let sagas: Saga[];

    beforeEach(() => {
        coordinator = SagaExecutionCoordinator.builder()
            .start({
                name: 'orders',
                transaction: 'create-order',
                ok: 'order-created',
                error: 'order-error',
                compensation: 'cancel-order'
            })
            .step({
                name: 'payments',
                startBy: 'order-created',
                transaction: 'create-payment',
                ok: 'payment-created',
                error: 'payment-error',
                compensation: 'cancel-payment'
            })
            .step({
                name: 'stock',
                startBy: 'payment-created',
                transaction: 'update-stock',
                ok: 'stock-updated',
                error: 'stock-error',
                compensation: 'cancel-stock'
            })
            .step({
                name: 'notification',
                startBy: 'stock-updated',
                transaction: 'send-notification',
                ok: 'notification-sent',
                error: 'notification-error',
                compensation: 'cancel-notification'
            })
            .build();
    });

    describe('execute', () => {
        it('should execute transaction and return SagaResult.ok if saga is found', async () => {
            const transaction = jest.fn().mockResolvedValue('TransactionResult');
            const expectedSagaResult = SagaResult.ok({
                queue: 'order-created',
                data: 'TransactionResult'
            });

            const result = await coordinator.execute<string>('orders', transaction);

            expect(result).toEqual(expectedSagaResult);
            expect(result.isSuccess).toBeTruthy();
            expect(transaction).toHaveBeenCalled();
        });

        it('should execute transaction and return SagaResult.error if an error occurs', async () => {
            const transaction = jest.fn().mockRejectedValue('TransactionError');
            const expectedSagaResult = SagaResult.error({
                queue: 'payment-error',
                error: 'TransactionError'
            });

            const result = await coordinator.execute('payments', transaction);

            expect(result).toEqual(expectedSagaResult);
            expect(result.isSuccess).toBeFalsy();
            expect(transaction).toHaveBeenCalled();
        });

        it('should reject with "Saga not found" if saga is not found', async () => {
            const transaction = jest.fn().mockResolvedValue('TransactionResult');

            await expect(coordinator.execute('StepNotFound', transaction)).rejects.toEqual('Saga not found');
            expect(transaction).not.toHaveBeenCalled();
        });
    });

    describe('rollback', () => {
        it('should return an array of compensations to rollback', () => {
            const expectedCompensations = ['cancel-payment', 'cancel-order'];

            const result = coordinator.rollback('stock');
            expect(result).toEqual(expectedCompensations);
        });

 

        it('should reject with "Saga not found" if saga is not found', async () => {
            const transaction = jest.fn().mockResolvedValue('InvalidSagaResult');

            await expect(coordinator.execute('StepNotFound', transaction)).rejects.toEqual('Saga not found');
            expect(transaction).not.toHaveBeenCalled();
        });
    });

    describe('builder', () => {
        it('should return a new instance of StartSagaBuilder', () => {
            const builder = SagaExecutionCoordinator.builder();
            expect(builder).toBeInstanceOf(StartSagaBuilder);
        });
    });
});