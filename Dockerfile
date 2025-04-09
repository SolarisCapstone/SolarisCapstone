# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port your server listens on
EXPOSE 3000

# Start the server
CMD ["node", "dockerserver.js"]

