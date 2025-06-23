FROM node:22.16-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


FROM node:22.16-alpine AS production

WORKDIR /app

COPY --from=base /app ./

EXPOSE 4000

CMD ["npm", "start"]








