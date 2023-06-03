<?php
/**
 * Copyright (c) 2020. DW Web-Engineering, all rights reserved.
 */

namespace Entities;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Helper\ArrayMapper;

/**
 * Class InstancePerms
 * @package Entities
 * @ORM\Entity
 * @ORM\Table(name="instance_perms")
 */
class InstancePerms
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
    protected $permid = 0;

    /**
     * @var int
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    protected $permcatid = null;

    /**
     * @var null
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    protected $instance_id = null;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $permname = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $permdesc = null;

    /**
     * @var int
     * @ORM\Column(type="bigint", options={"default"=0})
     */
    protected $permgrant = 0;

    /**
     * @var
     * @ORM\ManyToOne(targetEntity="InstancePermCats", inversedBy="perms")
     * @ORM\JoinColumn(name="permcatid", referencedColumnName="id")
     */
    protected $cat;

    /**
     * @var
     * @ORM\ManyToOne(targetEntity="Instances", inversedBy="perms")
     * @ORM\JoinColumn(name="instance_id", referencedColumnName="id")
     */
    protected $instance;

    /**
     * InstancePerms constructor.
     * @param array $data
     */
    public function __construct(array $data = array())
    {
        ArrayMapper::setEntity($this)->setData($data);
        $this->cat = new ArrayCollection();
    }

    /**
     * @param mixed $instance
     */
    public function setInstance(Instances $instance = null)
    {
        $this->instance = $instance;
    }

    /**
     * @return mixed
     */
    public function getInstance()
    {
        return $this->instance;
    }

    /**
     * @param null $instance_id
     */
    public function setInstanceId($instance_id)
    {
        $this->instance_id = $instance_id;
    }

    /**
     * @return null
     */
    public function getInstanceId()
    {
        return $this->instance_id;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param int $permcatid
     */
    public function setPermcatid(int $permcatid)
    {
        $this->permcatid = $permcatid;
    }

    /**
     * @return int
     */
    public function getPermcatid(): int
    {
        return $this->permcatid;
    }

    /**
     * @return mixed
     */
    public function getCat()
    {
        return $this->cat;
    }

    /**
     * @return mixed
     */
    public function getPermdesc()
    {
        return $this->permdesc;
    }

    /**
     * @param mixed $permdesc
     */
    public function setPermdesc($permdesc)
    {
        $this->permdesc = $permdesc;
    }

    /**
     * @return int
     */
    public function getPermgrant(): int
    {
        return $this->permgrant;
    }

    /**
     * @return int
     */
    public function getPermid(): int
    {
        return $this->permid;
    }

    /**
     * @return string
     */
    public function getPermname(): string
    {
        return $this->permname;
    }

    /**
     * @param mixed $cat
     */
    public function setCat(InstancePermCats $cat = null)
    {
        $this->cat = $cat;
    }

    /**
     * @param int $permgrant
     */
    public function setPermgrant(int $permgrant)
    {
        $this->permgrant = $permgrant;
    }

    /**
     * @param int $permid
     */
    public function setPermid(int $permid)
    {
        $this->permid = $permid;
    }

    /**
     * @param string $permname
     */
    public function setPermname(string $permname)
    {
        $this->permname = $permname;
    }
}