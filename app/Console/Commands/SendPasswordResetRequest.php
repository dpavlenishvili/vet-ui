<?php

namespace App\Console\Commands;

use App\Classes\SmsFacade;
use App\Mail\PasswordResetEmail;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportException;

class SendPasswordResetRequest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'password-reset';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send password reset url to users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::where('init_password_reset', true)->get();
        $bar = $this->output->createProgressBar(count($users));
        $bar->start();

        foreach ($users as $user) {
            $bar->advance();

            if ($user->password_reset_at && strtotime($user->password_reset_at) < strtotime('-1 days')) {
                $user->cancelPasswordReset();

                continue;
            }

            if ($user->password_reset_token) {
                continue;
            }

            $user->password_reset_token = md5($user->pid . $user->init_password_reset);
            $user->password_reset_at = date('Y-m-d H:i:s');
            $user->save();

            try {
                Mail::to($user->email)->send(new PasswordResetEmail($user));
            } catch (TransportException $exception) {
                //it's ok
            }

            $smsText = 'parolis adgdgenistvis gtkhovt gadadit bmulze da mihyevit instruqcias: ' . env('FRONT_URL') . '/authentication/reset-password/' . $user->password_reset_token;
            (new SmsFacade())->set('phone', $user->phone)->set('text', $smsText)->send();
        }

        $bar->finish();
    }
}
