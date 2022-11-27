<?php
/**
 * Copyright (c) 2020. DW Web-Engineering, all rights reserved.
 */

namespace Entities;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as GEDMO;
use Helper\ArrayMapper;

/**
 * Class Extensions
 * @package Entities
 * @ORM\Entity
 * @ORM\Table(name="extensions")
 */
class Extensions
{
    /**
     * @var int
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer", length=11, nullable=false)
     */
    protected $id = 0;

    /**
     * @var int
     * @ORM\Column(type="integer", length=11, options={"default"=0})
     */
    protected $sort_id = 0;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $name = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=11, options={"default"=""}, unique=true)
     */
    protected $shortcut = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=510, options={"default"=""})
     */
    protected $description = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=55, options={"default"="0.0.0"})
     */
    protected $version = "0.0.0";

    /**
     * @var string
     * @ORM\Column(type="string", length=510, options={"default"=""})
     */
    protected $serial_key = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $license_uri = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $update_uri = "";

    /**
     * @var string
     * @ORM\Column(type="text", options={"default"=""})
     */
    protected $files = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $dir = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $init_class = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $init_method = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $menu_class = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=510, options={"default"="default"})
     */
    protected $icon_pkg = "default";

    /**
     * @var null|string
     * @ORM\Column(type="text", nullable=true)
     */
    protected $settings = null;

    /**
     * @var int
     * @ORM\Column(type="integer", length=1, options={"default"=0})
     */
    protected $serverlist_option = 0;

    /**
     * @var DateTime|null
     * @GEDMO\Timestampable(on="change", field={"version"})
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $last_update;

    /**
     * @var DateTime|null
     * @GEDMO\Timestampable(on="create")
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $created;

    /**
     * @var string
     * @ORM\Column(type="string", length=55, options={"default"="servers"})
     */
    protected $type = "servers";

    /**
     * @var int
     * @ORM\Column(type="integer", length=1, options={"default"=1})
     */
    protected $enabled = 1;

    /**
     * Extensions constructor.
     * @param array $data
     */
    public function __construct(array $data = array())
    {
        ArrayMapper::setEntity($this)->setData($data);
    }

    /**
     * @return int
     */
    public function getSortId(): int
    {
        return $this->sort_id;
    }

    /**
     * @param int $sort_id
     */
    public function setSortId(int $sort_id)
    {
        $this->sort_id = $sort_id;
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @param string $type
     */
    public function setType(string $type)
    {
        $this->type = $type;
    }

    /**
     * @param string $icon_pkg
     */
    public function setIconPkg(string $icon_pkg)
    {
        $this->icon_pkg = $icon_pkg;
    }

    /**
     * @return string
     */
    public function getIconPkg(): string
    {
        return $this->icon_pkg;
    }

    /**
     * @return int
     */
    public function getServerlistOption(): int
    {
        return $this->serverlist_option;
    }

    /**
     * @param int $serverlist_option
     */
    public function setServerlistOption(int $serverlist_option)
    {
        $this->serverlist_option = $serverlist_option;
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription(string $description)
    {
        $this->description = $description;
    }

    /**
     * @return string
     */
    public function getUpdateUri(): string
    {
        return $this->update_uri;
    }

    /**
     * @param string $update_uri
     */
    public function setUpdateUri(string $update_uri)
    {
        $this->update_uri = $update_uri;
    }

    /**
     * @return string
     */
    public function getLicenseUri(): string
    {
        return $this->license_uri;
    }

    /**
     * @param string $license_uri
     */
    public function setLicenseUri(string $license_uri)
    {
        $this->license_uri = $license_uri;
    }

    /**
     * @return string
     */
    public function getMenuClass(): string
    {
        return $this->menu_class;
    }

    /**
     * @param string $menu_class
     */
    public function setMenuClass(string $menu_class)
    {
        $this->menu_class = $menu_class;
    }

    /**
     * @return string
     */
    public function getInitMethod(): string
    {
        return $this->init_method;
    }

    /**
     * @param string $init_method
     */
    public function setInitMethod(string $init_method)
    {
        $this->init_method = $init_method;
    }

    /**
     * @return array
     */
    public function getSettings(): array
    {
        $options = json_decode(base64_decode($this->settings), true);
        return is_array($options) ? $options : array();
    }

    /**
     * @param array $settings
     */
    public function setSettings($settings = array())
    {
        $this->settings = !empty($settings) ? base64_encode(json_encode($settings))
            : base64_encode(json_encode([]));
    }

    /**
     * @return string
     */
    public function getInitClass(): string
    {
        return $this->init_class;
    }

    /**
     * @param string $init_class
     */
    public function setInitClass(string $init_class)
    {
        $this->init_class = $init_class;
    }

    /**
     * @return string
     */
    public function getDir(): string
    {
        return $this->dir;
    }

    /**
     * @param string $dir
     */
    public function setDir(string $dir)
    {
        $this->dir = $dir;
    }

    /**
     * @return DateTime|null
     */
    public function getCreated()
    {
        return $this->created;
    }

    /**
     * @return array
     */
    public function getFiles(): array
    {
        return empty($this->files) || !is_array(json_decode($this->files, true))
            ? array() : json_decode($this->files, true);
    }

    /**
     * @param array $files
     */
    public function setFiles(array $files): void
    {
        $this->files = json_encode($files);
    }

    /**
     * @param string $version
     */
    public function setVersion(string $version): void
    {
        $this->version = $version;
    }

    /**
     * @return string
     */
    public function getVersion(): string
    {
        return $this->version;
    }

    /**
     * @param string $serial_key
     */
    public function setSerialKey(string $serial_key): void
    {
        $this->serial_key = $serial_key;
    }

    /**
     * @return string
     */
    public function getSerialKey(): string
    {
        return $this->serial_key;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return DateTime|null
     */
    public function getLastUpdate()
    {
        return $this->last_update;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getShortcut(): string
    {
        return $this->shortcut;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @param string $shortcut
     */
    public function setShortcut(string $shortcut): void
    {
        $this->shortcut = $shortcut;
    }

    /**
     * @param bool $enabled
     */
    public function setEnabled(bool $enabled): void
    {
        $this->enabled = $enabled;
    }

    /**
     * @return bool
     */
    public function getEnabled(): bool
    {
        return $this->enabled;
    }
}