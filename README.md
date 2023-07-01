# Noteify
[![Backend-Test](https://github.com/marcel951/Noteify/actions/workflows/BackendTest.yml/badge.svg)](https://github.com/marcel951/Noteify/actions/workflows/BackendTest.yml)
[![FontendTest.yml ](https://github.com/marcel951/SSE_SoSe_2023_Projekt/actions/workflows/FontendTest.yml/badge.svg)](https://github.com/marcel951/SSE_SoSe_2023_Projekt/actions/workflows/FontendTest.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/marcel951/Noteify/blob/main/LICENSE)

Noteify stellt das Abschlussprojekt des Wahlpflichtmodul "Secure Software Engineering" an der Technischen Hochschule Mittelhessen in Gießen der Gruppe L da.

Die App ermöglicht es, im Browser Notizen anzulegen. Diese Notizen können privat und öffentlich geschaltet werden. Außerdem ist es möglich jeder Notiz ein Youtube-Video anzuhängen.

## Important
Dieses Projekt ist nicht für den realen Betrieb gedacht. Es wird nicht mehr aktualisiert und gepflegt, da das Abschlussprojekt abgeschlossen ist.
Der Master-Branch stellt die aktuelle Stable-Version da.

## Das Projekt in Betrieb nehmen
### Mittels Docker
### Entwickler-Modus


## Contributors
Am Projekt beteiligt waren alle Mitglieder der "Gruppe L".

* [@marcel951 (Marcel Kaiser)](https://github.com/marcel951)
* [@JonathanRech (Jonathan Rech)](https://github.com/JonathanRech)
* [@wrth1337 (Benjamin Wirth)](https://github.com/wrth1337)



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

