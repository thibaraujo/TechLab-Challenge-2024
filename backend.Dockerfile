FROM node:20-alpine

COPY . ./app

WORKDIR /app

RUN yarn install

# Adicione este comando para copiar o script
COPY init_db.js ./

VOLUME ./backend/src:/app/backend/src

ENTRYPOINT node init_db.js & yarn workspace techlab-challenge-2024-3q-backend dev
