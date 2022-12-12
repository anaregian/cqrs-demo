FROM node:18-slim AS development

RUN apt-get update

RUN apt-get install -y openssl

RUN apt-get install -y procps

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run db:generate

RUN npm run build

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /src

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /src/dist ./dist

CMD ["node", "dist/apps/inventory/main"]