# Beschreibung
## Kurzbeschreibung
"Noteify" ist eine Anwendung, die entwickelt wurde, um Nutzern beim Organisieren und Verwalten ihrer Notizen zu helfen. Die Anwendung bietet eine benutzerfreundliche Oberfläche, die es den Benutzern ermöglicht, Notizen zu erstellen, zu bearbeiten und zu speichern. Die Anwendung bietet auch Funktionen wie die Möglichkeit, Notizen zu teilen, Youtube-Videos einer Notiz anzuhängen. Eine erweiterte Suchfunktion ist ebenfalls in der Anwendung enthalten.

## Entwickler
Die Anwendung wurde von Gruppe L entwickelt.
- Marcel Kaiser
- Jonathan Rech
- Benjamin Wirth

## Verwendete Technologien
Im Frontend wird das Framework "Angular" in Verbindung mit dem CSS-Framework "Bootstrap" verwendet.
Im Backend kommt Express.js zum Einsatz, sowie eine Datenbank in form von MariaDB.


# Infrastruktur
## CI/CD
## Verwendete IDE
Zum entwickeln der Angular-Komponenten, sowie der API-Abfragen in Express wurde von allen drei Gruppenmitgliedern "Visual Studio Code" inklusive der passenden Erweiterungen zu den jeweiligen Sprachen verwendet. 
## Struktur des Entwicklungsprozesses
Der Entwicklungsprozess wurde strukturiert durch ein Trello Board, vielen Absprachen über Discord sowie einigen Github Issues.
Mithilfe von Trello wurden Aufgaben konzipiert und anschließend an die drei Gruppenmitglieder verteilt. Sobald eine Aufgabe (Meist ein Feature oder Bugfix) erledigt wurde, wurden diese als Erledigt markiert. Damit eine Aufgabe als vollständig erledigt galt, musste ein weiteres Gruppenmitglied die Aufgabe kontrollieren und sich den dazugehörigen Code anschauen. Erst nach dieser Kontrolle wurde die Aufgabe als erledigt markiert und anschließend auf einen Branch auf Github gepusht. Der anschließende Pull-Request und der daraus resultierende Merge wurde mithilfe von diversen Github-Actions überprüft.

# Funktionen

## Registrierung
### Umsetzung der Funktionen
Die Registrierung ermöglicht es einem Benutzer einen Account anzulegen. Im Frontend wird dafür in einem Formular ein gewünschter Benutzername sowie ein Passwort abgefragt. Bei Absenden des Formulars wird eine API-Anfrage vom Frontend an das Backend gestellt, die die Passwortstärke sowie die länge des überprüft. Im Backend wird dafür zxcvbn verwendet. Sollte diese Anfrage ergeben, dass das Passwort zu schwach ist wird dies im Frotend ausgegeben mit einer Begründung warum dies der Fall ist. Andernfalls wird im Backend die  die Länge des Benutzernamen überprüft sowie ob es bereits einen Nutzer mit diesem Namen gibt. Werden diese Überprüfungen auch bestanden, wird das Passwort gesalted und mit Argon2id gehasht und der Benutzer mit Benutzernamen und gehashtem Passwort in der Datenbank abgespeichert. Für das Hashing und den Salt wird die node-argon library genutzt. Nach der Erfolgreichen Registrierung wird der Benutzer automatisch eingeloggt (siehe login).
### Mögliche Schwachstellen
Bei der Registrierung hat ein Angreifer die Möglichkeit über das im Frontend bereitgestellte Formular oder direkt über API-Anfragen eigenen Text an das Backend zu geben welches diesen dann an eine Datenbank-query weitergibt. Hier entsteht insbesondere die Gefahr einer SQL Injection. Zudem wird das Passwort vom Frontend an das Backend übertragen, diese Übertragung könnte theoretisch abgefangen/ mit gelesen werden. Auch der nach dem login zurückkommenden JWT muss könnte mitgelesen werden. Um jegliche SQL-Injections zu verhindern greift das Backend auf sogenannte Prepared Statements zurück. So wird kein Userinput je compiliert und damit auch nicht ausgeführt werden. Die Übertragung der API-Anfrage sowie ihrer Antwort muss durch HTTPS verschlüsselt werden um ein auslesen Sicherheitsrelevanter Daten zu verhindern.
### Datenschutz
Die Registrierung ist Datenschutrelevant, da hier mit dem Benutzernamen und dem Passwort besonders sensibele Daten behandelt werden. Zur sicheren Übertragung wird HTTPS verwendet. Das Passwort wird gehasht in der Datenbank gespeichert, so dass bei einer komprimitierung der Datenbank dennoch nicht direkt die Passwörter bekannt werden. Die benutzernamen werden im Klartext gespeichert.

