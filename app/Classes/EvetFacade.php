<?php

namespace App\Classes;

use Illuminate\Support\Facades\Http;
use Mockery\Exception;

class EvetFacade
{
    public function __construct(private $pid)
    {
    }

    public function get(): ?array
    {
        $http = $this->call();

        if (! $http || $http->status() !== 200) {
            return null;
        }

        return $http->json();
    }

    private function call()
    {
        try {
            return Http::get(config('services.evet.base_url').$this->pid);
        } catch (\Exception $exception) {
            return null;
        }
    }
}
