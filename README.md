# Make it Happen

Welkom bij mijn eindopdracht voor PGM3: **Make it Happen!**  
Het doel van deze opdracht was om een to-do applicatie te maken waarbij gebruikers zich kunnen registreren, inloggen, categorieën en taken kunnen aanmaken, bewerken, verwijderen en markeren als voltooid. De applicatie werkt deels serverside en deels clientside.

De applicatie is gebouwd met authenticatie, autorisatie, validatie en middleware, waarbij veiligheid een belangrijk aandachtspunt was.

---

## 📦 Technologieën & Dependencies

- **dotenv** - Laadt environment variables vanuit een `.env`-bestand.
- **express** - Webframework voor het bouwen van de backend API.
- **express-validator** - Middleware voor inputvalidatie.
- **express-ejs-layouts** - Maakt het mogelijk om EJS layouts te gebruiken.
- **ejs** - Templating engine voor het renderen van HTML-pagina's.
- **knex** - SQL-query builder voor migraties en database queries.
- **objection** - ORM (Object Relational Mapper) voor database interactie.
- **sqlite3** - Database driver voor SQLite.
- **bcrypt** - Hashing library voor het beveiligen van wachtwoorden.
- **cookie-parser** - Middleware om cookies te verwerken.
- **jsonwebtoken (JWT)** - Voor het genereren en verifiëren van authenticatie tokens.

Alle statische elementen worden gerenderd met EJS, terwijl dynamische data wordt opgehaald vanuit de database en clientside wordt weergegeven.

---

## 🚀 Installatie

1. Clone de repository:  
   `git clone https://github.com/pgmgent-pgm-3/make-it-happen-Lito00356.git`

2. Installeer de dependencies:  
   `npm install`

3. Maak een `.env`-bestand aan in de root van je project. Kopieer de inhoud van `.env-defaults` en plak deze in het nieuwe `.env`-bestand.

4. Zet de database op:
   npx knex migrate:latest # Maakt de tabellen aan npx knex seed:run # Vult de tabellen met data

5. Start de applicatie:
   npm run start

6. Registreer een gebruiker of gebruik een van de bestaande gebruikers:
   Gebruiker 1: Email: info@gmail.com Wachtwoord: qwerty

Gebruiker 2: Email: pizza@gmail.com Wachtwoord: poiuyt

---

## ✅ Features

- **Taakbeheer:** Taken aanmaken, verwijderen, bewerken en status updaten. Taken worden gelinkt aan categorieën.
- **Categoriebeheer:** Categorieën aanmaken, verwijderen en bewerken. Inclusief cascade methode om hele categorieën met bijhorende taken te verwijderen.
- **Authenticatie & Autorisatie:**
- Gebruikers moeten inloggen met een geregistreerd e-mailadres.
- Taken en categorieën zijn per gebruiker gescheiden.
- Een gebruiker blijft maximaal 1 uur ingelogd (JWT token vervalt daarna).

---

## 📚 API Endpoints

| Methode | Endpoint              | Beschrijving                  |
| ------- | --------------------- | ----------------------------- |
| GET     | `/api/tasks`          | Haal alle taken op            |
| GET     | `/api/tasks/:id`      | Haal één taak op via ID       |
| POST    | `/api/tasks`          | Maak een nieuwe taak aan      |
| PATCH   | `/api/tasks/:id`      | Update een taak               |
| DELETE  | `/api/tasks/:id`      | Verwijder een taak            |
| GET     | `/api/categories`     | Haal alle categorieën op      |
| GET     | `/api/categories/:id` | Haal één categorie op via ID  |
| POST    | `/api/categories`     | Maak een nieuwe categorie aan |
| PATCH   | `/api/categories/:id` | Update een categorie          |
| DELETE  | `/api/categories/:id` | Verwijder een categorie       |

---

## ⚠️ Bugs & Toekomstige Verbeteringen

- Er worden momenteel teveel event listeners gebruikt, waardoor sommige acties dubbel of meerdere keren uitgevoerd worden.
- Een tijdelijke oplossing is toegepast waarbij de pagina herlaadt na het selecteren of updaten van een categorie.
- Bij het aanpassen van de status van een taak wordt er niet correct teruggenavigeerd en wordt standaard de "All Tasks"-categorie getoond.

---

## ✨ Author

Tomasz Liksza

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Br5Hzwf0)
