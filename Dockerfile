
# Stage 1: Build the backend
FROM node:20 AS build

ARG MONGO_URL

# Set environment variables
ENV MONGO_URL=${MONGO_URL}

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --f


# Copy the source code
COPY . .

EXPOSE 5000

# Run the backend application in development mode with nodemon

CMD ["npm", "start"]
