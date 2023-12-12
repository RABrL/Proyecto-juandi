FROM node:lts-alpine as base
WORKDIR /app

COPY package.json package-lock.json ./

FROM base AS prod-deps
RUN npm install --production

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules

COPY . .

RUN npm run migrate

CMD ["npm", "start"]