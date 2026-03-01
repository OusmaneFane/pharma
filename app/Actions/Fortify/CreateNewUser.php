<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Client;
use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $rules = [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'role' => ['required', 'string', 'in:client,pharmacy'],
            'phone' => ['nullable', 'string', 'max:20'],
        ];
        if (($input['role'] ?? '') === 'pharmacy') {
            $rules['pharmacy_name'] = ['required', 'string', 'max:255'];
        }
        Validator::make($input, $rules)->validate();

        return DB::transaction(function () use ($input) {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'phone' => $input['phone'] ?? null,
                'password' => $input['password'],
                'role' => $input['role'],
            ]);

            if ($input['role'] === 'client') {
                Client::create(['user_id' => $user->id]);
            }

            if ($input['role'] === 'pharmacy') {
                Pharmacy::create([
                    'user_id' => $user->id,
                    'name' => $input['pharmacy_name'] ?? $input['name'],
                ]);
            }

            return $user;
        });
    }
}
