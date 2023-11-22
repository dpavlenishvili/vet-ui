<?php

function strMask(string $phoneNumber, int $start = null, int $to = null): string
{
    $prefix = '';
    $suffix = '';

    if ($start) {
        $prefix = substr($phoneNumber, 0, $start);
    }

    if ($to) {
        $suffix = substr($phoneNumber, $to);
    }

    $numAsterisks = strlen($phoneNumber) - $start - abs($to);
    $asterisks = str_repeat('*', $numAsterisks);

    return $prefix.$asterisks.$suffix;
}
