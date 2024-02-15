<?php

namespace App\Classes;

use Illuminate\Support\Facades\Http;

class KeyCloack
{
    private string $token = '';

    public function __construct(private $username, private $password = null)
    {
    }

    public function auth(): ?self
    {
        $http = $this->call('token');

        if ($http->status() !== 200) {
            return null;
        }

        $this->token = $http->json('access_token');

        return $this;
    }

    public function userInfo(): ?array
    {
        $http = $this->call('userinfo');

        if ($http->status() !== 200) {
            return null;
        }

        return $http->json();
    }

    private function call(string $endpoint)
    {
        return Http::asForm()->withHeaders([
            'Authorization' => 'Bearer '.$this->token,
        ])->post(config('services.key_cloack.base_url').$endpoint, [
            'client_id' => config('services.key_cloack.client_id'),
            'client_secret' => config('services.key_cloack.secret'),
            'grant_type' => 'password',
            'username' => $this->username,
            'password' => $this->password,
        ]);
    }
}
