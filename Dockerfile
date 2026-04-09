FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_APP_TITLE=Sistema Medico Frontend
ARG VITE_API_URL=/api
ARG VITE_AUTH_LOGIN_PATH=auth/login
ARG VITE_AUTH_ME_PATH=auth/me
ARG VITE_AUTH_REFRESH_PATH=auth/refresh
ARG VITE_ENABLE_REFRESH=true
ENV VITE_APP_TITLE=$VITE_APP_TITLE
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_LOGIN_PATH=$VITE_AUTH_LOGIN_PATH
ENV VITE_AUTH_ME_PATH=$VITE_AUTH_ME_PATH
ENV VITE_AUTH_REFRESH_PATH=$VITE_AUTH_REFRESH_PATH
ENV VITE_ENABLE_REFRESH=$VITE_ENABLE_REFRESH
RUN npm run build

FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist ./
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
