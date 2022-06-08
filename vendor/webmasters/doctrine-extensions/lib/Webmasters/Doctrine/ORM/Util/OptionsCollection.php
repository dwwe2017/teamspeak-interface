<?php

namespace Webmasters\Doctrine\ORM\Util;

class OptionsCollection
{
    protected $options;

    public function __construct($options)
    {
        $this->options = $options;
    }

    public function all()
    {
        return $this->options;
    }

    public function has($key)
    {
        $hasOption = false;
        if (isset($this->options[$key])) {
            $hasOption = true;
        }

        return $hasOption;
    }

    public function set($key, $value)
    {
        $this->options[$key] = $value;
    }

    public function get($key)
    {
        if (!$this->has($key)) {
            throw new \Exception(
                sprintf('Option "%s" missing', $key)
            );
        }

        return $this->options[$key];
    }
}
