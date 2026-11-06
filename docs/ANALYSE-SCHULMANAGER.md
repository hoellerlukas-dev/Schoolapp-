# Analyse Schulmanager (öffentliche Web-Dateien, Nov. 2026)

Quelle: öffentlich ausgelieferte JavaScript-Dateien der Login-Seite (~930 Dateien).
Es wurde **kein Code übernommen**, nur Funktionsnamen gelesen (574 Server-Aufrufe).

## Technik (abgeleitet)
- Ein zentraler Server-Aufruf `/api/calls` mit `moduleName` + `endpointName` + `parameters` (Module = Bausteine, Schule bucht einzeln)
- Login mit Salt (Passwort-Hash im Browser), 2FA, Geräte-Login, SSO (OpenID Connect, LDAP, ID-Broker/VIDIS)
- Echtzeit über WebSocket (engine.io) für Push/Chat; Push-Token fürs Handy
- iCal-Abos für Kalender und Stundenplan; Audit-Log; Statusmeldungen
- Module einzeln buchbar + Abrechnung (für uns erst beim Verkauf relevant)

## Gefundene Module & Regeln
| Bereich | Funktionen (Auszug) |
|---|---|
| Stundenplan/Vertretung | aktuelle Stunden + Vertretungen, „meine Vertretungen“, Aufsichts-Vertretungen, Vertretungsmaterial, Wochenübersicht, verkürzte Tage, Stundenplan-Wünsche/Sperrzeiten der Lehrer, Mehrarbeits-Protokoll |
| Klassenbuch | gehaltene Stunden, Schülerliste pro Stunde, Bearbeitungsrechte, Einträge |
| Abwesenheit | Krankmeldung (Eltern/Schüler/Lehrer), Entschuldigung pro Stunde, unentschuldigte Fehlzeiten, Befreiungen (Sammel-Befreiung), Statistik pro Klasse/Kurs/Tag |
| Noten | Notenblöcke & Gewichtung pro Kurs, Leistungsnachweise mit Punkten/Aufgaben, Notenschlüssel, Endnoten, Verhaltensnoten, Zeugnisse, Klassenkonferenz, Gefährdungs-/Mahnbriefe („risk of repetition“) |
| Prüfungen | Klausurplan, Sperrtermine pro Klasse, Klausuren buchen |
| Kommunikation | Messenger (Threads, Lesebestätigungen, geplante Nachrichten, Verteiler, Übersetzung), Elternbriefe mit Lesebestätigung + Code, nicht erreichte Schüler, Newsletter |
| Termine | Kalender mit Kategorien, öffentliche Termine, iCal-Export, Ferien-Import |
| Sprechtage | Elternsprechtag, Sprechzeiten der Lehrer, Termine buchen/absagen, Videokonferenzen |
| Lernen | Kurse, Lerneinheiten, Abgaben, Abgabe-Erinnerung, Dateiablage (Ordner) |
| Ganztag | Ganztags-Angebote, Anwesenheit, Betreuer, Nachrichten |
| Weitere | Nachsitzen, Schülerakte (eigene Felder, Export), Ressourcen-/Raumbuchung, Wahlfächer/Kurswahl, Zahlungen (Klassenfahrt), Fortbildungen, Startseite mit Kacheln, Statistiken für Bundesländer |

## WebUntis
Die eigentliche App läuft auf einer Schul-Adresse (z. B. `schulname.webuntis.com`) und ist ohne Login nicht einsehbar.
Funktionen laut öffentlicher Doku: Stundenplan, Vertretungsplan, Klassenbuch, Abwesenheiten, Hausaufgaben, Prüfungen, Sprechtag, Raumbuchung, Nachrichten.
Es gibt eine öffentlich dokumentierte Schnittstelle (JSON-RPC), mit der man **eigene** Daten abrufen kann – Option für später.
