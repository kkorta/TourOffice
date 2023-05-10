# TourOffice

# Twórcy
Paweł Konop, Kacper Korta
# Temat
Tematem projektu jest Biuro wycieczek gdzie przechowujemy różne informacje na temat tych wycieczek

# Technologie

Angular, MongoDB


# Struktura (schemas)

schema Oders

![image](https://github.com/kkorta/TourOffice/assets/101141624/c104a79a-70f5-4e0b-834f-0a5d86ec26d6)

schema Reviews

![image](https://github.com/kkorta/TourOffice/assets/101141624/15cb4070-2707-4d3e-9cc3-41fb3964d0e9)

schema Tours

![image](https://github.com/kkorta/TourOffice/assets/101141624/3bf19dcc-41d2-4655-a5ad-c32c8d702857)

schema Users
![image](https://github.com/kkorta/TourOffice/assets/101141624/a470f5d8-2535-48e8-8459-49af2c54152c)


# Endpoints
- "/tours", methods used: **get**, **post**
- "/register", methods used: **post**
- "/login", methods used: **post**
- "/orders", methods used: **post**
- "/reviews", methods used: **post**
- "/token/refresh/", methods used: **post**
- "/orders/:userId", methods used: **get**
- "/ban", methods used: **put**
- "/unban", methods used: **put**
- "/set/admin", methods used: **put**
- "/set/manager", methods used: **put**
- "/set/client", methods used: **put**
- "/users", methods used: **get**

# Funkcjonalności
- rejestracja (dodanie użytkownika do bazy)
- możliwość pobrania danych o wycieczkach
- możliwość składania zamówień
- możliwość dodania opini
- możliwość przyanania roli admina/menadżera/klienta
- możliwość pobrania informacji o użytkownikach


