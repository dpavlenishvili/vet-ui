<?php

namespace App\Virtual\Res;

use OpenApi\Attributes as OAT;

#[OAT\Schema]
class UserLogin2FaResponseBody
{
    #[OAT\Property]
    public bool $status;

    #[OAT\Property]
    public string $msg;

    #[OAT\Property]
    public string $phone_mask;
}
