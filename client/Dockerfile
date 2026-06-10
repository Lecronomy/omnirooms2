FROM denoland/deno:2.8.2

WORKDIR /app

COPY package.json .

RUN deno install

COPY . .

CMD ["run", "dev", "--host"]
