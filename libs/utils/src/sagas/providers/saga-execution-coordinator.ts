import { Saga } from "../model/saga";
import { SagaResult } from "../model/saga.result";
import { StartSagaBuilder } from "./saga.builder";

export class SagaExecutionCoordinator {

    constructor(private sagas: Saga[]) { }

    async execute<T>(step: string, transaction: () => Promise<T>) {
        const saga = this.sagas.find(s => s.name === step);
        if (saga) {
            return transaction()
                .then((result) => {
                    return SagaResult.ok({
                        queue: saga.ok,
                        data: result
                    });
                })
                .catch((error) => {
                    return SagaResult.error({
                        queue: saga.error,
                        error: error
                    });
                });
        }
        return Promise.reject('Saga not found');
    }

    forward(step: string, message: any) {
        const saga = this.sagas.find(s => s.startBy === step);
        return saga.transaction
    }

    rollback(step: string) {
        const saga = this.sagas.find(s => s.name === step);
        if (saga) {
            const toRollback = this.sagas
                .filter(s => s.stepNumber < saga.stepNumber)
                .sort((a, b) => b.stepNumber - a.stepNumber);
            return toRollback.map(step => step.compensation);
        }
        throw new Error('Saga not found');
    }

    static builder() {
        return new StartSagaBuilder()
    }

}