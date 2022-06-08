# doctrine-extensions for PHP 7.1+

## Webmasters Doctrine Extensions

Just Another Doctrine2 Extension

### Bootstrap

```php
<?php

// MySQL database configuration
$connectionOptions = [
    'default' => [
        'driver' => 'pdo_mysql',
        'dbname' => 'example_db',
        'host' => 'localhost',
        'user' => 'root',
        'password' => '',
        'prefix' => '',
    ],
];

// Application/Doctrine configuration
$applicationOptions = [
    'debug_mode' => true, // in production environment false
];

// Use Composer autoloading
require_once 'vendor/autoload.php';

// Get Doctrine entity manager
$bootstrap = Webmasters\Doctrine\Bootstrap::getInstance(
    $connectionOptions,
    $applicationOptions
);

$em = $bootstrap->getEm();

```

### Changelog
#### 2019-09-08
Now supporting PHP 7.3 (Doctrine 2.6.3 or above)

#### 2019-06-08
Changed method name validateData to executeValidation, to prevent collisions with an attribute $data in the validated class (thx Peter R).