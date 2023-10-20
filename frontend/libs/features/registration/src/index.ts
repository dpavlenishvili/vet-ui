import {Routes} from "@angular/router";

const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./lib/features-registration/features-registration.component')
            .then(m => m.FeaturesRegistrationComponent)
    }
]

export default routes;
