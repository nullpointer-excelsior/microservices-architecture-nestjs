interface IntrumentationConfig {
    serviceName: string;
    serviceVersion: string;
}

class IntrumentationConfigRepository {

    private data: IntrumentationConfig

    save(data: IntrumentationConfig) {
        this.data = data
    }

    getResourceConfig() {
        return {
            service: this.data.serviceName,
            version: this.data.serviceVersion
        }
    }
}

export const instrumentationConfigRepository = new IntrumentationConfigRepository()