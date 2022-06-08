<?php
/**
 * Copyright (c) 2020. DW Web-Engineering, all rights reserved.
 */

namespace Entities;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Helper\ArrayMapper;

/**
 * Class InstancePermCats
 * @package Entities
 * @ORM\Entity
 * @ORM\Table(name="instance_perm_cats")
 */
class InstancePermCats
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
    protected $permcatid = 0;

    /**
     * @var int
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    protected $instance_id = 0;

    /**
     * @var string
     * @ORM\Column(type="string", length=11, options={"default"=""})
     */
    protected $permcathex = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=55, options={"default"=""})
     */
    protected $permcatname = "";

    /**
     * @var int
     * @ORM\Column(type="integer", length=11, options={"default"=0})
     */
    protected $permcatparent = 0;

    /**
     * @var int
     * @ORM\Column(type="integer", length=11, options={"default"=0})
     */
    protected $permcatchilren = 0;

    /**
     * @var int
     * @ORM\Column(type="integer", length=11, options={"default"=0})
     */
    protected $permcatcount = 0;

    /**
     * @var
     * @ORM\ManyToOne(targetEntity="Instances", inversedBy="perm_cats")
     * @ORM\JoinColumn(name="instance_id", referencedColumnName="id")
     */
    protected $instance;

    /**
     * @var
     * @ORM\OneToMany(targetEntity="InstancePerms", mappedBy="cat")
     * @ORM\JoinColumn(name="id", referencedColumnName="permcatid")
     */
    protected $perms;

    /**
     * InstancePermCats constructor.
     * @param array $data
     */
    public function __construct(array $data = array())
    {
        ArrayMapper::setEntity($this)->setData($data);
        $this->instance = new ArrayCollection();
        $this->perms = new ArrayCollection();
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
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getInstance()
    {
        return $this->instance;
    }

    /**
     * @param mixed $instance
     */
    public function setInstance(Instances $instance = null)
    {
        $this->instance = $instance;
    }

    /**
     * @return int
     */
    public function getPermcatchilren(): int
    {
        return $this->permcatchilren;
    }

    /**
     * @return int
     */
    public function getPermcatcount(): int
    {
        return $this->permcatcount;
    }

    /**
     * @return string
     */
    public function getPermcathex(): string
    {
        return $this->permcathex;
    }

    /**
     * @return int
     */
    public function getPermcatid(): int
    {
        return $this->permcatid;
    }

    /**
     * @return string
     */
    public function getPermcatname(): string
    {
        return $this->permcatname;
    }

    /**
     * @return int
     */
    public function getPermcatparent(): int
    {
        return $this->permcatparent;
    }

    /**
     * @return int
     */
    public function getInstanceId(): int
    {
        return $this->instance_id;
    }

    /**
     * @param int $permcatchilren
     */
    public function setPermcatchilren(int $permcatchilren)
    {
        $this->permcatchilren = $permcatchilren;
    }

    /**
     * @param int $permcatcount
     */
    public function setPermcatcount(int $permcatcount)
    {
        $this->permcatcount = $permcatcount;
    }

    /**
     * @param string $permcathex
     */
    public function setPermcathex(string $permcathex)
    {
        $this->permcathex = $permcathex;
    }

    /**
     * @param int $permcatid
     */
    public function setPermcatid(int $permcatid)
    {
        $this->permcatid = $permcatid;
    }

    /**
     * @param string $permcatname
     */
    public function setPermcatname(string $permcatname)
    {
        $this->permcatname = $permcatname;
    }

    /**
     * @param int $permcatparent
     */
    public function setPermcatparent(int $permcatparent)
    {
        $this->permcatparent = $permcatparent;
    }

    /**
     * @param int $instance_id
     */
    public function setInstanceId(int $instance_id)
    {
        $this->instance_id = $instance_id;
    }
}