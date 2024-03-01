
<p>გამარჯობა, {{ $user->name }},</p>

<p>პაროლის აღდგენისთვის გთხოვთ გახსნათ ბმული და მიჰყვეთ ინსტრუქციას: <a href="{{env('FRONT_URL') . '/authentication/reset-password/' . $user->password_reset_token}}">პაროლის შეცვლა</a> </p>
<p>ბმული: {{env('FRONT_URL') . '/authentication/reset-password/' . $user->password_reset_token}}</p>

<p>პატივისცემით</p>