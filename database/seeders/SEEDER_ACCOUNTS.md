# Comptes de test — PharmaConnect

Après avoir seedé la base, vous pouvez vous connecter avec les comptes ci-dessous pour tester tous les flux.

## Lancer les seeders

```bash
# Réinitialiser la base et tout reseeder
php artisan migrate:fresh --seed

# Ou seulement lancer les seeders (si les tables existent déjà)
php artisan db:seed
```

**Mot de passe pour tous les comptes :** `password`

---

## Tous les utilisateurs (récapitulatif)

| Email | Nom | Rôle |
|-------|-----|------|
| admin@pharmaconnect.ml | Admin PharmaConnect | Admin |
| livreur@pharmaconnect.ml | Livreur Test | Livreur |
| client1@pharmaconnect.ml | Mamadou Keita | Client |
| client2@pharmaconnect.ml | Awa Traoré | Client |
| client3@pharmaconnect.ml | Ibrahim Coulibaly | Client |
| client4@pharmaconnect.ml | Fatoumata Diallo | Client |
| client5@pharmaconnect.ml | Oumar Sangaré | Client |
| client6@pharmaconnect.ml | Kadiatou Koné | Client |
| client7@pharmaconnect.ml | Bakary Diarra | Client |
| client8@pharmaconnect.ml | Mariam Coulibaly | Client |
| pharma1@pharmaconnect.ml | Pharmacie du Marché Badalabougou | Pharmacie |
| pharma2@pharmaconnect.ml | Pharmacie ACI 2000 | Pharmacie |
| pharma3@pharmaconnect.ml | Pharmacie de l'Hippodrome | Pharmacie |
| pharma4@pharmaconnect.ml | Pharmacie Lafiabougou | Pharmacie |
| pharma5@pharmaconnect.ml | Pharmacie Centrale Magnambougou | Pharmacie |
| pharma6@pharmaconnect.ml | Pharmacie Sénou | Pharmacie |
| pharma7@pharmaconnect.ml | Pharmacie Hamdallaye | Pharmacie |
| pharma8@pharmaconnect.ml | Pharmacie Quinzambougou | Pharmacie |
| pharma9@pharmaconnect.ml | Pharmacie Sirakoro | Pharmacie |
| pharma10@pharmaconnect.ml | Pharmacie Bakary Coulibaly | Pharmacie |

**Total : 20 utilisateurs** (1 admin, 1 livreur, 8 clients, 10 pharmacies)

---

## Par rôle

### Admin
- **admin@pharmaconnect.ml** — Tableau de bord admin (KPIs, commandes, pharmacies)

### Livreur
- **livreur@pharmaconnect.ml** — Compte livreur (pour flux livraison à venir)

### Clients (8)

| Email | Nom | Zone |
|-------|-----|------|
| client1@pharmaconnect.ml | Mamadou Keita | Badalabougou |
| client2@pharmaconnect.ml | Awa Traoré | ACI 2000 |
| client3@pharmaconnect.ml | Ibrahim Coulibaly | Hippodrome |
| client4@pharmaconnect.ml | Fatoumata Diallo | Lafiabougou |
| client5@pharmaconnect.ml | Oumar Sangaré | Magnambougou |
| client6@pharmaconnect.ml | Kadiatou Koné | Hamdallaye |
| client7@pharmaconnect.ml | Bakary Diarra | Sénou |
| client8@pharmaconnect.ml | Mariam Coulibaly | Quinzambougou |

### Pharmacies (10 — Bamako)

| Email | Nom |
|-------|-----|
| pharma1@pharmaconnect.ml | Pharmacie du Marché Badalabougou |
| pharma2@pharmaconnect.ml | Pharmacie ACI 2000 |
| pharma3@pharmaconnect.ml | Pharmacie de l'Hippodrome |
| pharma4@pharmaconnect.ml | Pharmacie Lafiabougou |
| pharma5@pharmaconnect.ml | Pharmacie Centrale Magnambougou |
| pharma6@pharmaconnect.ml | Pharmacie Sénou |
| pharma7@pharmaconnect.ml | Pharmacie Hamdallaye |
| pharma8@pharmaconnect.ml | Pharmacie Quinzambougou |
| pharma9@pharmaconnect.ml | Pharmacie Sirakoro |
| pharma10@pharmaconnect.ml | Pharmacie Bakary Coulibaly |

---

## Données créées par le seeder

- **20 utilisateurs** : 1 admin, 1 livreur, 8 clients, 10 pharmacies
- **23 commandes** au total :
  - **20** avec statuts variés (pending, offers_received, accepted, …), avec offres et pour certaines un paiement
  - **3** en `pending` **sans aucune offre** : pour tester le flux pharmacie
- **Messages (chat)** : sur chaque commande avec offre choisie
- **Avis** : sur les commandes terminées
- Médicaments type Mali : Paracétamol, Coartem, ORS, Amoxicilline, etc.

---

## Scénarios de test rapides

1. **Client** — `client1@pharmaconnect.ml` → Mes commandes → comparer offres, payer, chat.
2. **Pharmacie** — `pharma1@pharmaconnect.ml` → Demandes reçues → envoyer une offre ; chat si offre choisie.
3. **Admin** — `admin@pharmaconnect.ml` → Tableau de bord (KPIs, commandes).
