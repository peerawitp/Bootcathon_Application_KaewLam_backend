FROM oven/bun:1

WORKDIR /app
COPY . /app/

RUN apt update \
  && apt install -y curl

ARG NODE_VERSION=18
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
  && bash n $NODE_VERSION \
  && rm n \
  && npm install -g n

RUN bun install

RUN bunx prisma generate

ENTRYPOINT ["bun", "start"]
