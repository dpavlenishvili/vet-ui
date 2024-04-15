<?php

namespace App\Nova;

use Aiman\NestTool\NestTool;
use App\Models\PageLanguage;
use Ebess\AdvancedNovaMediaLibrary\Fields\Files;
use Emilianotisato\NovaTinyMCE\NovaTinyMCE;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\BelongsToMany;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\File;
use Laravel\Nova\Fields\FormData;
use Laravel\Nova\Fields\HasOne;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Image;
use Laravel\Nova\Fields\Markdown;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Slug;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Http\Requests\NovaRequest;
use NumaxLab\NovaCKEditor5Classic\CKEditor5Classic;
use Outl1ne\NovaSortable\Traits\HasSortableRows;
use ZiffMedia\NovaSelectPlus\SelectPlus;

class Page extends Resource
{
    use HasSortableRows;

    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Page>
     */
    public static $model = \App\Models\Page::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'title_ka';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        $fields = [
            ID::make()->sortable()->hideFromIndex(),
            SelectPlus::make('Menus', 'menus', Menu::class),
            BelongsTo::make('Parent Page', 'parent', self::class)->default(0)->nullable(),
            Slug::make('Slug', 'slug')
                ->required()
                ->from('title_'.config('vet.languages')[0])
                ->placeholder('Slug')
                ->rules('required', 'max:255')
                ->updateRules('unique:pages,slug,{{resourceId}}')
                ->creationRules('unique:pages,slug')
                ->withMeta(['extraAttributes' => [
                    'readonly' => true,
                ]]),

            Select::make('type')->required()->options(config('vet.page_types')),
            BelongsTo::make('Collection', 'collection', Collection::class)->hide()->dependsOn(
                ['type'],
                function (BelongsTo $field, NovaRequest $request, FormData $formData) {
                    if ($formData->type === 'collection') {
                        $field->show();
                    }
                }
            )->nullable(),
            Files::make('Attachments', 'attachments'),

        ];

        foreach (config('vet.languages') as $language) {
            $fields[] = Text::make('Title ('.$language.')', 'title_'.$language)
                ->rules($language === 'ka' ? 'max:255' : '', $language === 'ka' ? 'min:3' : '')->sortable()
                ->required($language === config('vet.default_language'));
            $fields[] = NovaTinyMCE::make('Content ('.$language.')', 'description_'.$language)
                ->hideFromIndex()->required($language === config('vet.default_language'))->rules('max:99999999');
            $fields[] = Text::make('Short title ('.$language.')', 'meta_title_'.$language)
                ->hideFromIndex()->rules($language === 'ka' ? 'max:255' : '', $language === 'ka' ? 'min:3' : '')->sortable()
                ->required($language === config('vet.default_language'));
            $fields[] = Textarea::make('Short description ('.$language.')', 'meta_description_'.$language)
                ->hideFromIndex()->required($language === config('vet.default_language'));
        }

        $fields = array_merge($fields, [
            Image::make('Banner', 'image')->hideFromIndex(),
            Boolean::make('Is Active?', 'status')->sortable(),
        ]);

        return $fields;
    }

    /**
     * Get the cards available for the request.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function cards(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function filters(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function lenses(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function actions(NovaRequest $request)
    {
        return [];
    }
}
