FROM node:16-alpine
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3070
CMD [ "node", "main.js"]