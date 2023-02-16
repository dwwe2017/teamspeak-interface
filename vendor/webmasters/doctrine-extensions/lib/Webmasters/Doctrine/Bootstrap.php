<?php

namespace Webmasters\Doctrine;

// Kurznamen der zentralen Doctrine Namespaces anlegen
use \Doctrine\Common, \Doctrine\DBAL, \Doctrine\ORM;

// Alias der Webmasters Doctrine Extensions anlegen
use \Webmasters\Doctrine\ORM as WORM;

class Bootstrap
{
    protected static $singletonInstance = null;

    protected $connectionOptions = [];
    protected $applicationOptions = [];

    protected $annotationReader;
    protected $cache;
    protected $cachedAnnotationReader;
    protected $driverChain;
    protected $listeners;
    protected $ormConfiguration;

    protected $eventManager;
    protected $entityManager;

    protected function __construct($connectionOptions, $applicationOptions)
    {
        $vendorDir = realpath(__DIR__ . '/../../../../..');
        $baseDir = dirname($vendorDir);
        $host = php_uname('n');

        if (empty($connectionOptions)) {
            $path = $baseDir . '/config/';
            if (file_exists($path . $host . '-config.php')) {
                require_once $path . $host . '-config.php';
            } elseif (file_exists($path . 'default-config.php')) {
                require_once $path . 'default-config.php';
            } else {
                die(sprintf('"config/default-config.php" or "config/%s-config.php" missing!', $host));
            }
        }

        $defaultOptions = [
            'autogenerate_proxy_classes' => true,
            'base_dir' => $baseDir,
            'debug_mode' => true,
            'em_class' => '\\Webmasters\\Doctrine\\ORM\\EntityManager',
            'entity_dir' => $baseDir . '/src/Entities',
            'gedmo_ext' => ['Timestampable'],
            'proxy_dir' => realpath(ini_get('session.save_path')), // Ablage im Temp-Verzeichnis mit sys_get_temp_dir()
            'vendor_dir' => $vendorDir,
        ];

        $this->setConnectionOptions($connectionOptions);
        $this->setApplicationOptions($applicationOptions + $defaultOptions);
        $this->errorMode();
    }

    protected function __clone()
    {
    }

    public static function getInstance($connectionOptions = [], $applicationOptions = [])
    {
        if (self::$singletonInstance == null) {
            self::$singletonInstance = new Bootstrap($connectionOptions, $applicationOptions);
        }

        return self::$singletonInstance;
    }

    public function getApplicationOptions()
    {
        return $this->applicationOptions;
    }

    public function setOption($key, $value)
    {
        $this->applicationOptions->set($key, $value);
    }

    public function getOption($key)
    {
        return $this->getApplicationOptions()->get($key);
    }

    public function isDebug()
    {
        return $this->getOption('debug_mode') === true;
    }

    public function getCache()
    {
        if ($this->cache === null) {
            $this->cache = $this->getOption('cache');
            if (!is_object($this->cache)) {
                $this->cache = new $this->cache();
            }
        }

        return $this->cache;
    }

    public function getAnnotationReader()
    {
        if ($this->annotationReader === null) {
            $this->annotationReader = new Common\Annotations\AnnotationReader();
        }

        return $this->annotationReader;
    }

    public function getCachedAnnotationReader()
    {
        if ($this->cachedAnnotationReader === null) {
            $this->cachedAnnotationReader = new Common\Annotations\CachedReader(
                $this->getAnnotationReader(),
                $this->getCache(),
                $this->isDebug()
            );
        }

        return $this->cachedAnnotationReader;
    }

    public function getDriverChain()
    {
        if ($this->driverChain === null) {
            $this->driverChain = new ORM\Mapping\Driver\DriverChain();

            $ormDir = realpath($this->getOption('vendor_dir') . '/doctrine/orm/lib/Doctrine/ORM');

            // Sicherheitshalber die Datei fuer die Standard Doctrine Annotationen registrieren
            Common\Annotations\AnnotationRegistry::registerFile(
                $ormDir . '/Mapping/Driver/DoctrineAnnotations.php'
            );

            // Gedmo Annotationen aktivieren sofern Paket installiert
            if ($this->getOption('gedmo_ext')) {
                if (class_exists('\\Gedmo\\DoctrineExtensions')) {
                    \Gedmo\DoctrineExtensions::registerAbstractMappingIntoDriverChainORM(
                        $this->driverChain,
                        $this->getCachedAnnotationReader()
                    );
                } else {
                    die('"gedmo/doctrine-extensions" missing!');
                }
            }

            // Wir verwenden die neue Annotations-Syntax für die Entities
            $annotationDriver = new ORM\Mapping\Driver\AnnotationDriver(
                $this->getCachedAnnotationReader(),
                [$this->getOption('entity_dir')]
            );

            // AnnotationDriver fuer den Entity-Namespace aktivieren
            $this->driverChain->addDriver($annotationDriver, $this->getOption('entity_namespace'));
        }

        return $this->driverChain;
    }

