import { Saga } from './index';

describe('Saga builder', () => {
    it('builds a saga with a start step and additional steps', () => {
        const definition = Saga.builder()
            .start({
                name: 'orders',
                transaction: 'create-order',
                ok: 'order-created',
                error: 'order-error',
                compensation: 'cancel-order',
            })
            .step({
                name: 'payments',
                startBy: 'order-created',
                transaction: 'create-payment',
                ok: 'payment-created',
                error: 'payment-error',
                compensation: 'cancel-payment',
            })
            .step({
                name: 'stock',
                startBy: 'payment-created',
                transaction: 'update-stock',
                ok: 'stock-updated',
                error: 'stock-error',
                compensation: 'cancel-stock',
            })
            .build();

        expect(definition.steps).toHaveLength(3);
        expect(definition.steps[0]).toMatchObject({ name: 'orders', transaction: 'create-order' });
        expect(definition.steps[1]).toMatchObject({ name: 'payments', startBy: 'order-created' });
        expect(definition.steps[2]).toMatchObject({ name: 'stock', startBy: 'payment-created' });
    });

    it('returns a new array on each build so external mutation cannot leak in', () => {
        const builder = Saga.builder().start({
            name: 'orders',
            transaction: 'create-order',
            ok: 'order-created',
            error: 'order-error',
            compensation: 'cancel-order',
        });
        const first = builder.build();
        first.steps.push({} as any);

        const second = builder.build();
        expect(second.steps).toHaveLength(1);
    });
});
