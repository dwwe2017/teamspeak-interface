<?php
namespace FaDoe\Date;

use FaDoe\Date\Exception\InvalidArgumentException;

class Compare
{
    /**
     * greater then from date and lower then to date
     */
    const GT_FROM_LT_TO = 1;

    /**
     * greater then from date and lower or equals to date
     */
    const GT_FROM_LTEQ_TO = 2;

    /**
     * greater or equals from date and lower to date
     */
    const GTEQ_FROM_LT_TO = 3;

    /**
     * greater or equals from date and lower or equals to date
     */
    const GTEQ_FROM_LTEQ_TO = 4;

    /**
     * @var \DateTime
     */
    private $compareDate;

    /**
     * @param \DateTime $compareDate
     */
    public function __construct(\DateTime $compareDate)
    {
        $this->compareDate = $compareDate;
    }

    /**
     * Assert that DateTime object the same to compare date.
     *
     * @param \DateTime $dateTime
     *
     * @return bool
     */
    public function sameAs(\DateTime $dateTime)
    {
        return $this->compareDate === $dateTime;
    }

    /**
     * Assert that DateTime object equal to compare date.
     *
     * @param \DateTime $date
     *
     * @return bool
     */
    public function equalTo(\DateTime $date)
    {
        return $this->compareDate == $date;
    }

    /**
     * Assert that DateTime object lower then compare date.
     *
     * @param \DateTime $date
     *
     * @return bool
     */
    public function greaterThen(\DateTime $date)
    {
        return $this->compareDate > $date;
    }

    /**
     * Assert that DateTime object lower or equal then compare date.
     *
     * @param \DateTime $dateTime
     *
     * @return bool
     */
    public function greaterThenOrEqual(\DateTime $dateTime)
    {
        return $this->compareDate >= $dateTime;
    }

    /**
     * Assert that DateTime object greater then compare date.
     *
     * @param \DateTime $dateTime
     *
     * @return bool
     */
    public function lowerThen(\DateTime $dateTime)
    {
        return $this->compareDate < $dateTime;
    }

    /**
     * Assert that DateTime object greater or equal to compare date.
     *
     * @param \DateTime $dateTime
     *
     * @return bool
     */
    public function lowerThenOrEqual(\DateTime $dateTime)
    {
        return $this->compareDate <= $dateTime;
    }

    /**
     * Assert that compare date between from and to date.
     *
     * If equal to false the compare date is not equal to start or end date.
     *
     * @param \DateTime $from
     * @param \DateTime $to
     * @param int       $equal
     *
     * @return bool
     */
    public function between(\DateTime $from, \DateTime $to, $equal = self::GTEQ_FROM_LTEQ_TO)
    {
        switch ($equal) {
            case self::GTEQ_FROM_LTEQ_TO:
                if ($from > $to) {
                    $tmp = $from;
                    $from = $to;
                    $to = $tmp;
                }
                return $this->greaterThenOrEqual($from) && $this->lowerThenOrEqual($to);
            case self::GT_FROM_LT_TO:
                if ($from > $to) {
                    $tmp = $from;
                    $from = $to;
                    $to = $tmp;
                }
                return $this->greaterThen($from) && $this->lowerThen($to);
            case self::GT_FROM_LTEQ_TO:
                return $this->greaterThen($from) && $this->lowerThenOrEqual($to);
            case self::GTEQ_FROM_LT_TO:
                return $this->greaterThenOrEqual($from) && $this->lowerThen($to);
        }

        throw new InvalidArgumentException('Invalid compare argument given');
    }

    /**
     * Get min date.
     *
     * @param \DateTime $dateTime
     *
     * @return \DateTime
     */
    public function getMin(\DateTime $dateTime)
    {
        return $this->lowerThen($dateTime) ? $this->compareDate : $dateTime;
    }

    /**
     * Get max date.
     *
     * @param \DateTime $dateTime
     *
     * @return \DateTime
     */
    public function getMax(\DateTime $dateTime)
    {
        return $this->lowerThen($dateTime) ? $dateTime : $this->compareDate;
    }
}
