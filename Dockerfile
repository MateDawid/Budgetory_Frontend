FROM node:20-bookworm-slim as base-image

# Install system dependencies
RUN apt-get update && apt-get install -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install --production
RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

# Copy app
COPY . .

FROM base-image as release-image

RUN addgroup --gid 1001 --system app && \
    adduser --no-create-home --shell /bin/false --disabled-password --uid 1001 --system --group app

RUN chmod +x .

WORKDIR /app

USER app
