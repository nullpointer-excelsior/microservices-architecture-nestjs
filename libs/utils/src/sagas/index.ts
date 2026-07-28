type StepDefinition = {
    name: string;
    transaction: string;
    ok: string;
    error: string;
    compensation: string;
    startBy?: string;
};

type SagaDefinition = {
    steps: StepDefinition[];
};

class SagaBuilder {
    private steps: StepDefinition[] = [];

    start(definition: StepDefinition): SagaBuilder {
        this.steps = [definition];
        return this;
    }

    step(definition: StepDefinition): SagaBuilder {
        this.steps.push(definition);
        return this;
    }

    build(): SagaDefinition {
        return { steps: [...this.steps] };
    }
}

class SagaFactory {
    builder(): SagaBuilder {
        return new SagaBuilder();
    }
}

export const Saga = new SagaFactory();
export type { SagaDefinition, StepDefinition };
