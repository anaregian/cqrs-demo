FROM --platform=linux/amd64 node:18-alpine AS development

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM --platform=linux/amd64 node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /src

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /src/dist ./dist

CMD ["node", "dist/main"]