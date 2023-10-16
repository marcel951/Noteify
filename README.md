# Noteify
[![Backend-Test](https://github.com/marcel951/Noteify/actions/workflows/BackendTest.yml/badge.svg)](https://github.com/marcel951/Noteify/actions/workflows/BackendTest.yml)
[![FontendTest.yml ](https://github.com/marcel951/SSE_SoSe_2023_Projekt/actions/workflows/FontendTest.yml/badge.svg)](https://github.com/marcel951/SSE_SoSe_2023_Projekt/actions/workflows/FontendTest.yml)
[![CodeQL](https://github.com/marcel951/Noteify/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/marcel951/Noteify/actions/workflows/github-code-scanning/codeql)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/marcel951/Noteify/blob/main/LICENSE)

Noteify represents the final project of the elective module "Secure Software Engineering" at the Technische Hochschule Mittelhessen in Gießen by Group L.

The app allows you to create notes in the browser. These notes can be set to private or public. Additionally, it is possible to attach a YouTube video to each note.

## Important
This project is not intended for real-world operation. It is no longer being updated or maintained since the final project has been completed. The master branch represents the current stable version.

## Das Projekt in Betrieb nehmen
### Mittels Docker
Attention! There are two SSL certificates in the project. These are EXCLUSIVELY intended for development and testing purposes! If the application is to be used in a production environment, individually created SSL certificates must be used. These MUST NOT be published on GitHub or any other platforms.

1. Clone the project: ```git clone git@github.com:marcel951/Noteify.git```
2. Change to the cloned Noteify directory.
3. Install Docker Compose (if not already installed):```sudo apt update &&sudo apt install docker-compose```
4. Build the containers using Docker Compose: ```sudo docker-compose build```
5. Start the containers: ```sudo docker-compose up -d```
6. Check the status: ```sudo docker-compose ps```
7. Access the web application via https://localhost
   
CAUTION!!!
Self-signed certificates are used for development and testing purposes, and these are by default rejected by the browser. To bypass this, they need to be marked as trusted. If the backend is not accessible, this is also due to the lack of trust in the certificates. You can also add these as exceptions by visiting https://localhost:4000.

## Stopping the Container
```sudo docker-compose down```


## Contributors
All members of "Group L" were involved in the project.

* [@marcel951 (Marcel Kaiser)](https://github.com/marcel951)
* [@JonathanRech (Jonathan Rech)](https://github.com/JonathanRech)
* [@wrth1337 (Benjamin Wirth)](https://github.com/wrth1337)
