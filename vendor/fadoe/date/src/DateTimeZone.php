<?php
namespace FaDoe\Date;

class DateTimeZone extends \DateTimeZone
{

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->getName();
    }

}
