import {
    type Span,
    SpanKind,
    context,
    propagation,
    SpanStatusCode,
} from "@opentelemetry/api"
import {
    type AxiosResponse,
    type AxiosHeaderValue,
    type InternalAxiosRequestConfig,
    AxiosError,
} from "axios"
import { SemanticAttributes } from "@opentelemetry/semantic-conventions"

export type InternalAxiosRequestConfigWithSpan = InternalAxiosRequestConfig & {
    span: Span
}

export function setPropagation(tracer: any, config: InternalAxiosRequestConfigWithSpan): InternalAxiosRequestConfig {
    const span: Span = tracer.startSpan(
        `axios ${config.method}`,
        {
            kind: SpanKind.CLIENT,
            attributes: {
                [SemanticAttributes.HTTP_URL]: config.url,
                [SemanticAttributes.HTTP_METHOD]: config.method,
            },
        },
        context.active(),
    )
    config.span = span
    const headers: Record<string, AxiosHeaderValue> = {}
    propagation.inject(context.active(), headers)
    for (const header in headers) {
        config.headers.set(header, headers[header])
    }
    return config
}

export function injectFromResponse(response: AxiosResponse<any, any> | AxiosError): AxiosResponse<any, any> {
    const span = (response.config as InternalAxiosRequestConfigWithSpan).span
    if (!(response instanceof AxiosError)) {
        span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, response.status)
        span.setAttribute("http.response.body", JSON.stringify(response.data))
    } else {
        span.setAttribute(
            SemanticAttributes.HTTP_STATUS_CODE,
            response.response?.status ?? 0,
        )
        span.setStatus({ code: SpanStatusCode.ERROR })
        if (response.response?.data) {
            span.setAttribute(
                "http.response.body",
                JSON.stringify(response.response.data),
            )
        }
    }
    span.end()

    if (response instanceof Error) {
        throw response
    } else {
        return response
    }
}