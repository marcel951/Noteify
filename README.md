# Noteify
[![Backend-Test](https://github.com/marcel951/Noteify/actions/workflows/BackendTest.yml/badge.svg)](https://github.com/marcel951/Noteify/actions/workflows/BackendTest.yml)
[![FontendTest.yml ](https://github.com/marcel951/SSE_SoSe_2023_Projekt/actions/workflows/FontendTest.yml/badge.svg)](https://github.com/marcel951/SSE_SoSe_2023_Projekt/actions/workflows/FontendTest.yml)
[![CodeQL](https://github.com/marcel951/Noteify/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/marcel951/Noteify/actions/workflows/github-code-scanning/codeql)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/marcel951/Noteify/blob/main/LICENSE)

Noteify stellt das Abschlussprojekt des Wahlpflichtmodul "Secure Software Engineering" an der Technischen Hochschule Mittelhessen in Gießen der Gruppe L da.

Die App ermöglicht es, im Browser Notizen anzulegen. Diese Notizen können privat und öffentlich geschaltet werden. Außerdem ist es möglich jeder Notiz ein Youtube-Video anzuhängen.

## Important
Dieses Projekt ist nicht für den realen Betrieb gedacht. Es wird nicht mehr aktualisiert und gepflegt, da das Abschlussprojekt abgeschlossen ist.
Der Master-Branch stellt die aktuelle Stable-Version da.

## Das Projekt in Betrieb nehmen
### Mittels Docker
Achtung! Im Projekt befinnden sich an 2 Stellen SSL Zertifikate. Diese sind AUSSCHLIEßLICH für Entwicklungs und testzwecke gedacht! Wenn die Anwendung produktiv genutzt werden soll, müssen zwingend individuell erstellte SSL Zertifikate verwendet werden. Diese dürfen NICHT! auf GitHub oder anderen Platformen veröffentlicht werden. 

1. Klonen des Projekts ```git clone git@github.com:marcel951/Noteify.git```
2. Wechseln in das geklonte Notify Verzeichnis
3. Installieren von Docker-Compose (falls noch nicht vorhanden)```sudo apt update &&sudo apt install docker-compose```
4. Bauen der Container mittels Docker Compose```sudo docker-compose build```
5. Starten der Container ```sudo docker-compose up -d```
6. Prüfen des Status ```sudo docker-compose ps```
7. Zugriff auf die Webanwendung über https://localhost
   
ACHTUNG!!!
Es werden zu entwicklungs und Test zwecken selbst-signierte Zertifikate verwendet, diese werden Standardmäßig vom Browser abgelehnt. Um dies zu umgehen müssen diese als Vertrauenswürdig markiert werden.
Falls das Backend nicht erreichbar ist, liegt dies ebenfalls an der fehlenden Vertrauensstellung zu den Zertifikaten. Diese können abenfalls über den Aufruf von https://localhost:4000 als Ausnahme hinzugefügt werden. 

## Stop des Containers
```sudo docker-compose down```


## Contributors
Am Projekt beteiligt waren alle Mitglieder der "Gruppe L".

* [@marcel951 (Marcel Kaiser)](https://github.com/marcel951)
* [@JonathanRech (Jonathan Rech)](https://github.com/JonathanRech)
* [@wrth1337 (Benjamin Wirth)](https://github.com/wrth1337)
