FROM oven/bun:1

WORKDIR /app
COPY . /app/

RUN bun install

RUN bunx prisma generate

ENTRYPOINT ["bun", "start"]
