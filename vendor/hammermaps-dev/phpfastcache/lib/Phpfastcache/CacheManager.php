<?php
/**
 *
 * This file is part of phpFastCache.
 *
 * @license MIT License (MIT)
 *
 * For full copyright and license information, please see the docs/CREDITS.txt file.
 *
 * @author Khoa Bui (khoaofgod)  <khoaofgod@gmail.com> https://www.phpfastcache.com
 * @author Georges.L (Geolim4)  <contact@geolim4.com>
 *
 */
declare(strict_types=1);

namespace Phpfastcache;

use Phpfastcache\Config\ConfigurationOption;
use Phpfastcache\Core\Pool\ExtendedCacheItemPoolInterface;
use Phpfastcache\Exceptions\{
    PhpfastcacheDriverCheckException, PhpfastcacheDriverException, PhpfastcacheDriverNotFoundException, PhpfastcacheExceptionInterface, PhpfastcacheInstanceNotFoundException, PhpfastcacheInvalidArgumentException, PhpfastcacheInvalidConfigurationException, PhpfastcacheLogicException, PhpfastcacheRootException, PhpfastcacheUnsupportedOperationException
};
use Phpfastcache\Util\ClassNamespaceResolverTrait;

/**
 * Class CacheManager
 * @package phpFastCache
 *
 * @method static ExtendedCacheItemPoolInterface Apc() Apc($config = []) Return a driver "Apc" instance
 * @method static ExtendedCacheItemPoolInterface Apcu() Apcu($config = []) Return a driver "Apcu" instance
 * @method static ExtendedCacheItemPoolInterface Cassandra() Cassandra($config = []) Return a driver "Cassandra" instance
 * @method static ExtendedCacheItemPoolInterface Cookie() Cookie($config = []) Return a driver "Cookie" instance
 * @method static ExtendedCacheItemPoolInterface Couchbase() Couchbase($config = []) Return a driver "Couchbase" instance
 * @method static ExtendedCacheItemPoolInterface Couchdb() Couchdb($config = []) Return a driver "Couchdb" instance
 * @method static ExtendedCacheItemPoolInterface Devnull() Devnull($config = []) Return a driver "Devnull" instance
 * @method static ExtendedCacheItemPoolInterface Files() Files($config = []) Return a driver "files" instance
 * @method static ExtendedCacheItemPoolInterface Leveldb() Leveldb($config = []) Return a driver "Leveldb" instance
 * @method static ExtendedCacheItemPoolInterface Memcache() Memcache($config = []) Return a driver "Memcache" instance
 * @method static ExtendedCacheItemPoolInterface Memcached() Memcached($config = []) Return a driver "Memcached" instance
 * @method static ExtendedCacheItemPoolInterface Memstatic() Memstatic($config = []) Return a driver "Memstatic" instance
 * @method static ExtendedCacheItemPoolInterface Mongodb() Mongodb($config = []) Return a driver "Mongodb" instance
 * @method static ExtendedCacheItemPoolInterface Predis() Predis($config = []) Return a driver "Predis" instance
 * @method static ExtendedCacheItemPoolInterface Redis() Redis($config = []) Return a driver "Pedis" instance
 * @method static ExtendedCacheItemPoolInterface Riak() Riak($config = []) Return a driver "Riak" instance
 * @method static ExtendedCacheItemPoolInterface Sqlite() Sqlite($config = []) Return a driver "Sqlite" instance
 * @method static ExtendedCacheItemPoolInterface Ssdb() Ssdb($config = []) Return a driver "Ssdb" instance
 * @method static ExtendedCacheItemPoolInterface Wincache() Wincache($config = []) Return a driver "Wincache" instance
 * @method static ExtendedCacheItemPoolInterface Xcache() Xcache($config = []) Return a driver "Xcache" instance
 * @method static ExtendedCacheItemPoolInterface Zenddisk() Zenddisk($config = []) Return a driver "Zend disk cache" instance
 * @method static ExtendedCacheItemPoolInterface Zendshm() Zendshm($config = []) Return a driver "Zend memory cache" instance
 *
 */
class CacheManager
{
    const AUTOMATIC_DRIVER_CLASS = 'Auto';
    const CORE_DRIVER_NAMESPACE = 'Phpfastcache\Drivers\\';

    use ClassNamespaceResolverTrait;

