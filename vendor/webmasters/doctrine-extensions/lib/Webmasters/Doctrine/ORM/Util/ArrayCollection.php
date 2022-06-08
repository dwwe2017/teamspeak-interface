<?php

namespace Webmasters\Doctrine\ORM\Util;

class ArrayCollection
{
    public static function getUniques($collection)
    {
        $array = $collection->toArray();
        return array_unique($array);
    }

    public static function getDuplicates($collection)
    {
        $array = $collection->toArray();
        return array_unique(array_diff_assoc($array, array_unique($array)));
    }
}
