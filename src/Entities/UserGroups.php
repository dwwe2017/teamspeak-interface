<?php
/**
 * Copyright (c) 2020. DW Web-Engineering, all rights reserved.
 */

namespace Entities;


use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Helper\ArrayMapper;


/**
 * Class UserGroups
 * @package Entities
 * @ORM\Entity
 * @ORM\Table(name="user_groups")
 */
class UserGroups
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
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $name = "";

    /**
     * @var int
     * @ORM\Column(type="integer", length=3, options={"default"=0})
     */
    protected $level = 0;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $icon = "";

    /**
     * @var null
     * @ORM\Column(type="text", nullable=true)
     */
    protected $virtualserver_permissions = null;

    /**
     * @var null
     * @ORM\Column(type="text", nullable=true)
     */
    protected $virtualserver_modify = null;

    /**
     * @var null
     * @ORM\Column(type="text", nullable=true)
     */
    protected $virtualserver_channel_modify = null;

    /**
     * @var null
     * @ORM\Column(type="text", nullable=true)
     */
    protected $tsi_permissions = null;

    /**
     * @var
     * @ORM\ManyToOne(targetEntity="Resellers", inversedBy="groups")
     * @ORM\JoinColumn(name="reseller_id", referencedColumnName="id")
     */
    protected $reseller;

    /**
     * @var
     * @ORM\OneToMany(targetEntity="Users", mappedBy="user_group")
     * @ORM\JoinColumn(name="id", referencedColumnName="group_id")
     */
    protected $users;

    /**
     * @var
     * @ORM\OneToMany(targetEntity="Resellers", mappedBy="user_group")
     * @ORM\JoinColumn(name="id", referencedColumnName="group_id")
     */
    protected $resellers;

    /**
     * UserGroups constructor.
     * @param array $data
     */
    public function __construct(array $data = array())
    {
        ArrayMapper::setEntity($this)->setData($data);
        $this->reseller = new ArrayCollection();
        $this->users = new ArrayCollection();
        $this->resellers = new ArrayCollection();
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
     * @return mixed
     */
    public function getResellers()
    {
        return $this->resellers;
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
     * @return array|null
     */
    public function getTsiPermissions()
    {
        if(!empty($this->tsi_permissions)) {
            return json_decode($this->tsi_permissions, true);
        }
        return $this->tsi_permissions;
    }

    /**
     * @return array|null
     */
    public function getVirtualserverChannelModify()
    {
        if(!empty($this->virtualserver_channel_modify)) {
            return json_decode($this->virtualserver_channel_modify, true);
        }
        return $this->virtualserver_channel_modify;
    }

    /**
     * @return array|null
     */
    public function getVirtualserverModify()
    {
        if(!empty($this->virtualserver_modify)) {
            return json_decode($this->virtualserver_modify, true);
        }
        return $this->virtualserver_modify;
    }

    /**
     * @return array|null
     */
    public function getVirtualserverPermissions()
    {
        if(!empty($this->virtualserver_permissions)) {
            return json_decode($this->virtualserver_permissions, true);
        }
        return $this->virtualserver_permissions;
    }

    /**
     * @param string|array|null $tsi_permissions
     */
    public function setTsiPermissions($tsi_permissions)
    {
        if(!empty($tsi_permissions)) {
            $this->tsi_permissions = json_encode($tsi_permissions);
        } else {
            $this->tsi_permissions = $tsi_permissions;
        }
    }

    /**
     * @param string|array|null $virtualserver_channel_modify
     */
    public function setVirtualserverChannelModify($virtualserver_channel_modify)
    {
        if(!empty($virtualserver_channel_modify)) {
            $this->virtualserver_channel_modify = json_encode($virtualserver_channel_modify);
        } else {
            $this->virtualserver_channel_modify = $virtualserver_channel_modify;
        }
    }

    /**
     * @param string|array|null $virtualserver_modify
     */
    public function setVirtualserverModify($virtualserver_modify)
    {
        if(!empty($virtualserver_modify)) {
            $this->virtualserver_modify = json_encode($virtualserver_modify);
        } else {
            $this->virtualserver_modify = $virtualserver_modify;
        }
    }

    /**
     * @param string|array|null $virtualserver_permissions
     */
    public function setVirtualserverPermissions($virtualserver_permissions)
    {
        if(!empty($virtualserver_permissions)) {
            $this->virtualserver_permissions = json_encode($virtualserver_permissions);
        } else {
            $this->virtualserver_permissions = $virtualserver_permissions;
        }
    }

    /**
     * @return string
     */
    public function getIcon(): string
    {
        return $this->icon;
    }

    /**
     * @return mixed
     */
    public function getUsers()
    {
        return $this->users;
    }

    /**
     * @param string $icon
     */
    public function setIcon(string $icon)
    {
        $this->icon = $icon;
    }

    /**
     * @param mixed $users
     */
    public function setUsers($users)
    {
        $this->users = $users;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return int
     */
    public function getLevel(): int
    {
        return $this->level;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param int $level
     */
    public function setLevel(int $level)
    {
        $this->level = $level;
    }

    /**
     * @param string $name
     */
    public function setName(string $name)
    {
        $this->name = $name;
    }
}