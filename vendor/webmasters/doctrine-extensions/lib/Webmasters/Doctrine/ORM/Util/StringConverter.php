<?php

namespace Webmasters\Doctrine\ORM\Util;

class StringConverter
{
    public static function decamelize($camelCase)
    {
        return ltrim(
              strtolower(
                  preg_replace('/([A-Z])/', '_$1', $camelCase)
              ),
              '_'
        );
    }

    public static function camelize($underscore)
    {
        return str_replace(
            ' ',
            '',
            ucwords(
                 str_replace('_', ' ', $underscore)
            )
        );
    }

    public static function camelizeLcFirst($underscore)
    {
        return lcfirst(
            self::camelize($underscore)
        );
    }
}
