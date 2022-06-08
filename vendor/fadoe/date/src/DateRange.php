<?php
namespace FaDoe\Date;

use FaDoe\Date\Exception\InvalidArgumentException;

class DateRange implements \Iterator, \ArrayAccess
{

    /**
     * @var DateTime|null
     */
    private $from = null;

    /**
     * @var DateTime|null
     */
    private $to = null;

    /**
     * @var array
     */
    private $dates = array();

    /**
     * @var int
     */
    private $index = 0;

    /**
     * @var bool
     */
    private $isInverted = false;

    /**
     * @param string|DateTime $from From date
     * @param string|DateTime $to   To date
     */
    public function __construct($from = null, $to = null)
    {

        if (null !== $from) {
            $this->setFrom($from);
        }

        if (null !== $to) {
            $this->setTo($to);
        }
    }

    private function buildDates()
    {
        if ((null === $this->from) || (null === $this->to)) {
            return;
        }

        $this->dates = array();

        $d = clone $this->from;
        $this->dates[] = clone $d;

        $dateInterval = new \DateInterval('P1D');

        if ($this->from <= $this->to) {

            while ($d != $this->to) {
                $d->add($dateInterval);
                $this->dates[] = clone $d;
            }

        } else {

            $this->isInverted = true;
            while ($d != $this->to) {
                $d->sub($dateInterval);
                $this->dates[] = clone $d;
            }

        }

    }

    /**
     * Gets the interval between the two dates
     *
     * @return \DateInterval
     */
    public function getDateInterval()
    {
        if ((null === $this->from) && (null === $this->to)) {
            return null;
        }
        return $this->from->diff($this->to);
    }

    /**
     * Gets From
     *
     * @return DateTime|null
     */
    public function getFrom()
    {
        return $this->from;
    }

    /**
     * Sets From
     *
     * @param DateTime|string $from From
     *
     * @throws Exception\InvalidArgumentException
     * @return DateRange
     */
    public function setFrom($from)
    {

        if (true === is_string($from)) {
            $from = new \DateTime($from);
        }

        if (!$from instanceof \DateTime) {
            throw new InvalidArgumentException(
                'Parameter must be a string or DateTime object, ' . gettype($from) . ' given.'
            );
        }

        $this->from = $from;
        $this->buildDates();

        return $this;
    }

    /**
     * Gets To
     *
     * @return DateTime|null
     */
    public function getTo()
    {
        return $this->to;
    }

    /**
     * Sets To
     *
     * @param DateTime $to To
     *
     * @throws Exception\InvalidArgumentException
     * @return DateRange
     */
    public function setTo($to)
    {
        if (is_string($to)) {
            $to = new \DateTime($to);
        }

        if (!$to instanceof \DateTime) {
            throw new InvalidArgumentException(
                'Parameter must be a string or DateTime object, ' . gettype($to) . ' given.'
            );
        }

        $this->to = $to;
        $this->buildDates();

        return $this;
    }

    /**
     * Gets dates between "from" and "to" ("from" and "to" included)
     *
     * @return array
     */
    public function getDates()
    {
        return $this->dates;
    }

    /**
     * If dates are in inverted order true, else false
     *
     * @return bool
     */
    public function isInverted()
    {
        return $this->isInverted;
    }

    /**
     * @return null
     */
    public function rewind()
    {
        $this->index = 0;
    }

    /**
     * @return \DateTime
     */
    public function current()
    {
        return $this->dates[$this->index];
    }

    /**
     * @return integer
     */
    public function key()
    {
        return $this->index;
    }

    /**
     * @return null
     */
    public function next()
    {
        ++$this->index;
    }

    /**
     * @return boolean
     */
    public function valid()
    {
        return isset($this->dates[$this->index]);
    }

    /**
     * @param integer   $offset Offset
     * @param \DateTime $value  value
     *
     * @throws Exception\InvalidArgumentException
     * @return null
     */
    public function offsetSet($offset, $value)
    {
        throw new InvalidArgumentException('Setting a date is not supported.');
    }

    /**
     * @param integer $offset Offset
     *
     * @return boolean
     */
    public function offsetExists($offset)
    {
        return isset($this->dates[$offset]);
    }

    /**
     * @param integer $offset Offset
     *
     * @throws Exception\InvalidArgumentException
     */
    public function offsetUnset($offset)
    {
        throw new InvalidArgumentException('Unset a date is not supported.');
    }

    /**
     * @param integer $offset Offset
     *
     * @return \DateTime|null
     */
    public function offsetGet($offset)
    {
        return isset($this->dates[$offset]) ? $this->dates[$offset] : null;
    }

}
