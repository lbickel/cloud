FROM node:slim
EXPOSE 3000
WORKDIR /app
COPY package.json /app/
COPY tsconfig.json /app/
COPY tslint.json /app/
RUN npm install
RUN apt-get update -y && apt-get install -y openssl
COPY src /app/src
COPY routes /app/routes
COPY prisma /app/prisma
CMD npm run dev
