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

# Start the server using nodemon (good for local development + auto reload)
CMD ["npm", "run", "dev"]

# ================================
# HOW TO USE THIS DOCKERFILE
# (Make sure Docker Desktop is running!)
#
# 1. Build the Docker image:
#    docker build -t ninertrack-app .
#        └── (Format: docker build -t [your-app-name] .)
#
# 2. Run the Docker container:
#    docker run -p 3000:3000 ninertrack-app
#
# 3. Open your browser:
#    http://localhost:3000
#
# NOTES:
# - The app will launch with about.html (renamed as index.html) as homepage.
# - Nodemon allows auto-reload when files change (dev-friendly).
# - You'll need to install nodemon locally since it's not in version control:
#       npm install --save-dev nodemon
#
# - For full hot reload (with file watching):
#       docker run -p 3000:3000 -v ${PWD}:/app ninertrack-app
#
# ================================
