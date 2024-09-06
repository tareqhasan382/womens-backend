# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Copy .env file into the container
COPY .env .env

# Build the TypeScript application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=production

# Command to run your app
CMD ["npm", "start"]

