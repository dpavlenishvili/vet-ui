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
        Schema::table('pages', function (Blueprint $table) {
            foreach (config('vet.languages') as $language) {
                if (config('vet.default_language') === $language) {
                    continue;
                }

                $table->string('title_'.$language, 255)->nullable()->default('')->change();
                $table->string('meta_title_'.$language, 255)->nullable()->default('')->change();
                $table->longText('description_'.$language, 255)->nullable()->default('')->change();
                $table->string('meta_description_'.$language, 255)->nullable()->default('')->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
        });
    }
};
