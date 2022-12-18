FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Bundle app source
COPY . .

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["yarn", "run", "vite", "--host"]
