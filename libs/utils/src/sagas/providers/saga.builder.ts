import { Saga } from "../model/saga";
import { SagaExecutionCoordinator } from "./saga-execution-coordinator";

export type SagaOption = Omit<Saga, 'stepNumber'>;
export type SagaStartOption = Omit<SagaOption, 'startBy'>;

export class StartSagaBuilder {

    private sagas: Saga[] = [];

    start(saga: SagaStartOption) {
        this.sagas.push({
            stepNumber: this.sagas.length + 1,
            startBy: '',
            ...saga
        });
        return new StepSagaBuilder(this.sagas);
    }
}

export class StepSagaBuilder {

    constructor(private sagas: Saga[] = []) { };

    step(saga: SagaOption) {
        this.sagas.push({
            stepNumber: this.sagas.length + 1,
            ...saga
        });
        return this;
    }

    build() {
        return new SagaExecutionCoordinator(this.sagas);
    }

}