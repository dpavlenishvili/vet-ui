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
        Schema::create('collection_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('collection_id');
            $table->string('slug', 512)->unique();

            foreach (config('vet.languages') as $language) {
                $table->string('title_'.$language, 255);
                $table->string('meta_title_'.$language, 255);
                $table->longText('description_'.$language);
                $table->string('meta_description_'.$language, 512)->nullable();
            }

            $table->string('keywords')->nullable();
            $table->boolean('status')->default(false);
            $table->boolean('pin', 512)->default(false);
            $table->string('image')->nullable();

            $table->foreign('collection_id')->references('id')->on('collections')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collection_items');
    }
};
