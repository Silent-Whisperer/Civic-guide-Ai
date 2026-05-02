# Use Node.js 20 lightweight image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy app source
COPY . .

# Expose the port (Cloud Run sets PORT env var)
EXPOSE 8080

# Start the application
CMD [ "npm", "start" ]
