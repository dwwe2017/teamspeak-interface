<?php

namespace Webmasters\Doctrine\ORM\Listener;

/**
 * Listener to enable table prefixes
 *
 * @link http://elephpants.blog.redpill-linpro.com/2010/11/25/doctrine-2-table-prefixes-with-many-to-many-jointable/
 * @author Daniel André
 */
use \Doctrine\ORM\Event\LoadClassMetadataEventArgs;

class TablePrefix
{
    protected $prefix = '';

    public function __construct($prefix)
    {
        $this->prefix = (string)$prefix;
    }

    public function loadClassMetadata(LoadClassMetadataEventArgs $eventArgs)
    {
        $classMetadata = $eventArgs->getClassMetadata();
        $classMetadata->setPrimaryTable(
            ['name' => $this->prefix . $classMetadata->getTableName()]
        );

        foreach ($classMetadata->getAssociationMappings() as $fieldName => $mapping) {
            if (
                $mapping['type'] == \Doctrine\ORM\Mapping\ClassMetadataInfo::MANY_TO_MANY &&
                !empty($classMetadata->associationMappings[$fieldName]['joinTable'])
            ) {
                $mappedTableName = $classMetadata->associationMappings[$fieldName]['joinTable']['name'];
                $classMetadata->associationMappings[$fieldName]['joinTable']['name'] = $this->prefix . $mappedTableName;
            }
        }
    }
}
