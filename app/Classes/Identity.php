<?php

namespace App\Classes;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Http;
use phpDocumentor\Reflection\Types\Collection;

class Identity
{

    public function __construct(private $pid, private $lastName = null)
    {}

    /**
     * @throws \Exception
     */
    public function get(): ?\Illuminate\Http\Client\Response
    {
        if (!$this->pid) {
            return null;
        }

        try {
            $http = Http::get(config('services.identity_personal.base_url'), [
                'app-name' => config('services.identity_personal.name'),
                'api-key' => config('services.identity_personal.key'),
                'user-id' => config('services.identity_personal.id'),
                'last-name' => $this->lastName,
                'personal-no' => $this->pid,
            ]);
        }catch (\Exception $e){
            dd($e->getMessage());
            return null;
        }

        return $http;
    }
}
