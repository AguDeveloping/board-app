FROM node:24-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY /src ./src
COPY /public ./public
COPY .env .

# Build the production app
RUN npm run build

# Install serve globally to serve the build
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 4000

# Command to serve the production build
CMD ["serve", "-s", "build", "-l", "4000"]