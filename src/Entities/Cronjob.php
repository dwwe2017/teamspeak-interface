<?php
/**
 * Copyright (c) 2020. DW Web-Engineering, all rights reserved.
 */

namespace Entities;


use Doctrine\ORM\Mapping as ORM;
use Helper\ArrayMapper;

/**
 * Class Cronjob
 * @package Entities
 * @ORM\Entity
 * @ORM\Table(name="cronjob")
 */
class Cronjob
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
     * @ORM\Column(type="string", length=110, nullable=true)
     */
    protected $namespace;

    /**
     * @var
     * @ORM\Column(type="string", length=55, nullable=true)
     */
    protected $class;

    /**
     * @var
     * @ORM\Column(type="string", length=55, nullable=true)
     */
    protected $method;

    /**
     * @var string
     * @ORM\Column(type="string", length=510, options={"default"="*\/15 * * * *"})
     */
    protected $expression = "*/15 * * * *";

    /**
     * @var string
     * @ORM\Column(type="string", length=510, options={"default"=""})
     */
    protected $description = "";

    /**
     * @var int
     * @ORM\Column(type="integer", length=1, options={"default"=1})
     */
    protected $active = 1;

    /**
     * Cronjob constructor.
     * @param array $data
     */
    public function __construct(array $data = array())
    {
        ArrayMapper::setEntity($this)->setData($data);
    }

    /**
     * @return int
     */
    public function getActive(): int
    {
        return $this->active;
    }

    /**
     * @param int $active
     */
    public function setActive(int $active)
    {
        $this->active = $active;
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
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getClass()
    {
        return $this->class;
    }

    /**
     * @return string
     */
    public function getExpression(): string
    {
        return $this->expression;
    }

    /**
     * @return mixed
     */
    public function getMethod()
    {
        return $this->method;
    }

    /**
     * @return mixed
     */
    public function getNamespace()
    {
        return $this->namespace;
    }

    /**
     * @param mixed $class
     */
    public function setClass($class)
    {
        $this->class = $class;
    }

    /**
     * @param string $expression
     */
    public function setExpression(string $expression)
    {
        $this->expression = $expression;
    }

    /**
     * @param mixed $method
     */
    public function setMethod($method)
    {
        $this->method = $method;
    }

    /**
     * @param mixed $namespace
     */
    public function setNamespace($namespace)
    {
        $this->namespace = $namespace;
    }
}