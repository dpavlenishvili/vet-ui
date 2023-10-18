<p align="center"><img src="https://emis.ge/bitrix/templates/emis2/images/logo.png" width="400"></p>
<h1>პროფესიული განათლების მართვის საინფორმაციო სისტემა</h1>
<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/v/stable.svg" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/license.svg" alt="License"></a>

</p>

## გამოყენებული ტექნოლოგიები და ბიბლიოთეკები

-   PHP `^8.1`

-   PostgreSQL `^15`

-   Laravel `^10.10`

-   Angular `^16.2`

-   Nx `^16.10`

## დაყენების ინსტრუქცია

### გარემოს მოწყობა:

-   **გადმოწერეთ git: https://git-scm.com/downloads**
-   **გადმოწერეთ composer: https://getcomposer.org/download/**
-   **დააინსტალირეთ composer**
-   **გადმოწერეთ pgSql: https://www.postgresql.org/download/**
-   **დაკლონეთ ეს რეპოზიტორია git bash ით: `git clone https://git.emis.ge/VET/vet {project_name}`**
-   **გადმოწერეთ და დააინსტალირეთ node.js: https://nodejs.org/en/download/**
-   **დააინსტალირეთ იარნი ბრძანებით `npm i -g yarn`**

### სერვერის მოწყობა და დასტარტვა:

-   **დადექით პროექტის დირექტორიაში და გაუშვით ბრძანება: `composer install`**
-   **დააკოპირეთ `.env.example` ფაილი და ჩასვით როგორც `.env`, `.env` ფაილში შეცვალეთ ბაზის პარამეტრები**
-   **ბაზის მიგრაციისთვის გაუშვით ბრძანება: `php vet migrate` შემდეგ `php vet db:seed`**
-   **გასაღების დასაგენერირებლად გაუშვით ბრძანება: `php vet key:generate`**
-   **პროექტის დასასტარტად გაუშვით ბრძანება: `php vet serv`**
-   **🍻 მორჩა**

### ფრონტენდის მოწყობა და დასტარტვა:

-   **პროექტის დირექტორიაში გაუშვით ბრძანება `yarn`**
-   **გაუშვით ბრძანება `yarn serve`**
-   **🍻 მორჩა**

## Git Commit Message სტრუქტურა

პროექტში გამოყენებულია კონვენციური კომიტების სტრუქტურა, რომლის შესახებაც შეგიძლიათ გაიგოთ დოკუმენტაციიდან: https://www.conventionalcommits.org/en/v1.0.0/

კომიტების მარტივი კონსტრურირებისთვის შეგიძლიათ გამოიყენოთ ბრძანება `yarn commit`
