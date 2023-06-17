# Basisimage
FROM node:latest AS build
# Arbeitsverzeichnis erstellen
WORKDIR /app
# Abhängigkeiten installieren
COPY package*.json ./
RUN npm install
# Projektdateien kopieren und bauen
COPY . .
RUN npm run build

# Nginx-Image als Basis verwenden
FROM nginx:alpine
# Nginx-Konfiguration ersetzen
COPY nginx.conf /etc/nginx/nginx_original.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Angular-Build in Nginx-Verzeichnis kopieren
COPY --from=build /app/dist/frontend /usr/share/nginx/html
# Port freigeben
EXPOSE 80
# Nginx-Server starten
CMD ["nginx", "-g", "daemon off;"]
