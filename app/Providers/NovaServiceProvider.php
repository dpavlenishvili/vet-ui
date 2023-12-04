<?php

namespace App\Providers;

use App\Nova\Collection;
use App\Nova\CollectionItem;
use App\Nova\Dashboards\Main;
use App\Nova\Menu;
use App\Nova\Page;
use App\Nova\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Gate;
use Laravel\Nova\Menu\MenuItem;
use Laravel\Nova\Menu\MenuSection;
use Laravel\Nova\Nova;
use Laravel\Nova\NovaApplicationServiceProvider;

class NovaServiceProvider extends NovaApplicationServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        $this->menus();
        $this->footer();
    }

    /**
     * Register the Nova routes.
     *
     * @return void
     */
    protected function routes()
    {
        Nova::routes()
                ->withAuthenticationRoutes()
                ->withPasswordResetRoutes()
                ->register();
    }

    /**
     * Register the Nova gate.
     *
     * This gate determines who can access Nova in non-local environments.
     *
     * @return void
     */
    protected function gate()
    {
        Gate::define('viewNova', function ($user) {
            return $user->is_admin;
        });
    }

    /**
     * Get the dashboards that should be listed in the Nova sidebar.
     *
     * @return array
     */
    protected function dashboards()
    {
        return [
            new \App\Nova\Dashboards\Main,
        ];
    }

    /**
     * Get the tools that should be listed in the Nova sidebar.
     *
     * @return array
     */
    public function tools()
    {
        return [];
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    private function menus(): void
    {
        Nova::mainMenu(function (Request $request) {
            return [
                MenuSection::dashboard(Main::class)->icon('home'),
                MenuSection::resource(Menu::class)->icon('menu'),
                MenuSection::resource(Page::class)->icon('document-duplicate'),
                MenuSection::make('Page Collections', [
                    MenuSection::resource(Collection::class)->icon('color-swatch'),
                    MenuSection::resource(CollectionItem::class)->icon('document-text'),
                ])->icon('collection')->collapsable()->collapsedByDefault(),

                MenuSection::resource(User::class)->icon('users'),

                //                MenuSection::make('Menus', [
                //                    MenuSection::resource(Menu::class)->icon('menu-alt-4'),

                //                    MenuItem::resource(Release::class),
                //                ])->icon('menu')->collapsable(),
            ];
        });
    }

    private function footer(): void
    {
        Nova::footer(function ($request) {
            return Blade::render('
                <p class="text-center">Power By <a href="https://emis.ge" class="link-default">EMIS</a> 
                <br> © VET '.date('Y').'</p>
            ');
        });
    }
}
