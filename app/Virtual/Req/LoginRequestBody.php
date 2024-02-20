<?php

namespace App\Virtual\Req;

use OpenApi\Attributes as OAT;

#[OAT\Schema(
    required: ['pid', 'password']
)]
class LoginRequestBody
{
    #[OAT\Property]
    public string $pid;

    #[OAT\Property]
    public string $password;
}
