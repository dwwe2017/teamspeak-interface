<?php
/**
 * Copyright (c) 2020. DW Web-Engineering, all rights reserved.
 */

namespace Entities;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Exception;
use Gedmo\Mapping\Annotation as GEDMO;
use Helper\ArrayMapper;

/**
 * Class Instances
 * @package Entities
 * @ORM\Entity(repositoryClass="Repositories\InstancesRepository")
 * @ORM\Table(name="instances")
 */
class Instances
{
    /**
     * @var int
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer", length=11, nullable=false)
     */
    protected $id = 0;

    /**
     * @var
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    protected $reseller_id;

    /**
     * @var string
     * @ORM\Column(type="string", length=11, options={"default"="ts3"})
     */
    protected $basis = "ts3";

    /**
     * @var string
     * @ORM\Column(type="string", length=210, options={"default"=""})
     */
    protected $label = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $server_ip = "";

    /**
     * @var int
     * @ORM\Column(type="integer", length=11, options={"default"=10011})
     */
    protected $query_port = 10011;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $serveradmin = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $password = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $athp_link = "";

    /**
     * @var int
     * @ORM\Column(type="integer", length=1, options={"default"=0})
     */
    protected $tls = 0;

    /**
     * @var string
     * @ORM\Column(type="string", length=2, options={"default"="SA"})
     */
    protected $invoker = "SA";

    /**
     * @var string|null
     * @ORM\Column(type="text", nullable=true)
     */
    protected $custom_icon = "";

    /**
     * @var DateTime|null
     * @GEDMO\Timestampable(on="create")
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $last_perm_import;

    /**
     * @var
     * @ORM\OneToMany(targetEntity="SimpleBots", mappedBy="instance", cascade={"remove"})
     * @ORM\JoinColumn(name="id", referencedColumnName="instance_id")
     */
    protected $simple_bots;

    /**
     * @var
     * @ORM\OneToMany(targetEntity="InstancePermCats", mappedBy="instance", cascade={"remove"})
     * @ORM\JoinColumn(name="id", referencedColumnName="instance_id")
     */
    protected $perm_cats;

    /**
     * @var
     * @ORM\OneToMany(targetEntity="InstancePerms", mappedBy="instance", cascade={"remove"})
     * @ORM\JoinColumn(name="id", referencedColumnName="instance_id")
     */
    protected $perms;

    /**
     * @var
     * @ORM\ManyToOne(targetEntity="Resellers", inversedBy="instances")
     * @ORM\JoinColumn(name="reseller_id", referencedColumnName="id", onDelete="SET NULL")
     */
    protected $reseller;

    /**
     * Instances constructor.
     * @param array $data
     */
    public function __construct(array $data = array())
    {
        ArrayMapper::setEntity($this)->setData($data);
        $this->simple_bots = new ArrayCollection();
        $this->perm_cats = new ArrayCollection();
        $this->perms = new ArrayCollection();
    }

    /**
     * @return array|null
     */
    public function getCustomIcon(): ?array
    {
        return !empty($this->custom_icon) ? json_decode($this->custom_icon, true) : null;
    }

    /**
     * @param array|null $custom_icon
     */
    public function setCustomIcon(?array $custom_icon = null): void
    {
        $this->custom_icon = !empty($custom_icon) ? json_encode($custom_icon) : null;
    }

    /**
     * @return mixed|string
     */
    public function getCustomIconSmall()
    {
        $custom_icon = $this->getCustomIcon();

        return !empty($custom_icon) && is_array($custom_icon) && key_exists("16px", $custom_icon)
            ? $custom_icon["16px"] : "";
    }

    /**
     * @return mixed|string
     */
    public function getCustomIconBig()
    {
        $custom_icon = $this->getCustomIcon();

        return !empty($custom_icon) && is_array($custom_icon) && key_exists("48px", $custom_icon)
            ? $custom_icon["48px"] : "";
    }

    /**
     * @return mixed
     */
    public function getSimpleBots()
    {
        return $this->simple_bots;
    }

    /**
     * @return string
     */
    public function getInvoker(): string
    {
        return $this->invoker;
    }

    /**
     * @param string $invoker
     */
    public function setInvoker(string $invoker)
    {
        $this->invoker = $invoker;
    }

    /**
     * @param mixed $reseller
     */
    public function setReseller(Resellers $reseller = null)
    {
        $this->reseller = $reseller;
    }

    /**
     * @return mixed
     */
    public function getReseller()
    {
        return $this->reseller;
    }

    /**
     * @param mixed $reseller_id
     */
    public function setResellerId($reseller_id)
    {
        $this->reseller_id = $reseller_id;
    }

    /**
     * @return mixed
     */
    public function getResellerId()
    {
        return $this->reseller_id;
    }

    /**
     * @return int
     */
    public function getTls(): int
    {
        return $this->tls;
    }

    /**
     * @param int $tls
     */
    public function setTls(int $tls)
    {
        $this->tls = $tls;
    }

    /**
     * @return string
     */
    public function getBasis(): string
    {
        return $this->basis;
    }

    /**
     * @param string $basis
     */
    public function setBasis(string $basis)
    {
        switch ($basis)
        {
            case "tea":
                $this->basis = $basis;
                break;
            default:
                $this->basis = "ts3";
                break;
        }
    }

    /**
     * @return string
     */
    public function getAthpLink(): string
    {
        return $this->athp_link;
    }

    /**
     * @param string $athp_link
     */
    public function setAthpLink(string $athp_link)
    {
        $this->athp_link = $athp_link;
    }

    /**
     * @return mixed
     */
    public function getPerms()
    {
        return $this->perms;
    }

    /**
     * @param mixed $perms
     */
    public function setPerms($perms)
    {
        $this->perms = $perms;
    }

    /**
     * @return DateTime|null
     */
    public function getLastPermImport()
    {
        return $this->last_perm_import;
    }

    /**
     * @param DateTime|null $last_perm_import
     * @throws Exception
     */
    public function setLastPermImport(?DateTime $last_perm_import = null)
    {
        $this->last_perm_import = $last_perm_import instanceof DateTime ? $last_perm_import
            : new DateTime();
    }

    /**
     * @return mixed
     */
    public function getPermCats()
    {
        return $this->perm_cats;
    }

    /**
     * @param mixed $perm_cats
     */
    public function setPermCats($perm_cats)
    {
        $this->perm_cats = $perm_cats;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param string $password
     */
    public function setPassword(string $password)
    {
        $this->password = base64_encode($password);
    }

    /**
     * @return string
     */
    public function getPassword(): string
    {
        return base64_decode($this->password);
    }

    /**
     * @return int
     */
    public function getQueryPort(): int
    {
        return $this->query_port;
    }

    /**
     * @return string
     */
    public function getServeradmin(): string
    {
        return $this->serveradmin;
    }

    /**
     * @return string
     */
    public function getServerIp(): string
    {
        return $this->server_ip;
    }

    /**
     * @param int $query_port
     */
    public function setQueryPort(int $query_port)
    {
        $this->query_port = $query_port;
    }

    /**
     * @param string $serveradmin
     */
    public function setServeradmin(string $serveradmin)
    {
        $this->serveradmin = $serveradmin;
    }

    /**
     * @param string $server_ip
     */
    public function setServerIp(string $server_ip)
    {
        $this->server_ip = $server_ip;
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return utf8_decode($this->label);
    }

    /**
     * @param string $label
     */
    public function setLabel(string $label): void
    {
        $this->label = utf8_encode($label);
    }
}