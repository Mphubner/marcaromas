FROM node:20-slim
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma schema BEFORE npm install (needed for postinstall)
COPY prisma ./prisma/

# Install dependencies (this will run postinstall and prisma generate)
RUN npm ci --production

# Copy rest of application
COPY . .

# Expose port
EXPOSE 5001

# Start server
CMD ["node", "src/server.js"]
