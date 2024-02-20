<?php

namespace App\Virtual\Res;

use OpenApi\Attributes as OAT;

#[OAT\Schema]
class UserLoginResponseBody
{
    #[OAT\Property]
    public string $access_token;

    #[OAT\Property]
    public string $token_type;

    #[OAT\Property]
    public int $expires_in;
}
