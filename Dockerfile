FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build:apps

FROM nginx:alpine AS host
COPY --from=build /usr/src/app/apps/host/dist /usr/share/nginx/html
COPY ./nginx/host.default.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

FROM nginx:alpine AS navi
COPY --from=build /usr/src/app/apps/navi/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

FROM nginx:alpine AS rinex-to-csv
COPY --from=build /usr/src/app/apps/rinex-to-csv/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

FROM nginx:alpine AS gecrec
COPY --from=build /usr/src/app/apps/gecrec/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

FROM nginx:alpine AS simurg_plotter
COPY --from=build /usr/src/app/apps/gecrec/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
