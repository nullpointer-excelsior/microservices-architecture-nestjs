import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";

describe('OpenTelemetry resource attributes', () => {
    it('builds a resource with service.name, service.version and namespace', () => {
        const resource = resourceFromAttributes({
            [ATTR_SERVICE_NAME]: 'unit-test-svc',
            [ATTR_SERVICE_VERSION]: '1.2.3',
            'service.namespace': 'local-machine.spotify-clone',
        });

        const attributes = (resource as any).attributes ?? (resource as any)._attributes;
        expect(attributes[ATTR_SERVICE_NAME]).toBe('unit-test-svc');
        expect(attributes[ATTR_SERVICE_VERSION]).toBe('1.2.3');
        expect(attributes['service.namespace']).toBe('local-machine.spotify-clone');
    });
});
