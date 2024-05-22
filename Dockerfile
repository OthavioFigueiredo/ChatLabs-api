FROM node:20.12.2
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json ./
RUN npm install
COPY . ./
EXPOSE 3000
CMD ["npm", "run", "start"]