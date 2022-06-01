<?php

namespace Webmasters\Doctrine\DBAL\Types;

/**
 * Modify Doctrine DateTime type to allow our custom class as value
 *
 * @link https://github.com/doctrine/dbal/issues/2794
 * @link https://github.com/doctrine/dbal/commit/912b2b8bb71e560bd7269bdeae00b4c8a7470f25
 * @link https://www.doctrine-project.org/projects/doctrine-orm/en/2.6/cookbook/custom-mapping-types.html
 */
use \Doctrine\DBAL\Types\TimeType as OldTimeType;
use \Doctrine\DBAL\Platforms\AbstractPlatform;

class TimeType extends OldTimeType
{
    public function convertToDatabaseValue($value, AbstractPlatform $platform)
    {
        if ($value instanceof \Webmasters\Doctrine\ORM\Util\DateTime) {
            $value = $value->getDateTime();
        }
        
        return parent::convertToDatabaseValue($value, $platform);
    }
}
