import { Module } from '@nestjs/common';
import { Saga } from './model/saga';
import { SagaExecutionCoordinator } from './providers/saga-execution-coordinator';


@Module({})
export class SagasModule {
    static forRoot(sagas: Saga[]) {
        return {
            module: SagasModule,
            controllers: [],
            providers: [
                {
                    provide: SagaExecutionCoordinator,
                    useValue: new SagaExecutionCoordinator(sagas)
                }
            ],
            exports: [
                {
                    provide: SagaExecutionCoordinator,
                    useValue: new SagaExecutionCoordinator(sagas)
                },
            ]
        };
    }
}
