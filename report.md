


-   **Zpracoval:** Michal Senderák
    
-   **Datum:** 27. 4. 2025
    
-   **Kontext:**  
    Tento report shrnuje úpravy a aktuální stav testovacích scénářů a jejich mapování na testovací kód v rámci druhého projektu. Testy byly rozšířeny a upraveny na základě nových požadavků a na základě nových poznatků nabytých během tvoření testů.
    

## Stručný popis úprav testů

Byl pozměněn úvod testů, kde sem počítal s možností výběru služby, jenže při prázdné databázi se část s výběrem služby nezobrazuje.
Vynechané zadávání přesných hodnot pro výběr data, času...
Testy byly oproti prvnímu projektu rozšířeny a zpřesněny, často jsou to úpravy jen v detailech které bylo nemožné implementovat, případně byla přidána nebo vynechána některá ověření.
Také bylo upraveno nebo jinak zpracováno pár detailů, které byly při tvorbě první části nejasné.
Některé testy byly spojeny do jednoho kvůli jejich podobnosti.
    

## Mapování BDD scénářů na zdrojové kódy

| Scenario file  | Line  | Cypress file   |  Line  |
|----------------|-------|----------------|--------|
|booking.feature | 9     | booking.cy.js  | 32     |
|booking.feature | 22    | booking.cy.js  | 50     |
|booking.feature | 35    | booking.cy.js  | 70     |
|booking.feature | 45    | booking.cy.js  | 92     |
|booking.feature | 59    | booking.cy.js  | 112    |
|user_managment.feature   | 10   |user_managment.cy.js   |48  | 
|user_managment.feature   | 16   |user_managment.cy.js   |59  |
|user_managment.feature   | 22   |user_managment.cy.js   |72  |
|user_managment.feature   | 29   |user_managment.cy.js   |94  |
|user_managment.feature   | 36   |user_managment.cy.js   |94  |
|user_managment.feature   | 43   |user_managment.cy.js   |128 |
|user_managment.feature   | 50   |user_managment.cy.js   |174 |
|user_managment.feature   | 55   |user_managment.cy.js   |174 |
|reservation_managment.feature  | 9   | reservation_managment.cy.js   | 55  |
|reservation_managment.feature  |14   | reservation_managment.cy.js   | 102 |
|reservation_managment.feature  |20   | reservation_managment.cy.js   | 129 |
|reservation_managment.feature  |28   | reservation_managment.cy.js   | 145 |
|view_managment.feature    |8    | view_managment.cy.js   | 17  |
|view_managment.feature    |12   | view_managment.cy.js   | 30  |
|view_managment.feature    |16   | view_managment.cy.js   | 38  |


Poznámky:
    
-   Pokud některé scénáře sdílí společný test, je to reflektováno v tabulce.
    
