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
 * Class Stats
 * @package Entities
 * @ORM\Entity(repositoryClass="Repositories\StatsRepository")
 * @ORM\Table(name="stats")
 */
class Stats
{
    /**
     * @var int
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer", length=11, nullable=false)
     */
    protected $id = 0;

    /**
     * @var int|null
     * @ORM\Column(type="integer", length=11, options={"default"=0})
     */
    protected $sub_id = 0;

    /**
     * @var int|null
     * @ORM\Column(type="integer", length=11, options={"default"=0})
     */
    protected $sub_sid = 0;

    /**
     * @var string
     * @ORM\Column(type="string", length=55, options={"default"=""})
     */
    protected $type = "";

    /**
     * @var string
     * @ORM\Column(type="text", options={"default"=""})
     */
    protected $data = "";

    /**
     * @var DateTime|null
     * @GEDMO\Timestampable(on="create")
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $timestamp;

    /**
     * Stats constructor.
     * @param array $data
     */
    public function __construct(array $data = array())
    {
        ArrayMapper::setEntity($this)->setData($data);
    }

    /**
     * @return int|null
     */
    public function getSubSid()
    {
        return $this->sub_sid;
    }

    /**
     * @param int $sub_sid
     */
    public function setSubSid(int $sub_sid)
    {
        $this->sub_sid = $sub_sid;
    }

    /**
     * @return int|null
     */
    public function getSubId()
    {
        return $this->sub_id;
    }

    /**
     * @param int $sub_id
     */
    public function setSubId(int $sub_id)
    {
        $this->sub_id = $sub_id;
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        return !empty($this->data) ? json_decode($this->data, true) : null;
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
    public function getTimestamp()
    {
        return $this->timestamp;
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @param array $data
     */
    public function setData(array $data)
    {
        $this->data = json_encode($data);
    }

    /**
     * @param string $type
     */
    public function setType(string $type)
    {
        $this->type = $type;
    }
}