    /**
     * @var ConfigurationOption
     */
    protected static $config;

    /**
     * @var int
     */
    public static $ReadHits = 0;

    /**
     * @var int
     */
    public static $WriteHits = 0;

    /**
     * @var string
     */
    protected static $namespacePath;

    /**
     * @var ExtendedCacheItemPoolInterface[]
     */
    protected static $instances = [];

    /**
     * @var array
     */
    protected static $driverOverrides = [];

    /**
     * @var array
     */
    protected static $driverCustoms = [];

    /**
     * @var array
     */
    protected static $badPracticeOmeter = [];

    /**
     * @var array
     */
    protected static $error_msgs = [];

    /**
     * @param string $driver
     * @param array|ConfigurationOption $config
     * @param string $instanceId
     *
     * @return ExtendedCacheItemPoolInterface
     *
     * @throws PhpfastcacheDriverCheckException
     * @throws PhpfastcacheDriverException
     * @throws PhpfastcacheDriverNotFoundException
     * @throws PhpfastcacheInvalidArgumentException
     * @throws PhpfastcacheInvalidConfigurationException
     * @throws PhpfastcacheLogicException
     * @throws PhpfastcacheUnsupportedOperationException
     * @throws \ReflectionException
     */
    public static function getInstance(string $driver = self::AUTOMATIC_DRIVER_CLASS, $config = null, string $instanceId = null, bool $init = false): ExtendedCacheItemPoolInterface
    {
        $config = self::validateConfig($config);
        $driver = self::standardizeDriverName($driver);

        if (!$driver || $driver === self::AUTOMATIC_DRIVER_CLASS) {
            $driver = self::getAutoClass($config);
        }

        $instanceId = $instanceId ?: \md5($driver . \serialize($config->toArray()));

        if (!isset(self::$instances[$instanceId]) || $init) {
            self::$badPracticeOmeter[$driver][$instanceId] = 1;
            $driverClass = self::validateDriverClass(self::getDriverClass($driver));

            if (\class_exists($driverClass)) {
                $configClass = $driverClass::getConfigClass();
                self::$instances[$instanceId]['instance'] = new $driverClass(new $configClass($config->toArray()), $instanceId);

                if(self::$instances[$instanceId]['instance']->isFallback()) {
                    self::$instances[$instanceId]['instance'] = self::getFallbackInstance($driver, $config, $instanceId);
                    self::$instances[$instanceId]['fallback'] = true;
                } else {
                    self::$instances[$instanceId]['fallback'] = false;
                    self::$badPracticeOmeter[$driver][$instanceId]++;
                }

                self::$instances[$instanceId]['instance']->setEventManager(EventManager::getInstance());
            } else {
                throw new PhpfastcacheDriverNotFoundException(\sprintf('The driver "%s" does not exists', $driver));
            }
        } else {
            if (array_key_exists($driver,self::$badPracticeOmeter) &&
                array_key_exists($instanceId,self::$badPracticeOmeter[$driver])
                && self::$badPracticeOmeter[$driver][$instanceId] >= 2) {
                \trigger_error('[' . $driver . '][' . $instanceId . '] Calling many times CacheManager::getInstance() for already instanced drivers is a bad practice and have a significant impact on performances.
           See https://github.com/PHPSocialNetwork/phpfastcache/wiki/[V5]-Why-calling-getInstance%28%29-each-time-is-a-bad-practice-%3F');
            }
        }

        return self::$instances[$instanceId]['instance'];
    }

    /**
     * @param string $driver
     * @param ConfigurationOption $config
     * @param string $instanceId
     * @return ExtendedCacheItemPoolInterface
     * @throws PhpfastcacheDriverCheckException
     * @throws PhpfastcacheDriverException
     * @throws PhpfastcacheDriverNotFoundException
     * @throws PhpfastcacheInvalidConfigurationException
     * @throws PhpfastcacheLogicException
     * @throws PhpfastcacheUnsupportedOperationException
     * @throws \ReflectionException
     */
    protected static function getFallbackInstance(string $driver, ConfigurationOption $config, string $instanceId = null): ExtendedCacheItemPoolInterface
    {
        if ($config->getFallback()) {
            try {
                $fallback_driver = $config->getFallback();
                $instance = self::getInstance($fallback_driver, $config->getFallbackConfig(),$instanceId, true);
                $instance->setIsFallback(true);
                $instance->setFallbackMsg(['driver'=>ucfirst($driver),'instanceId'=>ucfirst($instanceId),'fallback_driver'=>$fallback_driver]);
                return $instance;
            } catch (PhpfastcacheInvalidArgumentException $e) {
                throw new PhpfastcacheInvalidConfigurationException('Invalid fallback driver configuration', 0, $e);
            }
        }
    }

    /**
     * @param string $instanceId
     * @return ExtendedCacheItemPoolInterface
     * @throws PhpfastcacheInstanceNotFoundException
     */
    public static function getInstanceById(string $instanceId): ExtendedCacheItemPoolInterface
    {
        if (isset(self::$instances[$instanceId])) {
            return self::$instances[$instanceId]['instance'];
        }

        throw new PhpfastcacheInstanceNotFoundException(\sprintf('Instance ID %s not found', $instanceId));
    }

    /**
     * @param string $instanceId
     * @return bool
     * @throws PhpfastcacheInstanceNotFoundException
     */
    public static function hasFallback(string $instanceId): bool
    {
        if (isset(self::$instances[$instanceId])) {
            return self::$instances[$instanceId]['fallback'];
        }

        throw new PhpfastcacheInstanceNotFoundException(\sprintf('Instance ID %s not found', $instanceId));
    }

    /**
     * Return the list of instances
     *
     * @return ExtendedCacheItemPoolInterface[]
     */
    public static function getInstances(): array
    {
        return self::$instances;
    }

    /**
     * This method is intended for internal
     * use only and should not be used for
     * any external development use the
     * getInstances() method instead
     *
     * @todo Use a proper way to passe them as a reference ?
     * @internal
     * @return ExtendedCacheItemPoolInterface[]
     */
    public static function &getInternalInstances(): array
    {
        return self::$instances;
    }

    /**
     * @param ConfigurationOption $config
     * @return string
     * @throws PhpfastcacheDriverException
     * @throws PhpfastcacheDriverNotFoundException
     * @throws PhpfastcacheInvalidArgumentException
     * @throws PhpfastcacheInvalidConfigurationException
     * @throws PhpfastcacheLogicException
     * @throws PhpfastcacheUnsupportedOperationException
     * @throws \ReflectionException
     */
    public static function getAutoClass(ConfigurationOption $config): string
    {
        static $autoDriver;

        if ($autoDriver === null) {
            foreach (self::getDriverList() as $driver) {
                /** @var ExtendedCacheItemPoolInterface $driverClass */
                $driverClass = self::CORE_DRIVER_NAMESPACE . $driver . '\Driver';
                if ($driverClass::isUsableInAutoContext()) {
                    try {
                        self::getInstance($driver, $config);
                        $autoDriver = $driver;
                        break;
                    } catch (PhpfastcacheDriverCheckException $e) {
                        continue;
                    }
                }
            }
        }

        if (!$autoDriver || !\is_string($autoDriver)) {
            throw new PhpfastcacheLogicException('Unable to find out a valid driver automatically');
        }

        self::$badPracticeOmeter[$autoDriver]--;

        return $autoDriver;
    }

    /**
     * @param string $name
     * @param array $arguments
     * @return ExtendedCacheItemPoolInterface
     * @throws PhpfastcacheDriverCheckException
     * @throws PhpfastcacheDriverException
     * @throws PhpfastcacheDriverNotFoundException
     * @throws PhpfastcacheInvalidArgumentException
     * @throws PhpfastcacheInvalidConfigurationException
     * @throws PhpfastcacheLogicException
     * @throws PhpfastcacheUnsupportedOperationException
     * @throws \ReflectionException
     */
    public static function __callStatic(string $name, array $arguments): ExtendedCacheItemPoolInterface
    {
        $options = (\array_key_exists(0, $arguments) && \is_array($arguments) ? $arguments[0] : []);

        return self::getInstance($name, $options);
    }

    /**
     * @return bool
     */
    public static function clearInstances(): bool
    {
        self::$instances = [];

        \gc_collect_cycles();
        return !\count(self::$instances);
    }

    /**
     * @param string $instanceId
     * @since 7.0.4
     */
    public static function clearInstance(string $instanceId): void
    {
        if (isset(self::$instances[$instanceId])) {
            unset(self::$instances[$instanceId]);
            \gc_collect_cycles();
        }
    }

    /**
     * @return string
     */
    public static function getNamespacePath(): string
    {
        return self::$namespacePath ?: self::getDefaultNamespacePath();
    }

    /**
     * @return string
     */
    public static function getDefaultNamespacePath(): string
    {
        return self::CORE_DRIVER_NAMESPACE;
    }

    /**
     * @param ConfigurationOption $config
     */
    public static function setDefaultConfig(ConfigurationOption $config)
    {
        self::$config = $config;
    }

    /**
     * @return ConfigurationOption
     * @throws PhpfastcacheInvalidConfigurationException
     * @throws \ReflectionException
     */
    public static function getDefaultConfig(): ConfigurationOption
    {
        return self::$config ?: self::$config = new ConfigurationOption();
    }

    /**
     * Return the list of available drivers Capitalized
     * with optional FQCN as key
     *
     * @param bool $FQCNAsKey Describe keys with Full Qualified Class Name
     * @return string[]
     * @throws PhpfastcacheUnsupportedOperationException
     */
    public static function getDriverList(bool $FQCNAsKey = false): array
    {
        static $driverList;

        if (self::getDefaultNamespacePath() === self::getNamespacePath()) {
            if ($driverList === null) {
                $prefix = self::CORE_DRIVER_NAMESPACE;
                $classMap = self::createClassMap(__DIR__ . '/Drivers');
                $driverList = [];

                foreach ($classMap as $class => $file) {
                    $driverList[] = \str_replace($prefix, '', \substr($class, 0, \strrpos($class, '\\')));
                }

                $driverList = \array_values(\array_unique($driverList));
            }

            $driverList = \array_merge($driverList, \array_keys(self::$driverCustoms));

            if ($FQCNAsKey) {
                $realDriverList = [];
                foreach ($driverList as $driverName) {
                    $realDriverList[self::getDriverClass($driverName)] = $driverName;
                }
                $driverList = $realDriverList;
            }

            \asort($driverList);

            return $driverList;
        }

        throw new PhpfastcacheUnsupportedOperationException('Cannot get the driver list if the default namespace path has changed.');
    }

    /**
     * @param string $driverName
     * @return string
     */
    public static function standardizeDriverName(string $driverName): string
    {
        return \ucfirst(\strtolower(\trim($driverName)));
    }

    /**
     * @param string $driverName
     * @return string
     */
    public static function getDriverClass(string $driverName): string
    {
        if (!empty(self::$driverCustoms[$driverName])) {
            $driverClass = self::$driverCustoms[$driverName];
        } else {
            if (!empty(self::$driverOverrides[$driverName])) {
                $driverClass = self::$driverOverrides[$driverName];
            } else {
                $driverClass = self::getNamespacePath() . $driverName . '\Driver';
            }
        }

        return $driverClass;
    }

    /**
     * @param string $driverName
     * @param string $className
     * @throws \Phpfastcache\Exceptions\PhpfastcacheInvalidArgumentException
     * @throws \Phpfastcache\Exceptions\PhpfastcacheLogicException
     * @throws \Phpfastcache\Exceptions\PhpfastcacheUnsupportedOperationException
     * @return void
     */
    public static function addCustomDriver(string $driverName, string $className): void
    {
        $driverName = self::standardizeDriverName($driverName);

        if (empty($driverName)) {
            throw new PhpfastcacheInvalidArgumentException("Can't add a custom driver because its name is empty");
        }

        if (!\class_exists($className)) {
            throw new PhpfastcacheInvalidArgumentException(
                \sprintf("Can't add '%s' because the class '%s' does not exists", $driverName, $className)
            );
        }

        if (!empty(self::$driverCustoms[$driverName])) {
            throw new PhpfastcacheLogicException(\sprintf("Driver '%s' has been already added", $driverName));
        }

        if (\in_array($driverName, self::getDriverList(), true)) {
            throw new PhpfastcacheLogicException(\sprintf("Driver '%s' is already a part of the PhpFastCache core", $driverName));
        }

        self::$driverCustoms[$driverName] = $className;
    }

    /**
     * @param string $driverName
     * @throws \Phpfastcache\Exceptions\PhpfastcacheInvalidArgumentException
     * @throws \Phpfastcache\Exceptions\PhpfastcacheLogicException
     * @return void
     */
    public static function removeCustomDriver(string $driverName): void
    {
        $driverName = self::standardizeDriverName($driverName);

        if (empty($driverName)) {
            throw new PhpfastcacheInvalidArgumentException("Can't remove a custom driver because its name is empty");
        }

        if (!isset(self::$driverCustoms[$driverName])) {
            throw new PhpfastcacheLogicException(\sprintf("Driver '%s' does not exists", $driverName));
        }

        unset(self::$driverCustoms[$driverName]);
    }

    /**
     * @param string $driverName
     * @param string $className
     * @throws \Phpfastcache\Exceptions\PhpfastcacheInvalidArgumentException
     * @throws \Phpfastcache\Exceptions\PhpfastcacheLogicException
     * @throws \Phpfastcache\Exceptions\PhpfastcacheUnsupportedOperationException
     * @return void
     */
    public static function addCoreDriverOverride(string $driverName, string $className): void
    {
        $driverName = self::standardizeDriverName($driverName);

        if (empty($driverName)) {
            throw new PhpfastcacheInvalidArgumentException("Can't add a core driver override because its name is empty");
        }

        if (!\class_exists($className)) {
            throw new PhpfastcacheInvalidArgumentException(
                \sprintf("Can't override '%s' because the class '%s' does not exists", $driverName, $className)
            );
        }

        if (!empty(self::$driverOverrides[$driverName])) {
            throw new PhpfastcacheLogicException(\sprintf("Driver '%s' has been already overridden", $driverName));
        }

        if (!\in_array($driverName, self::getDriverList(), true)) {
            throw new PhpfastcacheLogicException(\sprintf("Driver '%s' can't be overridden since its not a part of the PhpFastCache core", $driverName));
        }

        if (!\is_subclass_of($className, self::CORE_DRIVER_NAMESPACE . $driverName . '\\Driver', true)) {
            throw new PhpfastcacheLogicException(
                \sprintf("Can't override '%s' because the class '%s' MUST extend '%s'", $driverName, $className,
                    self::CORE_DRIVER_NAMESPACE . $driverName . '\\Driver')
            );
        }

        self::$driverOverrides[$driverName] = $className;
    }

    /**
     * @param string $driverName
     * @throws \Phpfastcache\Exceptions\PhpfastcacheInvalidArgumentException
     * @throws \Phpfastcache\Exceptions\PhpfastcacheLogicException
     * @return void
     */
    public static function removeCoreDriverOverride(string $driverName): void
    {
        $driverName = self::standardizeDriverName($driverName);

        if (empty($driverName)) {
            throw new PhpfastcacheInvalidArgumentException("Can't remove a core driver override because its name is empty");
        }

        if (!isset(self::$driverOverrides[$driverName])) {
            throw new PhpfastcacheLogicException(\sprintf("Driver '%s' were not overridden", $driverName));
        }

        unset(self::$driverOverrides[$driverName]);
    }

    /**
     * @param array|ConfigurationOption
     * @return ConfigurationOption
     * @throws PhpfastcacheInvalidArgumentException
     * @throws PhpfastcacheInvalidConfigurationException
     * @throws \ReflectionException
     */
    protected static function validateConfig($config): ConfigurationOption
    {
        if (\is_array($config)) {
            $config = new ConfigurationOption($config);
            \trigger_error(
                'The CacheManager will drops the support of primitive configuration arrays, use a "\Phpfastcache\Config\ConfigurationOption" object instead',
                E_USER_DEPRECATED
            );
        } elseif ($config === null) {
            $config = self::getDefaultConfig();
        } else {
            if (!($config instanceof ConfigurationOption)) {
                throw new PhpfastcacheInvalidArgumentException(\sprintf('Unsupported config type: %s', \gettype($config)));
            }
        }

        return $config;
    }

    /**
     * @param string $driverClass
     * @return string
     * @throws PhpfastcacheDriverException
     */
    protected static function validateDriverClass(string $driverClass): string
    {
        if (!\is_a($driverClass, ExtendedCacheItemPoolInterface::class, true)) {
            throw new PhpfastcacheDriverException(\sprintf(
                'Class "%s" does not implement "%s"',
                $driverClass,
                ExtendedCacheItemPoolInterface::class
            ));
        }
        return $driverClass;
    }
}
