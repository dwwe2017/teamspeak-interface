<?php

namespace Webmasters\Doctrine\ORM;

use \Doctrine\ORM\Configuration, \Doctrine\ORM\Events, \Doctrine\DBAL\DriverManager, \Doctrine\Common\EventManager, \Doctrine\DBAL\Types;

class EntityManager extends \Doctrine\ORM\EntityManager
{
    public static function create($conn, Configuration $config, EventManager $eventManager = null)
    {
        parent::create($conn, $config, $eventManager);

        if (is_array($conn)) {
            $prefix = isset($conn['prefix']) ? $conn['prefix'] : '';

            $conn = DriverManager::getConnection(
                $conn,
                $config,
                ($eventManager ? : new EventManager())
            );

            $evm = $conn->getEventManager();

            // Table Prefix
            $tablePrefix = new Listener\TablePrefix($prefix);
            $evm->addEventListener(Events::loadClassMetadata, $tablePrefix);
        }

        // Fix stricter type checks of newer DBAL versions
        Types\Type::overrideType(Types\Type::DATE, 'Webmasters\Doctrine\DBAL\Types\DateType');
        Types\Type::overrideType(Types\Type::DATETIME, 'Webmasters\Doctrine\DBAL\Types\DateTimeType');
        Types\Type::overrideType(Types\Type::DATETIMETZ, 'Webmasters\Doctrine\DBAL\Types\DateTimeTzType');
        Types\Type::overrideType(Types\Type::TIME, 'Webmasters\Doctrine\DBAL\Types\TimeType');

        return new EntityManager($conn, $config, $evm);
    }

    public function getValidator($entity, $validator = null)
    {
        if (!$validator) {
            $class = $this->parseClass(
                \Doctrine\Common\Util\ClassUtils::getClass($entity)
            );
            $validator = 'Validators\\' . $class['classname'] . 'Validator';
        }

        if (!class_exists($validator)) {
            throw new \Exception(
                sprintf('Validator class %s missing', $validator)
            );
        }

        return new $validator($this, $entity);
    }

    /* Link: http://php.net/manual/de/function.get-class.php#107964 */
    protected function parseClass($class)
    {
        return [
            'namespace' => array_slice(explode('\\', $class), 0, -1),
            'classname' => join('', array_slice(explode('\\', $class), -1)),
        ];
    }
}
