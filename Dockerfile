FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy game files
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY levels.js /usr/share/nginx/html/
COPY game.js /usr/share/nginx/html/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
