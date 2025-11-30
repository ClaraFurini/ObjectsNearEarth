FROM node:lts
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production --ignore-scripts && npm cache clean --force
COPY src ./src
EXPOSE 3001
CMD ["npm", "start"]
