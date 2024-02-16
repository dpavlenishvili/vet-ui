<?php

namespace App\Http\Requests;

use Exception;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use InvalidArgumentException;

class UserRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        $userId = $this->route('user')->id ?? 0;

        return [
            'pid' => ['required', 'unique:users,pid,'.$userId],
            'phone' => ['required', 'min:9', 'max:9'],
            'first_name' => ['required', 'min:2', 'max:32'],
            'last_name' => ['required', 'min:2', 'max:32'],
            'gender' => ['required', Rule::in(['male', 'female'])],
            'birth_date' => ['required', 'date_format:Y-m-d'],
            'residential' => ['required', 'min:3', 'max:3', Rule::in(DB::table('countries')->pluck('code')->toArray())],
            'alt_phone' => ['sometimes', 'min:6', 'max:6'],
            'sms_code' => ['required', 'min:4', 'max:4'],
            'password' => ['sometimes', 'string', 'min:8', Password::min(8)
                ->letters()
                ->mixedCase()
                ->numbers()
                ->symbols()],
            'password_confirmation' => ['sometimes', 'required_with:password', 'same:password'],
        ];
    }

    public function all($keys = null)
    {
        $input = parent::all();

        $input['name'] = $input['first_name'].' '.$input['last_name'];

        if (isset($input['photo']) && $input['photo'] != '') {
            $input['photo'] = $this->saveUserPhotoAndGetUrl($input['photo'], $input['pid']);
        }

        return $input;
    }

    private function saveUserPhotoAndGetUrl(string $base64String, string $pid): ?string
    {
        try {
            $imageContent = base64_decode($base64String);
        } catch (InvalidArgumentException $exception) {
            return null;
        }

//        $path = 'users/photos/';
//        $filename = md5($pid).'.jpg';
//
//        try {
//            file_put_contents($path.$filename, $imageContent);
//        } catch (Exception $exception) {
//            return null;
//        }
//
//        return sprintf('/%s%s', $path, $filename);

        return null;
    }
}
