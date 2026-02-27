FROM --platform=linux/x86-64 node:20-alpine

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY ./package.json ./yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

EXPOSE 4000
CMD ["yarn", "preview", "--port", "4000", "--host"]