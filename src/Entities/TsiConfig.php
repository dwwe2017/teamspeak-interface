<?php
/**
 * Copyright (c) 2020. DW Web-Engineering, all rights reserved.
 */

/** @noinspection PhpUndefinedClassInspection */

namespace Entities;


use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Exception;
use Gedmo\Mapping\Annotation as GEDMO;
use Helper\ArrayMapper;
use Helper\UpdateHelper;
use Interfaces\MessageInterface;


/**
 * Class TsiConfig
 * @package Entities
 * @ORM\Entity
 * @ORM\Table(name="config")
 */
class TsiConfig implements MessageInterface
{
    /**
     * @var int
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer", length=11, nullable=false)
     */
    protected $id = 1;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"="Tea(m)speak Interface"})
     */
    protected $name = "Tea(m)speak Interface";

    /**
     * @var string
     * @ORM\Column(type="string", length=11, options={"default"="TSI"})
     */
    protected $shortcut = "TSI";

    /**
     * @var string
     * @ORM\Column(type="string", length=55, options={"default"="1.3.0.0"})
     */
    protected $version = "1.3.0.0";

    /**
     * @var null
     * @ORM\Column(type="string", length=510, nullable=true)
     */
    protected $serial_key = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=510, options={"default"="images/pkg-default"})
     */
    protected $icon_pkg = "images/pkg-default";

    /**
     * @var bool
     * @ORM\Column(type="boolean", options={"default"=false})
     */
    protected $db_converted = false;

    /**
     * @var string
     * @ORM\Column(type="string", length=55, options={"default"="Europe/Berlin"})
     */
    protected $timezone = "Europe/Berlin";

    /**
     * @var string
     * @ORM\Column(type="string", length=11, options={"default"="Y-m-d"})
     */
    protected $date_format = "Y-m-d";

    /**
     * @var DateTime|null
     * @GEDMO\Timestampable(on="change", field={"version"})
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $last_update;

    /**
     * @var float
     * @ORM\Column(type="float", nullable=true)
     */
    protected $last_update_check;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=110, nullable=true)
     */
    protected $base_update_url;

    /**
     * @var int
     * @ORM\Column(type="integer", length=1, options={"default"=0})
     */
    protected $auto_generate_proxy_classes = 0;

    /**
     * @var string
     * @ORM\Column(type="string", length=25, options={"default"="files"})
     */
    protected $cache_driver = "files";

    /**
     * @var int
     * @ORM\Column(type="integer", length=11, options={"default"=3600})
     */
    protected $cache_lifetime = 3600;

    /**
     * @var string
     * @ORM\Column(type="string", length=25, options={"default"="dedicated"})
     */
    protected $cache_type = "dedicated";

    /**
     * @var int
     * @ORM\Column(type="integer", length=1, options={"default"=0})
     */
    protected $cronjob_crontab = 0;

    /**
     * @var int
     * @ORM\Column(type="integer", length=1, options={"default"=0})
     */
    protected $cronjob_ajax = 0;

    /**
     * @var DateTime|null
     * @GEDMO\Timestampable(on="create")
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $created;

    /**
     * @var int
     * @ORM\Column(type="integer", length=1, options={"default"=0})
     */
    protected $intelli_multiling = 0;

    /**
     * @var null|string
     * @ORM\Column(type="text", nullable=true)
     */
    protected $options = null;

    /**
     * @var string
     * @ORM\Column(type="string", length=11, options={"default"="WARNING"})
     */
    protected $log_level = "WARNING";

    /**
     * @var int
     * @ORM\Column(type="string", length=510, nullable=true)
     */
    protected $maintenance = null;

    /**
     * TsiConfig constructor.
     * @param array $data
     */
    public function __construct(array $data = array())
    {
        ArrayMapper::setEntity($this)->setData($data);
    }

    /**
     * @return string|null
     */
    public function getBaseUpdateUrl(): ?string
    {
        return $this->base_update_url;
    }

    /**
     * @param string|null $base_update_url
     */
    public function setBaseUpdateUrl(?string $base_update_url): void
    {
        UpdateHelper::invalidate();
        $this->base_update_url = $base_update_url;
    }

    /**
     * @param string|null $maintenance
     */
    public function setMaintenance(?string $maintenance): void
    {
        $this->maintenance = $maintenance;
    }

    /**
     * @return string|null
     */
    public function getMaintenance(): ?string
    {
        return $this->maintenance;
    }

    /**
     * @return string
     */
    public function getCacheType(): string
    {
        return $this->cache_type;
    }

    /**
     * @param string $cache_type
     */
    public function setCacheType(string $cache_type)
    {
        switch ($cache_type) {
            case "shared":
                $cache_type = "shared";
                break;
            default:
                $cache_type = "dedicated";
                break;
        }

        $this->cache_type = $cache_type;
    }

    /**
     * @param array $cacheOptions
     */
    public function setCacheOptions(array $cacheOptions): void
    {
        $defaults = [
            'host' => '',
            'port' => 0,
            'db' => '',
            'user' => '',
            'pwd' => '',
            'timeout' => 1,
            'auth' => false,
            'ssl' => false,
            'persistent' => false,
            'compression' => false,
            'logging' => false
        ];

        foreach ($defaults as $key => $var) {
            if (!array_key_exists($key, $cacheOptions)) {
                $cacheOptions[$key] = $var;
            }
        }

        $options = json_decode(base64_decode($this->options), true);
        $options['CacheOptions'] = $cacheOptions;
        $this->options = base64_encode(json_encode($options));
    }

    /**
     * @return array
     */
    public function getCacheOptions(): array
    {
        $defaults = [
            'host' => '',
            'port' => 0,
            'db' => '',
            'user' => '',
            'pwd' => '',
            'timeout' => 1,
            'auth' => false,
            'ssl' => false,
            'persistent' => false,
            'compression' => false,
            'logging' => false
        ];

        if (empty($this->options)) {
            return $defaults;
        }

        $options = json_decode(base64_decode($this->options), true);
        if (!is_array($options) || !key_exists('CacheOptions', $options)) {
            return $defaults;
        }

        foreach ($defaults as $key => $data) {
            if (!array_key_exists($key, $options['CacheOptions'])) {
                //Set missing options
                $options['CacheOptions'][$key] = $data;
            }
        }

        return $options['CacheOptions'];
    }

    /**
     * @return int
     */
    public function getCacheLifetime(): int
    {
        return $this->cache_lifetime;
    }

    /**
     * @param int $cache_lifetime
     */
    public function setCacheLifetime(int $cache_lifetime)
    {
        $this->cache_lifetime = $cache_lifetime;
    }

    /**
     * @param string $append
     * @return string
     */
    public function getDateFormat(string $append = ""): string
    {
        return sprintf("%s%s", $this->date_format, $append);
    }

    /**
     * @param string $date_format
     */
    public function setDateFormat(string $date_format)
    {
        $this->date_format = $date_format;
    }

    /**
     * @return int
     */
    public function getLogLevel(): int
    {
        switch ($this->log_level) {
            case "EMERGENCY":
                $result = 600;
                break;
            case "ALERT":
                $result = 550;
                break;
            case "CRITICAL":
                $result = 500;
                break;
            case "ERROR":
                $result = 400;
                break;
            case "NOTICE":
                $result = 250;
                break;
            case "INFO":
                $result = 200;
                break;
            case "DEBUG":
                $result = 100;
                break;
            default:
                $result = 300;
                break;
        }

        return $result;
    }

    /**
     * @param string $log_level
     */
    public function setLogLevel(string $log_level)
    {
        $this->log_level = $log_level;
    }

    /**
     * @return int
     */
    public function getCronjobCrontab(): int
    {
        return $this->cronjob_crontab;
    }

    /**
     * @param int $cronjob_crontab
     */
    public function setCronjobCrontab(int $cronjob_crontab)
    {
        $this->cronjob_crontab = $cronjob_crontab;
    }

    /**
     * @return string
     */
    public function getTimezone(): string
    {
        return $this->timezone;
    }

    /**
     * @param string $timezone
     */
    public function setTimezone(string $timezone)
    {
        $this->timezone = $timezone;
    }

    /**
     * @return int
     */
    public function getCronjobAjax(): int
    {
        return $this->cronjob_ajax;
    }

    /**
     * @param int $cronjob_ajax
     */
    public function setCronjobAjax(int $cronjob_ajax)
    {
        $this->cronjob_ajax = $cronjob_ajax;
    }

    /**
     * @return bool
     */
    public function isDbConverted(): bool
    {
        return $this->db_converted;
    }

    /**
     * @param bool $db_converted
     */
    public function setDbConverted(bool $db_converted)
    {
        $this->db_converted = $db_converted;
    }

    /**
     * @param string|null $key
     * @return array|string|bool|null
     */
    public function getOptions(?string $key = null)
    {
        $options = json_decode(base64_decode($this->options), true);

        if (!is_array($options)) {
            return !is_null($key) ? null : array();
        } elseif (!empty($key)) {
            return !key_exists($key, $options) ? null : $options[$key];
        } else {
            return $options;
        }
    }

    /**
     * @param array|null $data
     */
    public function setOptions(?array $data): void
    {
        if (empty($data)) {
            return;
        }

        $options = json_decode(base64_decode($this->options), true);

        if (!is_array($options)) {
            $options = array();
        }

        foreach ($data as $key => $item) {
            if (key_exists($key, $options) && empty($item)) {
                unset($options[$key]);
            } else {
                $options[$key] = $item;
            }
        }

        $this->options = base64_encode(json_encode($options));
    }

    /**
     * @return int
     */
    public function getIntelliMultiling(): int
    {
        return $this->intelli_multiling;
    }

    /**
     * @param int $intelli_multiling
     */
    public function setIntelliMultiling(int $intelli_multiling)
    {
        $this->intelli_multiling = $intelli_multiling;
    }

    /**
     * @return DateTime|null
     * @throws Exception
     */
    public function getCreated()
    {
        return empty($this->created) ? new DateTime("now") : $this->created;
    }

    /**
     * @return string
     */
    public function getIconPkg(): string
    {
        return $this->icon_pkg;
    }

    /**
     * @param string $icon_pkg
     */
    public function setIconPkg(string $icon_pkg)
    {
        $this->icon_pkg = is_dir($icon_pkg) ? $icon_pkg : $this->icon_pkg;
    }

    /**
     * @param $serial_key
     * @throws Exception
     */
    public function setSerialKey($serial_key)
    {
        if (empty($serial_key)) {
            $this->serial_key = $serial_key;
        } elseif (substr($serial_key, 0, 4) !== "SUBN" && strlen($serial_key) > 50) {
            throw new Exception(__($this::MSG_LICENSE_INVALID_SERIAL));
        } elseif (substr($serial_key, 0, 4) === "SUBN" && count(explode("-", $serial_key)) < 6) {
            throw new Exception(__($this::MSG_LICENSE_INVALID_SERIAL));
        } elseif (count(explode("-", $serial_key)) < 4) {
            throw new Exception(__($this::MSG_LICENSE_INVALID_SERIAL));
        } elseif (ctype_space($serial_key)) {
            throw new Exception(__($this::MSG_LICENSE_INVALID_SERIAL));
        } else {
            $this->serial_key = $serial_key;
        }
    }

    /**
     * @return string
     */
    public function getCacheDriver(): string
    {
        return strtolower($this->cache_driver);
    }

    /**
     * @param string $cache_impl
     */
    public function setCacheDriver(string $cache_impl)
    {
        $this->cache_driver = strtolower($cache_impl);
    }

    /**
     * @return int
     */
    public function getAutoGenerateProxyClasses(): int
    {
        return $this->auto_generate_proxy_classes;
    }

    /**
     * @param int $auto_generate_proxy_classes
     */
    public function setAutoGenerateProxyClasses(int $auto_generate_proxy_classes)
    {
        $this->auto_generate_proxy_classes = $auto_generate_proxy_classes;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param string $name
     */
    public function setName(string $name)
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return DateTime|null
     */
    public function getLastUpdate()
    {
        return $this->last_update;
    }

    /**
     * @return float
     */
    public function getLastUpdateCheck()
    {
        return $this->last_update_check;
    }

    /**
     * @param float $last_update_check
     */
    public function setLastUpdateCheck(float $last_update_check): void
    {
        $this->last_update_check = $last_update_check;
    }

    /**
     * @return string
     */
    public function getShortcut(): string
    {
        return $this->shortcut;
    }

    /**
     * @param string $shortcut
     */
    public function setShortcut(string $shortcut)
    {
        $this->shortcut = $shortcut;
    }

    /**
     * @return string
     */
    public function getVersion(): string
    {
        return $this->version;
    }

    /**
     * @param string $version
     */
    public function setVersion(string $version)
    {
        $this->version = $version;
    }

    /**
     * @return null
     */
    public function getSerialKey()
    {
        return $this->serial_key;
    }
}