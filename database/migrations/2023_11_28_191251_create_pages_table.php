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
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->default(0);
            $table->string('type')->default('default_static');
            $table->unsignedBigInteger('collection_id')->nullable();
            $table->string('slug', 255);

            foreach (config('vet.languages') as $language) {
                $table->string('title_'.$language, 255)->nullable();
                $table->string('meta_title_'.$language, 255)->nullable();
                $table->longText('description_'.$language)->nullable();
                $table->string('meta_description_'.$language, 512)->nullable()->nullable();
            }

            $table->string('image')->nullable();
            $table->boolean('status')->default(false);
            $table->integer('position')->default(false);

            $table->foreign('collection_id')->references('id')->on('collections');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
