<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('init_password_reset')->default(false);
            $table->timestamp('password_reset_at')->nullable();
            $table->string('password_reset_token', 255)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('init_password_reset');
            $table->dropColumn('password_reset_at');
            $table->dropColumn('password_reset_token');
        });
    }
};
