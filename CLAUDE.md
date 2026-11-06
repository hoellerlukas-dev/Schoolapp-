# Regeln für Claude

## Chat-Übergabe (IMMER zuerst!)
1. Zu Beginn jedes Chats: `git fetch origin` und alle `claude/*`-Branches, die neuer sind, in den eigenen Branch mergen – so geht nichts aus anderen Chats verloren.
2. `docs/STAND.md` lesen: dort steht, was zuletzt gemacht wurde und was als Nächstes kommt.
3. Am Ende jeder Aufgabe `docs/STAND.md` kurz aktualisieren, committen und pushen.
4. Artifact-Vorschau immer unter der gleichen URL aktualisieren (siehe unten).


- Antworten **sehr kurz** halten: nur das Wichtigste, keine langen Texte (Token sparen, kleiner Plan).
- Nutzer hat **keine Programmierkenntnisse**: Claude programmiert selbst, erklärt einfach, auf Deutsch.
- Nicht nach Code-Kopieren fragen; Ergebnis per Screenshot zeigen.
- Bei Unklarheiten kurze Auswahlfragen stellen statt zu raten.

# Projekt
SchulApp: React + TypeScript + Tailwind (Vite). Beispieldaten in `src/data/demo.ts`.

# Produkt-Entscheidungen
- Ziel: verkaufbares Schulsystem (WebUntis-Alternative) für **Deutschland** (Noten 1–6, Oberstufe 0–15 Punkte, DSGVO).
- Rollen: Schüler, Lehrer, Eltern, Schulleitung/Admin.
- Kern: Stundenplan + Vertretungen, Noten + Durchschnittsrechner, Chat mit Lehrern, Fehlstunden/Entschuldigungen, Kalender. Moderne, einfache UI, Handy zuerst.
- Technik: erst Web-App (PWA), später App-Store. Backend später: Supabase (EU).
- Reihenfolge: 1) Design aller Seiten mit Beispieldaten 2) Login/Rollen 3) echte Daten.

# Vorschau-Link
Nach jeder Änderung: `npm run build`, dann `dist/index.html` + `dist/assets/*` als Artifact neu veröffentlichen
(gleiche URL behalten): https://claude.ai/artifact/6jHovSc9bePKjcyzEttuxS

# Skills (in `.claude/skills/`)
frontend-design, webapp-testing, react-best-practices, web-design-guidelines, ui-ux-pro-max, reverse-engineer-anything – nur laden, wenn passend (Token sparen).
