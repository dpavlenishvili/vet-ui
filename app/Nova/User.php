<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\Gravatar;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\MorphToMany;
use Laravel\Nova\Fields\Password;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class User extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\User>
     */
    public static $model = \App\Models\User::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'name';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id', 'pid', 'name', 'phone',
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        return [
            ID::make()->sortable(),

            Text::make('Personal ID', 'pid')
                ->sortable()
                ->rules('required', 'max:13')->withMeta(['extraAttributes' => [
                    'readonly' => true,
                ]]),

            Text::make('Full name', 'name')
                ->sortable(),

            Text::make('Phone', 'phone')
                ->rules('required', 'max:9'),

            Text::make('E-mail', 'email')
                ->rules('email'),

            Select::make('Gender', 'gender')
                ->options(['male' => 'მამრობითი', 'female' => 'მდედრობითი'])
                ->withMeta(['extraAttributes' => [
                    'readonly' => true,
                ]]),

            Text::make('Birth date', 'birth_date')
                ->withMeta(['extraAttributes' => [
                    'readonly' => true,
                ]])->hideFromIndex(),
            Select::make('Residential', 'residential')->hideFromIndex()
                ->options(DB::table('countries')->pluck('name', 'code')->toArray()),


            Text::make('Region', 'region')->hideFromIndex(),
            Text::make('City', 'city')->hideFromIndex(),
            Text::make('Address', 'address')->hideFromIndex(),
            Text::make('Alternative phone', 'alt_phone')->hideFromIndex(),
            Text::make('E-mail', 'email'),
            Boolean::make('2 Factor auth', '2fa')->hideFromIndex(),
            Boolean::make('Active', 'is_active'),
            Text::make('Block reason', 'block_reason')->hideFromIndex(),
            Boolean::make('Reset password?', 'init_password_reset')->hideFromIndex(),

            MorphToMany::make('Roles', 'roles', \Sereny\NovaPermissions\Nova\Role::class),
            MorphToMany::make('Permissions', 'permissions', \Sereny\NovaPermissions\Nova\Permission::class),
        ];
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
