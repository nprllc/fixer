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

## Version publique

- Site (GitHub Pages) : https://nprllc.github.io/fixer/ — Guide, missions et recherche dans les fiches. Sans claude.ai, pas de chat IA ni de sync : la progression reste dans le navigateur.
- Version complète (chat IA, progression synchronisée) : l'artifact claude.ai.

## Carte de Leonida

Onglet Carte : le poster officiel Rockstar « The Great State of Leonida », affiché depuis le site de Rockstar (l image n est pas copiée dans ce dépôt). Glisser, zoom fluide, recherche, calques façon appli de cartes, case « Fait » synchronisée avec la progression, anti-spoiler pour les quêtes et secrets.

- Priorité à l argent : planques à cash, 40 opérations de gangs, banques (petites agences et 8 grands coffres), bijouteries et prêteurs, receleurs, avec le gain annoncé.
- `app/pois.json` est généré par `tools/build-pois.js` (lieux relevés sur le poster) et `tools/argent.js` (points argent). Sources : guides texte recoupés et réécrits ; `a:1` = emplacement approximatif (secteur décrit), `g` = case du quadrillage, `v` = gain, `li` = détail d un point groupé.
