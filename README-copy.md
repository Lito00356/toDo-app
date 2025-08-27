# Make it happen

1. Hallo en welkom bij mijn eindopdracht PGM3 'Make It Happen!'. Het doel van deze opdracht was om een to-do-applicatie te maken waar gebruikers konden registreren, inloggen, een categorie en taak aanmaken, waarvan deze geupdate, gedelete en compleet gezet kunnen worden. Deze wordt deels serverside alsook clientside gerenderd. De applicatie is opgebouwd met authenticatie, autorisatie, validatie en middleware met in gedachten veiligheid.

2. De verschillende technologieën en dependencies:

- dotenv: Deze laadt environmentvariables vanuit een .env-bestand. - express: webframework om een backend-API te maken. - espress-validator: Een middleware die voor validatie zorgt. - express-ejs-layouts: Zorgt ervoor dat de applicatie EJS layouts kan lezen. - ejs: Een templating engine gebruikt om html-pagina's te renderen. - knex: SQL-querybuilder voor databasemigraties en queries. - objection: Object Relation Mapper (ORM) gebruikt om - sqlite3: Database drive voor SQLite - bcrypt: hashing library gebruikt om wachtwoorden te beveiligen. - cookie-parser: Een middleware die cookies behandelt in http requests - jsonwebtokens (jwt): Wordt gebruikt voor het genereren en verifiëren van authenticatietokens. Alle statische elementen zijn gerendered geweest met EJS, en de dynamische worden opgehaald vanuit de database en clientside gerendered.

3. Installatie:
   1: Clone de code vanuit de repository : https://github.com/pgmgent-pgm-3/make-it-happen-Lito00356.git
   2: npm install
   3: Maak een .env file aan in de root van je directory van het project. Koppieer de inhoud van .env-defaults en plak die in de .env
   4: Maak je database aan:
   npx knex migrate:latest -> deze maakt de tabellen in de database
   npx knex seed:run -> deze vult de tabellen in de database
   5: npm run start
   6: Registreer een nieuwe gebruiker en log daarmee in
   of gebruik een van de voorgemaakte gebruikers:
   ID: info@gmail.com
   PW: qwerty

   ***

   ID: pizza@gmail.com
   PW: poiuyt

4. Features:

   - Taakbeheer: Add, delete, edit tasks en update status. Deze zijn allemaal gelinkt aan een categorie.
   - Categoriebeheer: Add, delete edit categories. Hier ook gebruik gemaakt van cascade methode om hele categorieen met taken te kunnen verwijderen.
   - Authenticatie en authorizatie:
     Gebruikers moeten zich inloggen met een geregistreerd email.
     Categorieen en taken zijn apart per gebruiker.
     Een gebruiker kan 1h ingelogd zijn, daarna wordt de token verwijderd en zal de gebruiker zich opnieuw moeten inloggen.

5. Api endpoints:
   Method Endpoint Description
   GET /api/tasks Get all tasks
   GET /api/tasks/:id Get a single task by ID
   POST /api/tasks Create a new task
   PATCH /api/tasks/:id Update een task
   DELETE /api/tasks/:id Delete a task
   GET /api/categories Get all categories
   GET /api/categories/:id Get a single category
   POST /api/categories Create a category
   PATCH /api/categories/:id Update a category
   DELETE /api/categories/:id Delete a category

6. Bugs en toekomstige implemetaties:
   Momenteel het grooste probleem is dat ik teveel eventlisteners heb gebruikt waardoor mijn code een wirwar van events triggert waardoor bepaalde acties dubbel of soms meermaals worden uitgevoerd.
   Hierdoor is er een dirty fix moeten toegepast worden waardoor mijn pagina steeds herlaad nadat een categorie geslecteerd of geupdate wordt.
   Ook bij het veranderen van status herlaad deze niet meer correct en gaat hij altijd naar de 'All Tasks' categorie.

7. Author: Tomasz Liksza

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Br5Hzwf0)
