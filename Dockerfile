FROM node:15-alpine

WORKDIR /InkoHX/HARZ

# Add package.json and lockfile
COPY package.json .
COPY yarn.lock .

# Install dependencies
RUN yarn install --prod --frozen-lockfile && \
  yarn cache clean

# Add source folder
COPY src ./src

ENTRYPOINT [ "node", "--unhandled-rejections=strict", "src/index.js" ]
