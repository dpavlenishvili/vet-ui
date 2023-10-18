<?php

namespace App\Classes;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class SmsFacade
{
    private $phone;

    private $text;

    public function set(string $key, string $value):self
    {
        $this->{$key} = $value;

        return $this;
    }

    public function send(): bool
    {
        if (env('APP_ENV') == 'dev') {
            return true;
        }

        $payLoad = http_build_query([
            'src' => config('services.sms.token'),
            'dst' => $this->phone,
            'txt' => $this->text,
        ]);

        $client = (new Client);
        try {
            $feedback = $client->request('get', config('services.sms.base_url').'?'.$payLoad, [
                'timeout' => 5,
                'connect_timeout' => 5,
            ]);
        } catch (\Exception $exception) {
            Log::channel('mylog')->error('Failed SMS: '.$payLoad);

            return false;
        }

        if ($feedback->getReasonPhrase() != 'OK') {
            return false;
        }

        return true;
    }
}