## Login
### Umsetzung der Funktionen
Beim Login hat ein Benutzer die Möglichkeit sich in einen bereits bestehenden Account einzuloggen. Im Frontend wird dem Benutzer dafür ein Fromular zur Verfügung gestellt, in welchem ein Benutzername und ein Passwort eingegeben werden kann. Bei Absenden des Formulars wird eine POST API-Anfrage an den Backendserver gesendet. Dieser holt sich zunächst das zum Benutzernamen passende gehashte Passwort aus der Datenbank. Mit der zur library gehörenden Funktion verify wird überprüft ob die Passwörter übereinstimmen. Stimmen die Passwörter überein wird ein JSON Web Token erstellt. In diesem werden die Benutzer ID und der Benutzername gespeichert. Der JWT sowie der Benutzername und die Benutzer ID werden im Erfolgsfall zurück an das Frontend gesendet. Im Fehlerfall wird immer der gleiche Statuscode mit gleicher Fehlermeldung zurückgegeben, diese wird im Frontend dem Nutzer als Fehler angezeigt.
### Mögliche Schwachstellen
Mögliche Schwachstellen des Login bestehen darin, dass über das Formular oder über direkte API-Anfragen Nutzer Input an das Backend gegeben wird 
### Datenschutz

## Notiz anlegen
### Umsetzung der Funktionen
### Mögliche Schwachstellen
### Datenschutz
## Notiz Editieren
### Umsetzung der Funktionen
### Mögliche Schwachstellen
### Datenschutz
## Notiz löschen
### Umsetzung der Funktionen
### Mögliche Schwachstellen
### Datenschutz
## Youtube-Video an Notiz anhängen
In Noteify gibt es die Funktion, einer Notiz (egal ob öffentlich oder privat) ein Youtube-Video anzuhängen. Dieses wird anschließend in der Detailansicht einer einzelnen Notiz als "Embedded iFrame" angezeigt. Man kann das Video also direkt anschauen, ohne Youtube separat zu öffnen. Das Youtube-Video wird mittels dem passenden URL zum Video beim Erstellen oder Editieren der Notiz in das untere, dazu passende Text-Feld eingesetzt. Pro Notiz ist es möglich, ein Video anzuhängen.
### Umsetzung der Funktionen
Allgemein wird zum anzeigen des Youtube-Videos die von Angular zur Verfügung gestellte Funktion "Youtube-Player" verwendet. Hier wird ein neues HTML-Tag hinzugefügt. Mit einer validen Video-ID wird ein passender iFrame durch Angular gerendert.
Die Video-ID zu dem angegebenen Youtube-Video wird mittels einer Regex aus dem URL gefiltert. ```((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*) ```

Die Regex filter zu allen möglichen URL-Formatierungen die passende ID. Die ID wird anschließend per Typescript in die HTML-Seite der Single-Note eingesetzt. Das Ergebnis ist ein eingebettetes Youtube-Video.
### Mögliche Schwachstellen
1. Mehrere URLs angeben
   
   Werden mehrere URLs angegeben, wird lediglich immer das erste passende Youtube-Video eingesetzt.
2. Schadcode angeben
   
   Sobald die Regex zur Erkennung der Youtube-URLs keinen validen URL erkennt wird nichts/null zurückgegeben. Im Frontend wird nichts gerendert, da keine valide ID zur Verfügung gestellt wird. Das Rendern/Ausführen von Schadcode wird dadurch verhindert.
3. Falsche URLs angeben
   
   Werden falsche URLs (z.B. URLs anderer Domains) oder Youtube-URLs mit fehlerhaften IDs angegeben, wird kein Youtube-Video gerendert, da keine valide ID zur Verfügung gestellt wird.
### Datenschutz
Ggf. Youtube-Cookies. Noch überprüfen.
## Suche von Notizen
### Umsetzung der Funktionen
### Mögliche Schwachstellen
### Datenschutz
