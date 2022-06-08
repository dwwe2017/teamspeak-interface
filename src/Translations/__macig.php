<?php
/**
 * Copyright (c) 2020. DW Web-Engineering, all rights reserved.
 */

use Translations\AbstractBase;

/**
 * @param $original
 * @return string
 */
function __($original)
{
    try
    {
        $current = AbstractBase::$current;

        if(is_null($current)){
            return $original;
        }

        $text = $current->getText($original);

        if (func_num_args() === 1) {
            return $text;
        }

        $args = array_slice(func_get_args(), 1);
        return is_array($args[0]) ? strtr($text, $args[0]) : vsprintf($text, $args);
    }
    catch (Exception $e)
    {
        return $original;
    }
}

/**
 * @param array $input
 * @return string
 */
function __e(array $input)
{
    try
    {
        $current = AbstractBase::$current;

        if(is_null($current)){
            return $input[1];
        }

        $text = $current->getExtensionText($input);

        if (func_num_args() === 1) {
            return $text;
        }

        $args = array_slice(func_get_args(), 1);
        return is_array($args[0]) ? strtr($text, $args[0]) : vsprintf($text, $args);
    }
    catch (Exception $e)
    {
        return $input[1];
    }
}