<?php
/**
 * Copyright (c) 2020. DW Web-Engineering, all rights reserved.
 */

namespace Entities;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Helper\ArrayMapper;

/**
 * Class TsiApi
 * @package Entities
 * @ORM\Entity
 * @ORM\Table(name="api")
 */
class TsiApi
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
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    protected $reseller_id;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $label = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=510, options={"default"=""})
     */
    protected $client = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=510, options={"default"=""})
     */
    protected $secret = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $restricted_ip = "";

    /**
     * @var string
     * @ORM\Column(type="text", options={"default"="[]"})
     */
    protected $limits = "[]";

    /**
     * @var
     * @ORM\ManyToOne(targetEntity="Resellers", inversedBy="api_accesses")
     * @ORM\JoinColumn(name="reseller_id", referencedColumnName="id")
     */
    protected $reseller;

    /**
     * TsiApi constructor.
     * @param array $data
     */
    public function __construct(array $data = array())
    {
        ArrayMapper::setEntity($this)->setData($data);
        $this->reseller = new ArrayCollection();
    }

    /**
     * @return mixed
     */
    public function getReseller(): ?Resellers
    {
        return $this->reseller;
    }

    /**
     * @param Resellers|null $reseller
     */
    public function setReseller(Resellers $reseller = null): void
    {
        $this->reseller = $reseller;
    }

    /**
     * @return mixed
     */
    public function getResellerId(): ?int
    {
        return $this->reseller_id;
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return $this->label;
    }

    /**
     * @return string
     */
    public function getRestrictedIp(): string
    {
        return $this->restricted_ip;
    }

    /**
     * @param string $label
     */
    public function setLabel(string $label): void
    {
        $this->label = $label;
    }

    /**
     * @param string $restricted_ip
     */
    public function setRestrictedIp(string $restricted_ip): void
    {
        $this->restricted_ip = $restricted_ip;
    }

    /**
     * @return array
     */
    public function getLimits(): array
    {
        return json_decode($this->limits, true);
    }

    /**
     * @param array $limits
     */
    public function setLimits(array $limits): void
    {
        $this->limits = json_encode($limits);
    }

    /**
     * @return string
     */
    public function getClient(): string
    {
        return $this->client;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getSecret(): string
    {
        return $this->secret;
    }

    /**
     * @param string $client
     */
    public function setClient(string $client): void
    {
        $this->client = $client;
    }

    /**
     * @param string $secret
     */
    public function setSecret(string $secret): void
    {
        $this->secret = $secret;
    }
}