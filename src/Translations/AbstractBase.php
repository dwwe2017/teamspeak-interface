<?php
/**
 * Copyright (c) 2020. DW Web-Engineering, all rights reserved.
 */

namespace Translations;

/**
 * Class AbstractBase
 * @package Translations
 */
abstract class AbstractBase implements TransInterface
{
    /**
     * @var AbstractBase|null
     */
    public static $current;

    /**
     * @return mixed
     */
    public function register()
    {
        $previous = self::$current;
        self::$current = $this;
        static::includeMagic();
        return $previous;
    }

    /**
     *
     */
    public function includeMagic()
    {
        include_once __DIR__."/__macig.php";
    }
}