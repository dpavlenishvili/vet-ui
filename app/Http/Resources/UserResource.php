<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pid' => $this->pid,
            'name' => $this->name,
            'phone' => $this->phone,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'gender' => $this->gender,
            'birthDate' => $this->birth_date,
            'residential' => $this->residential,
            'region' => $this->region,
            'city' => $this->city,
            'address' => $this->address,
            'altPhone' => $this->alt_phone,
            'email' => $this->email,
            'photo' => $this->photo,
            'isActive' => $this->is_active,
            'blockReason' => $this->block_reason,
            'createdAt' => $this->created_at,
            'deletedAt' => $this->deleted_at,
        ];
    }
}
