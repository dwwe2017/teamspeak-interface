<?php
/**
 * Copyright (c) 2020. DW Web-Engineering, all rights reserved.
 */

use Helper\SimpleBot;

ini_set('display_errors', true);
ini_set('display_startup_errors', true);
error_reporting(E_ALL);

$default_config = __DIR__ . '/../config/default-config.php';

require_once __DIR__ . '/../vendor/planetteamspeak/ts3-php-framework/libraries/TeamSpeak3/TeamSpeak3.php';
require_once __DIR__ . '/../src/Translations/TransInterface.php';
require_once __DIR__ . '/../src/Translations/AbstractBase.php';
require_once __DIR__ . '/../src/Translations/Translation.php';
require_once __DIR__ . '/../src/Helper/SimpleBot.php';

if (!function_exists("loadFile")) {
    /**
     * @param string $path
     * @param bool $noBOM
     * @param bool $noException
     * @return bool|false|string
     * @throws Exception
     */
    function loadFile(string $path, bool $noBOM = true, bool $noException = false)
    {
        // For local files
        if (strlen($path) > PHP_MAXPATHLEN) {
            // sprintf for Translation
            throw new Exception(sprintf("The path %s is to long", $path));
        } elseif (@file_exists($path) && @is_file($path) && is_readable($path)) {
            $data = @file_get_contents($path);
        } else if (!$noException) {
            // sprintf for translation
            throw new Exception(sprintf("The file %s can not be loaded, is corrupted or missing", $path));
        } else {
            return false;
        }

        //strip utf8 BOM in data files
        if ($noBOM && substr(bin2hex($data), 0, 6) === 'efbbbf') {
            $data = substr($data, 3);
        }

        return $data;
    }
}

if (!function_exists("saveFile")) {
    /**
     * @param string $path
     * @param $content
     * @param int $flags
     * @return bool
     * @throws Exception
     */
    function saveFile(string $path, $content, $flags = 0): bool
    {
        if (strlen($path) > PHP_MAXPATHLEN) {
            throw new Exception('The path "' . $path . '" is to long.');
        }

        if (($result = @file_put_contents($path, $content, $flags)) === false || ($result < strlen($content))) {
            throw new Exception('The file "' . $path . '" could not be written to. Check your disk space and file permissions.');
        }

        return true;
    }
}

if (file_exists($default_config)) {
    /** @noinspection PhpIncludeInspection */
    require_once $default_config;
}

if (!isset($argv[1]) || empty($argv[1])) {
    exit("Simple Bot id is missing");
} else {
    $sbId = $argv[1];

    try {
        run($sbId, $connectionOptions, $applicationOptions);
    } catch (Exception $e) {
        /** @noinspection PhpUnhandledExceptionInspection */
        throw $e;
    }

    exit(false);
}

/**
 * @param $sbId
 * @param $connectionOptions
 * @param $applicationOptions
 * @throws Exception
 */
function run($sbId, $connectionOptions, $applicationOptions)
{
    try {

        $driver = $connectionOptions["driver"] ?? "mysql";
        if (strcasecmp($driver, "mysqli") == 0) {
            $driver = "mysql";
        }

        if ($connectionOptions["driver"] === "pdo_sqlite") {
            $pdo = new PDO(sprintf("sqlite:%s", $connectionOptions["path"]));
        } else {
            $pdo = new PDO(
                sprintf("%s:host=%s;dbname=%s", str_replace("pdo_", "", $driver), $connectionOptions["host"], $connectionOptions["dbname"]),
                $connectionOptions["user"], $connectionOptions["password"]
            );
        }

        $prefix = "tsi0_";
        if (key_exists("prefix", $connectionOptions)) {
            $prefix = $connectionOptions["prefix"];
        }

        $simple_bot = new SimpleBot($pdo, $sbId, $prefix, $applicationOptions);
        $simple_bot->run(true, 5);
    } catch (Exception $e) {
        if (strpos($e->getMessage(), "Error while sending QUERY packet") !== false) {
            run($sbId, $connectionOptions, $applicationOptions);
        }

        /** @noinspection PhpUnhandledExceptionInspection */
        throw $e;
    }
}