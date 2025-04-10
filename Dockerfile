# Use official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy dependency definitions first (for Docker layer caching)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the app (server.js, public/, etc.)
COPY . .

# Set about.html as the default homepage (renames it to index.html)
RUN cp public/about.html public/index.html

# Expose port 3000 so we can access the app from outside the container
EXPOSE 3000

# Start the server using npm start (see package.json for script)
CMD ["npm", "start"]

# ================================
# HOW TO USE THIS DOCKERFILE
# (Make sure Docker Desktop is running)
#
# 1. Build the Docker image:
#    docker build -t ninertrack-app .
#        └── (Format: docker build -t [your-app-name] .)
#
# 2. Run the Docker container:
#    docker run -p 3000:3000 ninertrack-app
#
# 3. Open your browser (or just click the link in terminal):
#    http://localhost:3000
#
# NOTES:
# - The app will launch with about.html (renamed as index.html) as homepage.
# - You'll need to install nodemon locally if you use it in dev:
#       npm install --save-dev nodemon
# - For live local editing (hot-reloading):
#       docker run -p 3000:3000 -v ${PWD}:/app ninertrack-app
#
# ========== Dev Tips & Commands ==========

#  Hot reload while editing:
#    docker run -p 3000:3000 -v ${PWD}:/app ninertrack-app

#  See running containers:
#    docker ps

#  Stop a running container:
#    docker stop <container_id>

#  Remove a stopped container:
#    docker rm <container_id>

# Prune all stopped containers:
#    docker container prune
