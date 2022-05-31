<?php
/**
 * Copyright (c) 2020. DW Web-Engineering, all rights reserved.
 */

namespace Translations;

/**
 * Interface TransInterface
 * @package Translations
 */
interface TransInterface
{
    /**
     * @return mixed
     */
    public function register();

    /**
     * @param $original
     * @return mixed
     */
    public function getText($original);

    /**
     * @param array $input
     * @return mixed
     */
    public function getExtensionText(array $input);
}