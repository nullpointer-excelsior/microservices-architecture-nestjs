FROM node:18-alpine3.20 AS build

ARG PUBLIC_SPOTIFY_CLONE_BACKEND_URL

WORKDIR /builder
RUN apk --no-cache add git
RUN git clone --depth 1 https://github.com/nullpointer-excelsior/spotify-clone-frontend.git /builder
RUN npm install && npx astro build

FROM node:18-alpine3.20
WORKDIR /app
COPY --from=build /builder/dist /app
COPY --from=build /builder/node_modules /app/node_modules
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
ENTRYPOINT [ "node", "/app/server/entry.mjs" ]