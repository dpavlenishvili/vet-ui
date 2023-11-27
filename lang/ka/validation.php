<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted_if' => ':attribute ველი სავალდებულოა, როცა :other - ის მნიშვნელობა არის :value.',
    'can' => ':attribute ველი შეიცავს არაავტორიზებულ მნიშვნელობას.',
    'current_password' => 'მიმდინარე პაროლი არასწორია.',
    'date_equals' => ':attribute უნდა იყოს :date.',
    'decimal' => ':attribute უნდა ჰქონდეს :decimal ათობითი.',
    'declined' => ':attribute ველი უნდა იყოს უარყოფილი.',
    'lowercase' => ':attribute უნდა იყოს პატარა სიმბოლოებით.',

    'max_digits' => ':attribute ველს არ უნდა ჰქონდეს :max ზე მაღალი მნიშვნელობა.',
    'not_regex' => ':attribute ველი არასწორია.',
    'password' => [
        'letters' => 'პაროლი უნდა შეიცავდეს მინიმუმ ერთ ასოს.',
        'mixed' => 'პაროლის უნდა შეიცავდეს მინიმუმ ერთ დიდ და ერთ პატარა ასოს.',
        'numbers' => 'პაროლის უნდა შეიცავდეს მინიმუმ ერთ ციფრს',
        'symbols' => 'პაროლი უნდა შეიცავდეს მინიმუმ ერთ სიბოლოს',
    ],
    'accepted'             => ':attribute უნდა იყოს მონიშნული.',
    'active_url'           => ':attribute უნდა იყოს URL მისამართი.',
    'after'                => ':attribute უნდა იყოს :date-ის შემდეგ.',
    'after_or_equal'       => ':attribute უნდა იყოს :date-ის შემდეგ ან მისი ტოლი.',
    'alpha'                => ':attribute უნდა შეიცავდეს მხოლოდ ასოებს.',
    'alpha_dash'           => ':attribute უნდა შეიცავდეს მხოლოდ ასოებს, რიცხვებს და ტირეებს.',
    'alpha_num'            => ':attribute უნდა შეიცავდეს მხოლოდ ასოებს და რიცხვებს.',
    'array'                => ':attribute უნდა იყოს მასივი.',
    'before'               => ':attribute უნდა იყოს :date-მდე.',
    'before_or_equal'      => ':attribute უნდა იყოს :date-მდე ან მისი ტოლი.',
    'between'              => [
        'numeric' => ':attribute უნდა იყოს :min-სა და :max-ს შორის.',
        'file'    => ':attribute უნდა იყოს :min-სა და :max კილობაიტს შორის.',
        'string'  => ':attribute უნდა იყოს :min-სა და :max სიმბოლოს შორის.',
        'array'   => ':attribute-ის რაოდენობა უნდა იყოს :min-დან :max-მდე.',
    ],
    'boolean'              => ':attribute უნდა იყოს true, false, 0 ან 1.',
    'confirmed'            => ':attribute არ ემთხვევა დადასტურებას.',
    'date'                 => ':attribute შეიცავს თარიღის არასწორ ფორმატს.',
    'date_format'          => ':attribute არ ემთხვევა თარიღის ფორმატს: :format.',
    'different'            => ':attribute და :other არ უნდა ემთხვეოდეს ერთმანეთს.',
    'digits'               => ':attribute უნდა შედგებოდეს :digits ციფრისგან.',
    'digits_between'       => ':attribute უნდა შედგებოდეს :min-დან :max ციფრამბდე.',
    'dimensions'           => ':attribute შეიცავს სურათის არასწორ ზომებს.',
    'distinct'             => ':attribute უნდა იყოს უნიკალური.',
    'email'                => ':attribute უნდა იყოს სწორი ელ.ფოსტა.',
    'exists'               => 'ასეთი :attribute არ არსებობს.',
    'file'                 => ':attribute უნდა იყოს ფაილი.',
    'filled'               => ':attribute აუცილებელია.',
    'image'                => ':attribute უნდა იყოს სურათი.',
    'in'                   => 'მითითებული :attribute არასწორია.',
    'in_array'             => ':attribute უნდა არსებობდეს :other-ში.',
    'integer'              => ':attribute უნდა იყოს მთელი რიცხვი.',
    'ip'                   => ':attribute უნდა იყოს IP მისამართი.',
    'ipv4'                 => ':attribute უნდა იყოს IPv4 მისამართი.',
    'ipv6'                 => ':attribute უნდა იყოს IPv6 მისამართი.',
    'json'                 => ':attribute უნდა იყოს JSON ტიპის.',
    'max'                  => [
        'numeric' => ':attribute არ უნდა აღემატებოდეს :max-ს.',
        'file'    => ':attribute არ უნდა აღემატებოდეს :max კილობაიტს.',
        'string'  => ':attribute არ უნდა აღემატებოდეს :max სიმბოლოს.',
        'array'   => ':attribute-ის რაოდენობა არ უნდა აღემატებოდეს :max-ს.',
    ],
    'mimes'                => ':attribute უნდა იყოს შემდეგი ტიპის: :values.',
    'mimetypes'            => ':attribute უნდა იყოს შემდეგი ტიპის: :values.',
    'min'                  => [
        'numeric' => ':attribute უნდა იყოს მინიმუმ :min.',
        'file'    => ':attribute უნდა იყოს მინიმუმ :min კილობაიტი.',
        'string'  => ':attribute უნდა შეიცავდეს მინიმუმ :min სიმბოლოს.',
        'array'   => ':attribute უნდა იყოს მინიმუმ :min.',
    ],
    'not_in'               => 'მითითებული :attribute არასწორია.',
    'numeric'              => ':attribute უნდა იყოს რიცხვი.',
    'present'              => ':attribute უნდა არსებობდეს, თუნდაც ცარიელი.',
    'regex'                => ':attribute არ ემთხვევა ფორმატს.',
    'required'             => ':attribute აუცილებელია.',
    'required_if'          => ':attribute აუცილებელია, თუ :other-ის მნიშვნელობა ემთხვევა :value-ს.',
    'required_unless'      => ':attribute აუცილებელია, თუ :values არ შეიცავს :other-ს.',
    'required_with'        => ':attribute აუცილებელია, თუ :values მითითებულია.',
    'required_with_all'    => ':attribute აუცილებელია, თუ :values მითითებულია.',
    'required_without'     => ':attribute აუცილებელია, თუ :values არ არის მითითებული.',
    'required_without_all' => ':attribute აუცილებელია, თუ :values არ არის მითითებული.',
    'same'                 => ':attribute და :other უნდა ემთხვეოდეს ერთმანეთს.',
    'size'                 => [
        'numeric' => ':attribute უნდა იყოს :size-ის ტოლი.',
        'file'    => ':attribute უნდა იყოს :size კილობაიტი.',
        'string'  => ':attribute უნდა შედგებოდეს :size სიმბოლოსგან.',
        'array'   => ':attribute უნდა შეიცავდეს :size ელემენტს.',
    ],
    'string'               => ':attribute უნდა იყოს ტექსტი.',
    'timezone'             => ':attribute უნდა იყოს სასაათო სარტყელი.',
    'unique'               => 'ასეთი :attribute უკვე არსებობს.',
    'uploaded'             => ':attribute-ის ატვირთვა ვერ მოხერხდა.',
    'url'                  => ':attribute უნდა იყოს URL მისამართი.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'pid' => 'პირადი ნომერი',
        'phone' => 'ტელეფონი',
        'first_name' => 'სახელი',
        'last_name' => 'გვარი',
        'gender' => 'სქესი',
        'birth_date' => 'დაბადების თარიღი',
        'residential' => 'მოქალაქეობა',
        'alt_phone' => 'ალტერნატიული ტელეფონი',
        'sms_code' => 'SMS კოდი',
        'region' => 'რეგიონი',
        'city' => 'ქალაქი',
        'address' => 'მისამართი',
        'email' => 'ელ.ფოსტა',
        'password' => 'პაროლი',
    ],

];
