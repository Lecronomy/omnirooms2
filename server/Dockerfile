FROM denoland/deno:alpine-2.8.2

WORKDIR /app

COPY deno.json .

RUN deno install

COPY . .

CMD ["run", "--allow-env", "--allow-net", "--watch", "main.ts"]
