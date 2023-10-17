<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'pid' => ['required'],
            'phone' => ['required', 'min:9', 'max:9'],
            'first_name' => ['required', 'min:2', 'max:32'],
            'last_name' => ['required', 'min:2', 'max:32'],
            'gender' => ['required', Rule::in(['male', 'female'])],
            'birth_date' => ['required', 'date_format:yyyy-MM-dd'],
            'residential' => ['required', 'min:2', 'max:2'],
            'alt_phone' => ['sometimes', 'min:6', 'max:6'],
        ];
    }

    public function all($keys = null)
    {
        $input = parent::all();
        $input['name'] = $input['first_name'].' '.$input['last_name'];

        return $input;
    }
}
