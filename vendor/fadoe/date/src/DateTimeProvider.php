<?php
namespace FaDoe\Date;

class DateTimeProvider 
{
    /**
     * @var string
     */
    private $dateTimeClassName = '\DateTime';

    /**
     * @var \DateTime
     */
    private $today;

    /**
     * @var \DateTime
     */
    private $yesterday;

    /**
     * @var \DateTime
     */
    private $tomorrow;

    /**
     * @param string $dateTimeClassName
     */
    public function setDateTimeClassName($dateTimeClassName)
    {
        $this->dateTimeClassName = (string) $dateTimeClassName;
    }

    /**
     * @return \DateTime
     */
    public function getNow()
    {
        return $this->getDateTimeInstance();
    }

    /**
     * @return \DateTime
     */
    public function getToday()
    {
        if (null === $this->today) {
            $this->today = $this->getDateTimeInstance('today');
        }

        return $this->today;
    }

    /**
     * @return \DateTime
     */
    public function getTomorrow()
    {
        if (null === $this->tomorrow) {
            $this->tomorrow = $this->getDateTimeInstance('tomorrow');
        }

        return $this->tomorrow;
    }

    /**
     * @return \DateTime
     */
    public function getYesterday()
    {
        if (null === $this->yesterday) {
            $this->yesterday = $this->getDateTimeInstance('yesterday');
        }

        return $this->yesterday;
    }

    private function getDateTimeInstance($parameter = null)
    {
        return new $this->dateTimeClassName($parameter);
    }
}
