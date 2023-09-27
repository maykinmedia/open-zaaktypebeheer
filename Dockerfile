# Stage 1 - Backend build environment
# includes compilers and build tooling to create the environment
FROM python:3.10.9-slim-bullseye AS backend-build

RUN apt-get update && apt-get install -y --no-install-recommends \
        pkg-config \
        build-essential \
        git \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN mkdir /app/src

# Ensure we use the latest version of pip
RUN pip install pip setuptools -U
COPY ./backend/requirements /app/requirements
RUN pip install -r requirements/production.txt

# Stage 2 - Build JS of the backend (needed for admin styles)
FROM node:18-bullseye-slim AS backend-js-build

WORKDIR /app

COPY ./backend/build /app/build/
COPY ./backend/*.json ./backend/*.js ./backend/.babelrc /app/

RUN npm ci

COPY ./backend/src /app/src

RUN npm run build

# Stage 3 - Build the Front end
FROM node:18-bullseye-slim AS frontend-build

RUN mkdir /ui
WORKDIR /ui

RUN apt-get update && apt-get install -y --no-install-recommends \
  git \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY ./ui/.env.production.template ./.env.production
COPY ./ui/package-lock.json ./ui/package.json ./

# TODO: Remove legacy options once install is fixed
RUN npm ci --legacy-peer-deps

COPY ./ui .
COPY ./ui/.env.production.template ./.env.production

RUN npm run build

# Stage 4 - Build docker image suitable for production
FROM python:3.10.9-slim-bullseye

# Stage 4.1 - Set up the needed production dependencies
# install all the dependencies for GeoDjango
RUN apt-get update && apt-get install -y --no-install-recommends \
        procps \
        vim \
        mime-support \
        postgresql-client \
        gettext \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY ./backend/bin/docker_start.sh /start.sh

RUN mkdir -p /app/log /app/media /app/src/open_zaaktypebeheer/static/

COPY ./ui/scripts/replace-envvars.sh /app/src/open_zaaktypebeheer/static/ui/replace-envvars.sh

# copy backend build deps
COPY --from=backend-build /usr/local/lib/python3.10 /usr/local/lib/python3.10
COPY --from=backend-build /usr/local/bin/uwsgi /usr/local/bin/uwsgi

COPY ./backend/src /app/src

COPY --from=backend-js-build /app/src/open_zaaktypebeheer/static/bundles /app/src/open_zaaktypebeheer/static/bundles
COPY --from=frontend-build /ui/dist /app/src/open_zaaktypebeheer/static/ui

RUN useradd -M -u 1000 maykin && chown -R maykin:maykin /app

VOLUME ["/app/log", "/app/media"]

# drop privileges
USER maykin

ARG COMMIT_HASH
ARG RELEASE=latest

ENV RELEASE=${RELEASE} \
    GIT_SHA=${COMMIT_HASH} \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=open_zaaktypebeheer.conf.docker

ARG SECRET_KEY=dummy

LABEL org.label-schema.vcs-ref=$COMMIT_HASH \
      org.label-schema.vcs-url="https://github.com/maykinmedia/open-zaaktypebeheer" \
      org.label-schema.version=$RELEASE \
      org.label-schema.name="open_zaaktypebeheer"

RUN python src/manage.py collectstatic --noinput \
    && python src/manage.py compilemessages

RUN chmod +x /app/static/ui/replace-envvars.sh

EXPOSE 8000
CMD ["/start.sh"]