    public function getOrmConfiguration()
    {
        if ($this->ormConfiguration === null) {
            $this->ormConfiguration = new ORM\Configuration();

            // Teile Doctrine mit, wie es mit Proxy-Klassen umgehen soll
            $this->ormConfiguration->setProxyNamespace('Proxies');
            $this->ormConfiguration->setProxyDir($this->getOption('proxy_dir'));
            $this->ormConfiguration->setAutoGenerateProxyClasses($this->getOption('autogenerate_proxy_classes'));

            // Ergaenze die DriverChain in der Konfiguration
            $this->ormConfiguration->setMetadataDriverImpl($this->getDriverChain());

            // Cache fuer Metadaten, Queries und Results benutzen
            $cache = $this->getCache();
            $this->ormConfiguration->setMetadataCacheImpl($cache);
            $this->ormConfiguration->setQueryCacheImpl($cache);
            $this->ormConfiguration->setResultCacheImpl($cache);
        }

        return $this->ormConfiguration;
    }

    public function getListener($ext, $name)
    {
        if (!isset($this->listeners[$ext][$name])) {
            throw new \Exception(
                sprintf('Listener "%s\%s" missing', $ext, $name)
            );
        }

        return $this->listeners[$ext][$name];
    }

    public function getEventManager()
    {
        if ($this->eventManager === null) {
            $this->eventManager = new Common\EventManager();

            // Erweiterungen aktivieren
            $this->initGedmoListeners();

            // MySQL set names UTF-8
            $this->eventManager->addEventSubscriber(new DBAL\Event\Listeners\MysqlSessionInit());
        }

        return $this->eventManager;
    }

    public function getEm()
    {
        if ($this->entityManager === null) {
            $className = $this->getOption('em_class');
            $this->entityManager = $className::create(
                $this->connectionOptions,
                $this->getOrmConfiguration(),
                $this->getEventManager()
            );
        }

        return $this->entityManager;
    }

    protected function setConnectionOptions($options)
    {
        $this->connectionOptions = $options;
    }

    protected function setApplicationOptions($options)
    {
        if (!isset($options['entity_namespace'])) {
            $options['entity_namespace'] = basename($options['entity_dir']);
        }

        if (!isset($options['cache'])) {
            $className = '\\Doctrine\\Common\Cache\\'; // Namespace

            if (!$options['debug_mode'] && function_exists('apc_store')) {
                $className .= 'ApcCache'; // Only use APC in production environment
            } else {
                $className .= 'ArrayCache';
            }

            $options['cache'] = $className;
        }

        $this->applicationOptions = new WORM\Util\OptionsCollection($options);
    }

    // *** Display Errors In Debug Mode (Default: true) ***
    protected function errorMode()
    {
        if (!$this->isDebug()) {
            error_reporting(null);
            ini_set('display_errors', 0); // nur bei nicht fatalen Fehlern
        } else {
            error_reporting(E_ALL);
            ini_set('display_errors', 1);
            if (!ini_get('display_errors')) {
                die('Enable display_errors in php.ini!');
            }
        }
    }

    protected function initGedmoListeners()
    {
        if ($this->getOption('gedmo_ext') && is_array($this->getOption('gedmo_ext'))) {
            $this->listeners['Gedmo'] = [];
            foreach ($this->getOption('gedmo_ext') as $name) {
                if (is_string($name)) {
                    $listenerClass = '\\Gedmo\\' . $name . '\\' . $name . 'Listener';
                    $listener = new $listenerClass();
                    $this->listeners['Gedmo'][$name] = $listener;
                }

                $listener->setAnnotationReader($this->getCachedAnnotationReader());
                $this->eventManager->addEventSubscriber($listener);
            }
        }
    }
}
