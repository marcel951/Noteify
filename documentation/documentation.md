# Beschreibung
## Kurzbeschreibung
"Noteify" ist eine Anwendung, die entwickelt wurde, um Nutzern beim Organisieren und Verwalten ihrer Notizen zu helfen. Die Anwendung bietet eine benutzerfreundliche Oberfläche, die es den Benutzern ermöglicht, Notizen zu erstellen, zu bearbeiten und zu speichern. Die Anwendung bietet auch Funktionen wie die Möglichkeit, Notizen zu teilen, Youtube-Videos einer Notiz anzuhängen. Eine erweiterte Suchfunktion ist ebenfalls in der Anwendung enthalten.

## Entwickler
Die Anwendung wurde von Gruppe L entwickelt.
* [@marcel951 (Marcel Kaiser)](https://github.com/marcel951)
* [@JonathanRech (Jonathan Rech)](https://github.com/JonathanRech)
* [@wrth1337 (Benjamin Wirth)](https://github.com/wrth1337)

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
Die Registrierung ermöglicht es einem Benutzer einen Account anzulegen.
### Umsetzung der Funktionen
Im Frontend wird dafür in einem Formular ein gewünschter Benutzername sowie ein Passwort abgefragt. Bei Absenden des Formulars wird eine API-Anfrage vom Frontend an das Backend gestellt, die die Passwortstärke sowie die länge des überprüft. Im Backend wird dafür zxcvbn verwendet. Sollte diese Anfrage ergeben, dass das Passwort zu schwach ist wird dies im Frotend ausgegeben mit einer Begründung warum dies der Fall ist. Andernfalls wird im Backend die  die Länge des Benutzernamen überprüft sowie ob es bereits einen Nutzer mit diesem Namen gibt. Werden diese Überprüfungen auch bestanden, wird das Passwort gesalted und mit Argon2id gehasht und der Benutzer mit Benutzernamen und gehashtem Passwort in der Datenbank abgespeichert. Für das Hashing und den Salt wird die node-argon library genutzt. Nach der Erfolgreichen Registrierung wird der Benutzer automatisch eingeloggt (siehe login).
### Mögliche Schwachstellen
Bei der Registrierung hat ein Angreifer die Möglichkeit über das im Frontend bereitgestellte Formular oder direkt über API-Anfragen eigenen Text an das Backend zu geben welches diesen dann an eine Datenbank-query weitergibt. Hier entsteht insbesondere die Gefahr einer SQL Injection. Zudem wird das Passwort vom Frontend an das Backend übertragen, diese Übertragung könnte theoretisch abgefangen/ mit gelesen werden. Auch der nach dem login zurückkommenden JWT muss könnte mitgelesen werden. Um jegliche SQL-Injections zu verhindern greift das Backend auf sogenannte Prepared Statements zurück. So wird kein Userinput je compiliert und kann damit auch nicht ausgeführt werden. Die Übertragung der API-Anfrage sowie ihrer Antwort muss durch HTTPS verschlüsselt werden um ein auslesen Sicherheitsrelevanter Daten zu verhindern. Eine weitere mögliche Schwachstelle ist, dass die Checks zur Passwortstärke sowie zur länge des Benutzernamen im Frontend implementiert werden könnten. Diese könnten dann per API-Anfrage direkt ans Backend umgangen werden. Deshalb sind die Checks im Backend implementiert.
### Datenschutz
Die Registrierung ist Datenschutrelevant, da hier mit dem Benutzernamen und dem Passwort besonders sensibele Daten behandelt werden. Zur sicheren Übertragung wird HTTPS verwendet. Das Passwort wird gehasht in der Datenbank gespeichert, so dass bei einer komprimitierung der Datenbank dennoch nicht direkt die Passwörter bekannt werden. Die benutzernamen werden im Klartext gespeichert.

## Login
Beim Login hat ein Benutzer die Möglichkeit sich in einen bereits bestehenden Account einzuloggen. 
### Umsetzung der Funktionen
Im Frontend wird dem Benutzer dafür ein Fromular zur Verfügung gestellt, in welchem ein Benutzername und ein Passwort eingegeben werden kann. Bei Absenden des Formulars wird eine POST API-Anfrage an den Backendserver gesendet. Dieser holt sich zunächst das zum Benutzernamen passende gehashte Passwort aus der Datenbank. Mit der zur library gehörenden Funktion verify wird überprüft ob die Passwörter übereinstimmen. Stimmen die Passwörter überein wird ein JSON Web Token erstellt. In diesem werden die Benutzer ID und der Benutzername gespeichert. Der JWT sowie der Benutzername und die Benutzer ID werden im Erfolgsfall zurück an das Frontend gesendet. Der JWT hat eine Lebensdauer von einer Stunde, danach wird er vom Backend als abgelaufen erkannt. Im Fehlerfall wird immer der gleiche Statuscode mit gleicher Fehlermeldung zurückgegeben, diese wird im Frontend dem Nutzer als Fehler angezeigt.
### Mögliche Schwachstellen
Mögliche Schwachstellen des Login bestehen darin, dass über das Formular oder über direkte API-Anfragen Nutzer Input an das Backend gegeben wird. Teile dieser Nutzereingaben werden dann weiter in eine SQL-query gegeben. Damit entsteht durch das abfragen des gespeicherten Passwortes anhand des eingegebenen Benutzernamen die Gefahr einer SQL-Injection. Diese wird im Backend durch das Nutzen eines Prepared Statements verhindert, da so die Nutzereingaben nicht compiliert und somit auch nicht ausgeführt werden. Eine weiter Schwachstelle ist die Übertragung des Passwortes sowie des Benutzernamen durch das Frontend an das Backend. Außerdem die Übertragen der Nutzerdaten sowie des JWT vom Backend an das Frontend. Diese Übertragungen könnten angefangen beziehungsweise mitgelesen werden und werden deshalb mit HTTPS verschlüsselt.
### Datenschutz
Der Datenschutz ist beim Login interssant, da hier mit dem Passwort und Benutzernamen besonders sensibele Daten behandelt werden. In diesem Schritt werden keine dieser Daten abgespeichert aber verarbeitet. Besonders wichtig ist hier die sichere Übertragung durch HTTPS.

## Notiz anlegen
Beim anlegen einer Notiz erstellt ein Nutzer eine neue Notiz mit einem Titel, Inhalt möglicherweise einem Youtube-Video. Diese kann privat oder öffentlich allen zugänglich sein. Der Inhalt der Notiz unterstützt markdown-syntax.
### Umsetzung der Funktionen
Im Frontend wird für das anlegen einer Notiz ein Formular bereitgestellt, welches die genannten Felder abbildet. Ob die Notiz nur privat angezeigt oder für jeden öffentlich sein soll wird durch eine Checkbox abgbildet. Das Youtubevideo wird in einem extra Feld angegeben, dieses kann aber auch leer gelassen werden. Beim absenden dieses Formulares wird eine POST API-Anfrage an das Backend gesendet. An diese API-Anfrage wird, falls er gesetzt ist der JWT angehangen. Diese Funktion ist im Frontend nur zu erreichen, sollte man eingeloggt und damit ein JWT gesetzt sein. Im Backend wird zunächst der JWT der Anfrage auf Gültigkeit überprüft. Ist dies der Fall wird die Benutzer ID aus dem Token ausgelesen und mit dem Inhalt des Formulares welcher der Anfrage anhängt an die Datenbank übergeben. Weiterhin übergeben wird eine eindeutige UUID, welche mit der uuid library generiert wird. Diese erstellt eindeutige nicht eratbare ID. Zudem wird das Aktuelle Datum ausgelesen und in der Datenbank an die Stellen des Erstelldatum sowie der letzten Änderung gespeichert. Das Datum wird in der Datenbank im ISO Format gespeichert.
### Mögliche Schwachstellen
Mögliche Schwachstellen dieser Funktion sind das abfangen und auslesen der Übertragung, welche mit HTTPS verhindert wird. Des weiteren werden Nutzereingaben über das Backend an die Datenbank gegeben, was die Gefahr von SQL-Injections zur Folge hat. Diese werden durch das Nutzen eines Prepared Statements verhindert. Eine weitere Schwachstelle ist, dass nur angemeldete Benutzer Notizen anlegen können dürfen. Dies wird im Backend durch eine überprüfung des JWT vor der Ausführung von allen anderen Funktionen sichergestellt. So wird zudem sichergestellt, dass ein Nutzer nur Notizen für sich selbst anlegen kann da die Nutzer ID des JWT bestimmt wer als Autor der Notiz festgelegt wird.
### Datenschutz
Der Datenschutz ist beim anlegen von Notizen in sofern relevant, als dass Notizen, welche als privat markiert wurden auch vertraulich behandelt werden müssen. Alle Notizen werden in der Datenbank in Klartext gespeichert. Zukünftig sollten diese für einen produktiv Einsatz der App verschlüsselt abgespeichert werden, um tatsächlich vertraulichkeit zu gewährleisten. 
## Notiz Editieren
Beim editieren einer Notiz kann ein Nutzer eine von ihm selbst erstellte Notiz verändern. Dabei können sämtliche Teile einer Notiz verändert werden.
### Umsetzung der Funktionen
Im Frontend wird ein Formular zum editieren einer Notiz bereitgestellt. Dieses beinhaltet den bisherigen Inhalt der Notiz. Dafür stellt das Frontend zu Beginn eine GET API-Anfrage an das Backend mit der ID der Notiz, welche editiert werden soll. An diese Anfrage wird dann der JWT angehangen. Das Backend sucht die gewünschte Notiz in der Datenbank und gibt sie zurück, damit sie das frontend anzeigen kann. Beim Absenden des Formulars wird eine POST API-Anfrage an das Backend geschickt. Diese beinhaltet die Veränderte Notiz sowie ihre ID auch dieser Anfrage wird der JWT angehangen. Das Backend updated dann die jeweilige Notiz mit der ID mit dem neuen dazugehörigen Inhalt. Zudem wird das letzte Änderungsdatum auf das aktuelle Datum angepasst.
### Mögliche Schwachstellen
Mögliche Schwachstellen beim editieren einer Notiz sind das Abfangen der Kommunikation von Frontend und Backend diese wird über das Verwenden von HTTPS verhindert. Weitere mögliche Schwachstellen sind das Editieren einer Notiz durch eine unerlaubte Person. Das Backend prüft hier zunächst ob ein Benutzer einen validen JWT mitgesendet hat. Ist dies der Fall wird der Author der zu editierenden Notiz mit dem im JWT gespeicherten Notzer verglichen. Sind diese Identisch darf der Benutzer die Datei editieren. Ansonten wird eine Fehlermeldung mit dem Status unauthorised zurückgesendet. Zudem darf sich im Frontend niemand zum Updaten Notizen von anderen Nutzern anzeigen lassen können. Dies wird verhindert, da die Notizen über UUIDs universelle nicht eratbare IDs besitzen. Dadurch wird der Zugriff auf versteckte Notizen extrem unwahrscheinlich. Dies wird über die uuid library implementiert. Da Nutzereingaben im Backend an die Datenbank gegeben werden besteht zudem die Gefahr von SQL-Injections. Diese werden über Prepared Statements verhindert.
### Datenschutz
Der Datenschutz ist beim editieren von Notizen in sofern relevant, als dass Notizen, welche als privat markiert wurden auch vertraulich behandelt werden müssen. Notizen dürfen nur durch ihren Autoren verändert werden. Private Notizen dürfen nicht unberechtigten angezeigt werden.

## Notiz löschen
Einem eingeloggten Benutzer ist es möglich, Notizen, welche durch ihn erstellt wurden, zu löschen.
### Umsetzung der Funktionen
Das Löschen einer Notiz findet mittels einer API-Request statt. Zunächst wird mithilfe des JWT-Tokens überprüft, ob der Autor der zu löchenden Notiz mit der des JWT-Tokens übereinstimmt. Stimmt die ID überein, wird die Notiz aus der Datenbank rückstandlos entfernt. Das Beschaffen der ID des Erstellers der Notiz als auch das Löschen der Notiz werden per SQL-Query realisiert.
### Mögliche Schwachstellen
1. Löschen einer Notiz, die einem nicht gehört

Da ein Abgleich der Ersteller-ID und der ID aus dem JWT-Token stattfindet, ist das Löschen einer Notiz die einem nicht gehört nicht möglich. Auch wenn eine manuelle API-Request mit eigenst erstelltem JWT-Token durchgeführt wird, wird das unsachgemäße Löschen verhindert, da der JWT-Token als ungültig erkannt wird. Nur der Diebstahl eines JWT-Tokens kann hier zu Missbrauch führen. 
### Datenschutz
Zur sicheren Übertragung wird HTTPS verwendet. Ein Auslesen des JWT-Tokens wird durch die verschlüsselte Übertragung per HHTPS verhindert.

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
