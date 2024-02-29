<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\HasMany;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Image;
use Laravel\Nova\Fields\Markdown;
use Laravel\Nova\Fields\Repeater;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Slug;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Http\Requests\NovaRequest;

class CollectionItem extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\CollectionItem>
     */
    public static $model = \App\Models\CollectionItem::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'id';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id', 'title_ka', 'title_en',
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
            ID::make()->sortable()
                ->hideFromIndex(),
            BelongsTo::make('Collection', 'collection', Collection::class),
            Slug::make('Slug', 'slug')
                ->required()
                ->from('title_'.config('vet.languages')[0])
                ->placeholder('Slug')
                ->rules('required', 'max:255')
                ->updateRules('unique:collection_items,slug,{{resourceId}}')
                ->creationRules('unique:collection_items,slug')
                ->withMeta(['extraAttributes' => [
                    'readonly' => true,
                ]]),
        ];

        foreach (config('vet.languages') as $language) {
            $fields[] = Text::make('Title ('.$language.')', 'title_'.$language)
                ->rules($language === 'ka' ? 'max:255' : '', $language === 'ka' ? 'min:3' : '')->sortable()
                ->required($language === config('vet.default_language'));
            $fields[] = Markdown::make('Content ('.$language.')', 'description_'.$language)
                ->hideFromIndex()->required($language === config('vet.default_language'));
            $fields[] = Text::make('Short title ('.$language.')', 'meta_title_'.$language)
                ->rules($language === 'ka' ? 'max:255' : '', $language === 'ka' ? 'min:3' : '')->sortable()
                ->hideFromIndex()->required($language === config('vet.default_language'));
            $fields[] = Textarea::make('Short description ('.$language.')', 'meta_description_'.$language)
                ->hideFromIndex()->required($language === config('vet.default_language'));
        }

        $fields = array_merge($fields, [
            Image::make('Banner', 'image')->hideFromIndex(),
            Text::make('Keywords', 'keywords')->help('Keywords my deviced by ","')->hideFromIndex(),
            Boolean::make('Is Active?', 'status')->sortable(),
            Boolean::make('Pin This item?', 'pin')->sortable(),
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
