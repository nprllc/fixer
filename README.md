# Le Fixer

Copilote conversationnel pour GTA VI, pensé pour le téléphone : on lui raconte ce qui se passe en jeu (un PNJ, un lieu, un choix) et il répond court, sans spoiler au-delà de la progression.

Publié comme artifact claude.ai : https://claude.ai/artifact/To7um7NfK1wfhcmh5uphKw

## Fichiers
- `app/index.html` : l'app (chat, suivi des missions et des ratables, guide).
- `app/kb.json` : la base de connaissances (fiches rédigées en français à partir de sources recoupées).
- `app/missions.json` : les missions principales dans l'ordre.

## Capacités artifact utilisées
`sample` (Claude depuis la page), `db` + `user` (progression par personne), `dictation`, `tts`.

## Règles de contenu
- Les faits du jeu sont recoupés entre plusieurs sources et réécrits ; aucun guide n'est copié.
- Les points incertains restent marqués « à confirmer ».
