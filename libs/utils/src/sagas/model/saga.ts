
export class Saga {
    
    stepNumber: number;
    name: string;
    startBy: string;
    transaction: string;
    ok: string;
    error: string;
    compensation: string;

    static builder() {
        return new StartSagaBuilder()
    }

}

export type SagaOption = Omit<Saga, 'stepNumber'>;
export type SagaStartOption = Omit<SagaOption, 'startBy'>;

class StartSagaBuilder {

    private sagas: Saga[] = [];

    start(saga: SagaStartOption) {
        this.sagas.push({
            stepNumber: this.sagas.length + 1,
            startBy: '',
            ...saga
        });
        return new SagaBuilder(this.sagas);
    }
}

class SagaBuilder {

    constructor(private sagas: Saga[] = []) { };

    step(saga: SagaOption) {
        this.sagas.push({
            stepNumber: this.sagas.length + 1,
            ...saga
        });
        return this;
    }

    build() {
        return this.sagas;
    }

}