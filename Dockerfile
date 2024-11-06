# pull official base image
FROM node:20-bookworm-slim as base-image

# Install system dependencies
RUN apt-get update && apt-get install -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# set working directory
WORKDIR /usr/src/app

# add _/usr/src/app/node_modules/.bin_ to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install app dependencies
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

WORKDIR /usr/src/app

USER app
