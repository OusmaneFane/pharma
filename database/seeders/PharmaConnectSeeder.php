<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Message;
use App\Models\Offer;
use App\Models\OfferItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Pharmacy;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PharmaConnectSeeder extends Seeder
{
    private const MALI_MEDICINES = [
        'Paracétamol 500mg',
        'Coartem',
        'ORS (Sachet)',
        'Amoxicilline 500mg',
        'Métronidazole 500mg',
        'Chloroquine',
        'Ibuprofène 400mg',
        'Doliprane 1000mg',
        'Smecta',
        'Vitamine C',
    ];

    /** Quartiers Bamako avec coordonnées approximatives */
    private const BAMAKO_ZONES = [
        ['name' => 'Badalabougou', 'lat' => 12.6288, 'lng' => -8.0194],
        ['name' => 'ACI 2000', 'lat' => 12.6280, 'lng' => -8.0280],
        ['name' => 'Hippodrome', 'lat' => 12.6400, 'lng' => -8.0100],
        ['name' => 'Lafiabougou', 'lat' => 12.6350, 'lng' => -8.0350],
        ['name' => 'Magnambougou', 'lat' => 12.6200, 'lng' => -8.0400],
        ['name' => 'Sénou', 'lat' => 12.5330, 'lng' => -8.0300],
        ['name' => 'Hamdallaye', 'lat' => 12.6500, 'lng' => -8.0200],
        ['name' => 'Quinzambougou', 'lat' => 12.6150, 'lng' => -8.0450],
        ['name' => 'Sirakoro', 'lat' => 12.6100, 'lng' => -8.0500],
        ['name' => 'Bakary Coulibaly', 'lat' => 12.6380, 'lng' => -8.0380],
    ];

    public function run(): void
    {
        $this->createAdmin();
        $this->createDeliveryUser();
        $clients = $this->createClients();
        $pharmacies = $this->createPharmacies();
        $this->createOrdersWithOffers($clients, $pharmacies);
        $this->createPendingOrdersForPharmacyTesting($clients, $pharmacies);
        $this->seedMessagesAndReviews();
    }

    private function createAdmin(): void
    {
        User::factory()->create([
            'name' => 'Admin PharmaConnect',
            'email' => 'admin@pharmaconnect.ml',
            'phone' => '+223 00 00 00 00',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
    }

    /** Livreur de test (optionnel pour les flux livraison). */
    private function createDeliveryUser(): void
    {
        User::factory()->create([
            'name' => 'Livreur Test',
            'email' => 'livreur@pharmaconnect.ml',
            'phone' => '+223 65 00 00 00',
            'password' => Hash::make('password'),
            'role' => 'delivery',
        ]);
    }

    /** @return array<int, Client> */
    private function createClients(): array
    {
        $profiles = [
            ['name' => 'Mamadou Keita', 'zone' => 'Badalabougou', 'address' => 'Rue 123, Badalabougou'],
            ['name' => 'Awa Traoré', 'zone' => 'ACI 2000', 'address' => 'Avenue du Fleuve, ACI 2000'],
            ['name' => 'Ibrahim Coulibaly', 'zone' => 'Hippodrome', 'address' => 'Quartier Hippodrome'],
            ['name' => 'Fatoumata Diallo', 'zone' => 'Lafiabougou', 'address' => 'Lafiabougou ACI'],
            ['name' => 'Oumar Sangaré', 'zone' => 'Magnambougou', 'address' => 'Magnambougou'],
            ['name' => 'Kadiatou Koné', 'zone' => 'Hamdallaye', 'address' => 'Hamdallaye'],
            ['name' => 'Bakary Diarra', 'zone' => 'Sénou', 'address' => 'Sénou Aéroport'],
            ['name' => 'Mariam Coulibaly', 'zone' => 'Quinzambougou', 'address' => 'Quinzambougou'],
        ];

        $clients = [];
        foreach ($profiles as $i => $p) {
            $user = User::factory()->create([
                'name' => $p['name'],
                'email' => 'client'.($i + 1).'@pharmaconnect.ml',
                'phone' => '+223 70 00 00 0'.($i + 1),
                'password' => Hash::make('password'),
                'role' => 'client',
            ]);
            $clients[] = Client::create([
                'user_id' => $user->id,
                'address' => $p['address'],
                'zone' => $p['zone'],
            ]);
        }
        return $clients;
    }

    /** @return array<int, Pharmacy> */
    private function createPharmacies(): array
    {
        $names = [
            'Pharmacie du Marché Badalabougou',
            'Pharmacie ACI 2000',
            'Pharmacie de l\'Hippodrome',
            'Pharmacie Lafiabougou',
            'Pharmacie Centrale Magnambougou',
            'Pharmacie Sénou',
            'Pharmacie Hamdallaye',
            'Pharmacie Quinzambougou',
            'Pharmacie Sirakoro',
            'Pharmacie Bakary Coulibaly',
        ];

        $pharmacies = [];
        foreach (self::BAMAKO_ZONES as $i => $zone) {
            $user = User::factory()->create([
                'name' => $names[$i],
                'email' => 'pharma'.($i + 1).'@pharmaconnect.ml',
                'phone' => '+223 76 00 00 0'.($i + 1),
                'password' => Hash::make('password'),
                'role' => 'pharmacy',
            ]);
            $pharmacies[] = Pharmacy::create([
                'user_id' => $user->id,
                'name' => $names[$i],
                'license_number' => 'ML-PHA-'.str_pad((string) ($i + 1), 4, '0', STR_PAD_LEFT),
                'address' => $zone['name'].', Bamako',
                'zone' => $zone['name'],
                'lat' => $zone['lat'],
                'lng' => $zone['lng'],
                'is_verified' => $i < 7,
                'is_active' => true,
                'avg_response_time' => rand(15, 45),
                'cancellation_rate' => rand(0, 5) / 10,
                'rating' => round(3.5 + (rand(0, 15) / 10), 2),
                'total_orders' => rand(10, 200),
            ]);
        }
        return $pharmacies;
    }

    /** @param array<int, Client> $clients
     * @param array<int, Pharmacy> $pharmacies
     */
    private function createOrdersWithOffers(array $clients, array $pharmacies): void
    {
        $statuses = [
            'pending', 'pending', 'offers_received', 'offers_received', 'accepted',
            'accepted', 'preparing', 'ready', 'in_delivery', 'completed', 'completed',
            'cancelled', 'pending', 'offers_received', 'accepted', 'preparing', 'ready', 'completed', 'pending', 'offers_received',
        ];

        foreach (array_slice($statuses, 0, 20) as $i => $status) {
            $client = $clients[$i % count($clients)];
            $order = Order::create([
                'client_id' => $client->id,
                'type' => $i % 3 === 0 ? 'prescription' : 'list',
                'status' => $status,
                'notes' => $i % 2 === 0 ? 'Urgent si possible' : null,
                'zone' => $client->zone,
                'address' => $client->address,
                'accepts_generics' => true,
                'accepts_substitution' => $i % 2 === 0,
                'accepts_partial' => false,
                'delivery_type' => $i % 3 === 0 ? 'delivery' : 'pickup',
                'urgency' => $i % 4 === 0 ? 'express' : 'normal',
                'total_amount' => null,
                'expires_at' => now()->addHours(24),
            ]);

            $numMeds = min(rand(2, 4), count(self::MALI_MEDICINES));
            $indices = array_rand(self::MALI_MEDICINES, $numMeds);
            $indices = is_array($indices) ? $indices : [$indices];
            foreach ($indices as $idx) {
                $med = self::MALI_MEDICINES[$idx];
                OrderItem::create([
                    'order_id' => $order->id,
                    'medicine_name' => $med,
                    'quantity' => rand(1, 3),
                    'dosage' => str_contains($med, 'mg') ? null : null,
                ]);
            }

            $order->load('items');
            $numOffers = in_array($status, ['pending'], true) ? rand(0, 2) : rand(1, 4);
            $numOffers = min($numOffers, count($pharmacies));
            $pharmaKeys = $numOffers > 0 ? array_rand($pharmacies, $numOffers) : [];
            $pharmaKeys = is_array($pharmaKeys) ? $pharmaKeys : [$pharmaKeys];
            $offersCreated = [];
            foreach ($pharmaKeys as $pharmaKey) {
                $pharmacy = $pharmacies[$pharmaKey];
                $totalPrice = rand(2500, 15000);
                $delay = [15, 30, 45, 60, 120][array_rand([15, 30, 45, 60, 120])];
                $offer = Offer::create([
                    'order_id' => $order->id,
                    'pharmacy_id' => $pharmacy->id,
                    'status' => $status === 'accepted' || $status === 'preparing' || $status === 'ready' || $status === 'in_delivery' || $status === 'completed' ? ($offersCreated ? 'rejected' : 'accepted') : 'pending',
                    'total_price' => $totalPrice,
                    'availability' => ['full', 'full', 'partial', 'order'][array_rand(['full', 'full', 'partial', 'order'])],
                    'delay_minutes' => $delay,
                    'delivery_type' => $order->delivery_type,
                    'delivery_fee' => $order->delivery_type === 'delivery' ? rand(500, 2000) : 0,
                    'service_fee' => rand(0, 500),
                    'reliability_score' => round(70 + rand(0, 30), 2),
                    'global_score' => round(60 + rand(0, 35), 2),
                    'expires_at' => now()->addHours(24),
                ]);
                $offersCreated[] = $offer;
                foreach ($order->items as $item) {
                    OfferItem::create([
                        'offer_id' => $offer->id,
                        'order_item_id' => $item->id,
                        'medicine_name' => $item->medicine_name,
                        'is_generic' => false,
                        'is_substitute' => false,
                        'unit_price' => (int) round($totalPrice / $order->items->count() / max(1, $item->quantity)),
                        'quantity' => $item->quantity,
                        'available' => true,
                    ]);
                }
            }

            if (in_array($status, ['accepted', 'preparing', 'ready', 'in_delivery', 'completed'], true) && count($offersCreated) > 0) {
                $chosen = $offersCreated[0];
                $order->update([
                    'chosen_offer_id' => $chosen->id,
                    'total_amount' => $chosen->total_price + $chosen->delivery_fee + $chosen->service_fee,
                ]);
                if (in_array($status, ['accepted', 'preparing', 'ready', 'in_delivery', 'completed'], true) && $i % 3 !== 0) {
                    Payment::create([
                        'order_id' => $order->id,
                        'method' => ['orange_money', 'moov_money', 'cash'][array_rand(['orange_money', 'moov_money', 'cash'])],
                        'status' => 'completed',
                        'amount' => $order->total_amount,
                        'transaction_ref' => 'TXN-'.strtoupper(bin2hex(random_bytes(4))),
                        'paid_at' => now(),
                    ]);
                }
            }
        }
    }

    /** Commandes en attente sans offre pour tester le flux pharmacie (répondre à une demande). */
    /** @param array<int, Client> $clients
     * @param array<int, Pharmacy> $pharmacies
     */
    private function createPendingOrdersForPharmacyTesting(array $clients, array $pharmacies): void
    {
        $samples = [
            ['zone' => 'Badalabougou', 'delivery' => 'delivery', 'urgency' => 'express'],
            ['zone' => 'Hippodrome', 'delivery' => 'pickup', 'urgency' => 'normal'],
            ['zone' => 'Sénou', 'delivery' => 'delivery', 'urgency' => 'normal'],
        ];
        foreach ($samples as $i => $s) {
            $client = $clients[$i % count($clients)];
            $order = Order::create([
                'client_id' => $client->id,
                'type' => 'list',
                'status' => 'pending',
                'notes' => 'Commande test pour démo pharmacie.',
                'zone' => $s['zone'],
                'address' => $client->address,
                'accepts_generics' => true,
                'accepts_substitution' => true,
                'accepts_partial' => false,
                'delivery_type' => $s['delivery'],
                'urgency' => $s['urgency'],
                'total_amount' => null,
                'expires_at' => now()->addHours(48),
            ]);
            $meds = array_slice(self::MALI_MEDICINES, $i * 2, 3);
            foreach ($meds as $med) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'medicine_name' => $med,
                    'quantity' => rand(1, 2),
                ]);
            }
        }
    }

    /** Messages (chat) sur les commandes avec offre choisie + avis sur commandes terminées. */
    private function seedMessagesAndReviews(): void
    {
        $ordersWithChosen = Order::whereNotNull('chosen_offer_id')
            ->with(['client.user', 'chosenOffer.pharmacy.user'])
            ->get();

        $chatSamples = [
            'Bonjour, quand puis-je récupérer la commande ?',
            'Votre commande sera prête dans 30 min. Nous vous préviendrons.',
            'Parfait, merci !',
            'Livraison prévue entre 14h et 16h.',
            'C\'est noté, merci beaucoup.',
        ];

        foreach ($ordersWithChosen as $order) {
            $clientUserId = $order->client?->user?->id;
            $pharmacyUserId = $order->chosenOffer?->pharmacy?->user?->id;
            if (! $clientUserId || ! $pharmacyUserId) {
                continue;
            }
            $numMessages = rand(2, 5);
            for ($m = 0; $m < $numMessages; $m++) {
                $isClient = $m % 2 === 0;
                $senderId = $isClient ? $clientUserId : $pharmacyUserId;
                $content = $chatSamples[$m % count($chatSamples)];
                Message::create([
                    'order_id' => $order->id,
                    'sender_id' => $senderId,
                    'type' => 'logistics',
                    'content' => $content,
                    'is_paid' => false,
                ]);
            }
        }

        foreach (Order::where('status', 'completed')->whereNotNull('chosen_offer_id')->with('chosenOffer')->get() as $order) {
            if (Review::where('order_id', $order->id)->exists()) {
                continue;
            }
            Review::create([
                'order_id' => $order->id,
                'pharmacy_id' => $order->chosenOffer->pharmacy_id,
                'client_id' => $order->client_id,
                'rating' => rand(3, 5),
                'comment' => ['Très bien, livraison rapide.', 'Parfait, médicaments conformes.', 'Bon service.'][array_rand(['Très bien, livraison rapide.', 'Parfait, médicaments conformes.', 'Bon service.'])],
            ]);
        }
    }
}
