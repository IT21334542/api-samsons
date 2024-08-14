FROM node:20.1.0-alpine
WORKDIR /app
COPY . /app
RUN yarn install
RUN npx prisma generate
RUN yarn build
EXPOSE 5000
CMD yarn start
