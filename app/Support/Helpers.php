<?php

function maskPhoneNumber(string $phoneNumber): string
{
    $prefix = substr($phoneNumber, 0, 3);
    $suffix = substr($phoneNumber, -2);
    $numAsterisks = strlen($phoneNumber) - 5;
    $asterisks = str_repeat('*', $numAsterisks);

    return $prefix . $asterisks . $suffix;
}