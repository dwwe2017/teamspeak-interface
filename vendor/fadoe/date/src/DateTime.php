<?php
namespace FaDoe\Date;

class DateTime extends \DateTime
{

    /**
     * Constants of days
     */
    const MONDAY = 1;
    const TUESDAY = 2;
    const WEDNESDAY = 3;
    const THURSDAY = 4;
    const FRIDAY = 5;
    const SATURDAY = 6;
    const SUNDAY = 7;

    private $str;

    /**
     * default datetime format
     *
     * @var int
     */
    private $defaultFormat = 'Y-m-d H:i:s';

    /**
     * set date
     *
     * @param  int $year
     * @param  int $month
     * @param  int $day
     * @return DateTime
     */
    public function setDate($year, $month, $day)
    {
        parent::setDate($year, $month, $day);

        return $this;
    }

    /**
     * set default datetime format
     *
     * @param string $defaultFormat
     * @return DateTime
     */
    public function setDefaultFormat($defaultFormat)
    {
        $this->defaultFormat = $defaultFormat;

        return $this;
    }

    /**
     * get default datetime format
     *
     * @return string
     */
    public function getDefaultFormat()
    {
        return $this->defaultFormat;
    }

    /**
     * get formated datetime
     *
     * @param string|null $format
     * @return string
     */
    public function format($format = null)
    {
        if (null !== $format) {
            return parent::format($format);
        }

        return parent::format($this->getDefaultFormat());
    }

    /**
     * set timezone
     *
     * @param \DateTimeZone|string $timezone
     * @return $this|\DateTime
     */
    public function setTimezone($timezone)
    {
        if (!$timezone instanceof \DateTimeZone) {
            $timezone = new \DateTimeZone($timezone);
        }
        parent::setTimezone($timezone);

        return $this;
    }

    /**
     * get timezone
     *
     * @return DateTimeZone
     */
    public function getTimezone()
    {
        return new DateTimeZone(parent::getTimezone()->getName());
    }

    /**
     * get the first day of this week
     *
     * @return int
     */
    public function getFirstDayOfWeek()
    {
        $dayOfWeek = $this->format('N');
        $date = $this->copy();
        $dateInterval = new \DateInterval('P' . ($dayOfWeek - 1) . 'D');
        $date->sub($dateInterval);

        return (int) $date->format('d');
    }

    /**
     * get the last day of the week
     * @return int
     */
    public function getLastDayOfWeek()
    {
        $dayOfWeek = $this->format('N');
        $date = $this->copy();
        $dateInterval = new \DateInterval('P' . (7 - $dayOfWeek) . 'D');
        $date->add($dateInterval);

        return (int) $date->format('d');
    }

    /**
     * get the quarter
     * @return int
     */
    public function getQuarter()
    {
        return ceil($this->format('m') / 3);
    }

    /**
     * get the total weeks of the month
     * @return int
     */
    public function getWeeksInMonth()
    {
        $tmpDate = $this->copy();
        $tmpDate->setDate($tmpDate->format('Y'), $tmpDate->format('m'), 1);
        $firstWeek = (int) $tmpDate->format('W');
        $lastDay = $tmpDate->format('t');
        $tmpDate->setDate($tmpDate->format('Y'), $tmpDate->format('m'), $lastDay);
        $lastWeek = (int) $tmpDate->format('W');

        if ($lastWeek < $firstWeek) {
            $tmpDate->setDate($tmpDate->format('Y'), $tmpDate->format('m'), $lastDay - 5);
            $lastWeek = (int) $tmpDate->format('W') + 1;
        }

        return ($lastWeek - $firstWeek + 1);
    }

    /**
     * get the count of weekday in month from the current date
     *
     * @return int
     */
    public function getWeekdayInMonth()
    {
        return (ceil($this->format('d') / 7));
    }

    /**
     * Return differences in years.
     *
     * @param null|DateTime $from
     *
     * @return string
     */
    public function age($from = null)
    {
        if (null === $from) {
            $from = new $this;
        }

        return $this->diff($from)->format('%r%y');
    }

    public function isLeapYear()
    {
        return $this->format('L') == 1;
    }

    public function isDaylightSavings()
    {
        return $this->format('I') == 1;
    }

    public function isWeekday()
    {
        $dow = $this->format('N');

        return $dow != self::SATURDAY && $dow != self::SUNDAY;
    }

    public function isWeekend()
    {
        return !$this->isWeekday();
    }

    public function isToday()
    {
        $today = new self();

        return $this->format('Y-m-d') === $today->format('Y-m-d');
    }

    public function isTomorrow()
    {
        $tomorrow = new self('tomorrow');

        return $this->format('Y-m-d') === $tomorrow->format('Y-m-d');
    }

    public function isYesterday()
    {
        $yesterday = new self('yesterday');

        return $this->format('Y-m-d') === $yesterday->format('Y-m-d');
    }

    public function isPast()
    {
        $today = new self();

        return $this < $today;
    }

    public function isFuture()
    {
        $today = new self();

        return $this > $today;
    }

    /**
     * Get a clone from this date time object
     *
     * @return DateTime
     */
    public function copy()
    {
        return clone $this;
    }

    /**
     * get datetime formatted
     *
     * @return string
     */
    public function __toString()
    {
        return $this->format();
    }

    public function __sleep()
    {
        $this->str = $this->format('c');
        return array('str');
    }

    public function __wakeup()
    {
        $this->__construct($this->str);
    }

}
