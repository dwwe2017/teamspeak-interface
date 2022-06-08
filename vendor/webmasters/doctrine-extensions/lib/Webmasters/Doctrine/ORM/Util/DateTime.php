<?php

namespace Webmasters\Doctrine\ORM\Util;

class DateTime
{
    protected $raw = null;
    protected $datetime = null;
    protected $errors = [];

    public function __construct($value)
    {
        if (is_string($value)) {
            $this->raw = $value;
            $this->convert2Object();
        } elseif ($value instanceof \DateTime) {
            $this->datetime = $value;
        } elseif ($value instanceof DateTime) {
            $this->raw = $value->getRaw();
            $this->datetime = $value->getDateTime();
            $this->errors = $value->getErrors();
        }
    }

    public function getRaw()
    {
        return $this->raw;
    }

    public function getDateTime()
    {
        return $this->datetime;
    }

    public function getErrors()
    {
        return $this->errors;
    }

    public function format($format)
    {
        $result = $this->raw;
        if ($this->isValid()) {
            $result = $this->datetime->format($format);
        }

        return $result;
    }

    public function modify($modification)
    {
        if ($this->isValid()) {
            $this->datetime->modify($modification);
        }
    }

    public function diff($datetime)
    {
        $result = false;
        if ($this->isValid() && $datetime->isValid()) {
            $result = $this->datetime->diff($datetime->getDateTime());
        }

        return $result;
    }

    public function isValid()
    {
        return (
            !empty($this->datetime) &&
            ($this->datetime instanceof \DateTime) &&
            !$this->hasRollOver()
        );
    }

    public function hasRollOver()
    {
        return (
            isset($this->errors['warnings']) &&
            isset($this->errors['warnings'][11])
        );
    }

    public function isValidClosingDate($datetime, $format = '%r%a')
    {
        $diff = $this->diff($datetime);

        $result = false;
        if ($diff !== false) {
            $check = intval($diff->format($format));
            if ($check >= 0) {
                $result = true;
            }
        }

        return $result;
    }

    protected function convert2Object()
    {
        if ($this->isValidDate($this->raw)) {
            $this->datetime = new \DateTime($this->raw);
            $this->errors = \DateTime::getLastErrors();
        }
    }

    protected function isValidDate($str)
    {
        $stamp = strtotime($str);

        if ($stamp === false) {
            return false;
        } elseif (checkdate(date('m', $stamp), date('d', $stamp), date('Y', $stamp))) {
            return true;
        }

        return false;
    }
}
