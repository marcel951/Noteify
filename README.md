# Noteify
Noteify stellt das Abschlussprojekt des Wahlpflichtmodul "Secure Software Engineering" an der Technischen Hochschule Mittelhessen in Gießen der Gruppe L da.
Am Projekt beteiligt waren:
- Marcel Kaiser
- Jonathan Rech
- Benjamin Wirth

Die App ermöglicht es, im Browser Notizen anzulegen. Diese Notizen können privat und öffentlich geschaltet werden. Außerdem ist es möglich jeder Notiz ein Youtube-Video anzuhängen.

## Aktueller Status des Projekts
CODEQL
BACKENDTEST
ETC

## Das Projekt in Betrieb nehmen
### Mittels Docker
### Entwickler-Modus



# Intern

# Docker Commands für Container betrieb
## Build && run
sudo docker-compose up --build -d
### Das -d steht für Hintergrund


## Check State
sudo docker-compose ps

## Stop
sudo docker-compose down

# Docker Comands für Dev betrieb
## im Backend in der user.js && home.js den Datenbankhost auf localhost setzen

* sudo docker-compose build database
* sudo docker-compose up database -d
* mariadb --host 127.0.0.1 -P 3306 --user admin -padmin ==> Testen der DB Verbindung
* Es wird nur die Datenbank gestartet



# SSE_SoSe_2023_Projekt
* feat: The new feature you're adding to a particular application
* fix: A bug fix
* style: Feature and updates related to styling
* refactor: Refactoring a specific section of the codebase
* test: Everything related to testing
* docs: Everything related to documentation
* chore: Regular code maintenance.[ You can also use emojis to represent commit types]

