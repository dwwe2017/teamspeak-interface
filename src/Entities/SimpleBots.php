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
 * Class SimpleBots
 * @package Entities
 * @ORM\Entity
 * @ORM\Table(name="simple_bots")
 */
class SimpleBots
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
    protected $instance_id;

    /**
     * @var int
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    protected $virtualserver_id = null;

    /**
     * @var int
     * @ORM\Column(type="integer", length=1, options={"default"=0})
     */
    protected $bot_is_running = 0;

    /**
     * @var int
     * @ORM\Column(type="integer", length=1, options={"default"=0})
     */
    protected $bot_is_stopped = 0;

    /**
     * @var int
     * @ORM\Column(type="integer", length=1, options={"default"=1})
     */
    protected $bot_start_message = 1;

    /**
     * @var string
     * @ORM\Column(type="string", length=55, options={"default"=""})
     */
    protected $bot_uid_last = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=55, options={"default"=""})
     */
    protected $bot_default_nickname = "";

    /**
     * @var int
     * @ORM\Column(type="integer", length=11, options={"default"=0})
     */
    protected $bot_default_cid = 0;

    /**
     * @var int
     * @ORM\Column(type="integer", length=11, options={"default"=0})
     */
    protected $bot_slow_mode = 0;

    /**
     * @var string
     * @ORM\Column(type="text", nullable=true)
     */
    protected $config = null;

    /**
     * @var int
     * @ORM\Column(type="integer", length=1, options={"default"=0})
     */
    protected $cron_autostart = 0;

    /**
     * @var string
     * @ORM\Column(type="string", length=11, options={"default"="en_GB"})
     */
    protected $bot_lang = "en_GB";

    /**
     * @var string
     * @ORM\Column(type="string", length=225, options={"default"="Europe/Berlin"})
     */
    protected $bot_timezone = "Europe/Berlin";

    /**
     * @var DateTime|null
     * @GEDMO\Timestampable(on="update")
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $bot_modified;

    /**
     * @var DateTime|null
     * @GEDMO\Timestampable(on="create")
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $bot_created;

    /**
     * @var
     * @ORM\ManyToOne(targetEntity="Instances", inversedBy="simple_bots")
     * @ORM\JoinColumn(name="instance_id", referencedColumnName="id")
     */
    protected $instance;

    /**
     * SimpleBots constructor.
     * @param array $data
     */
    public function __construct(array $data = array())
    {
        ArrayMapper::setEntity($this)->setData($data);
    }

    /**
     * @return int
     */
    public function getBotStartMessage(): int
    {
        return $this->bot_start_message;
    }

    /**
     * @param int $bot_start_message
     */
    public function setBotStartMessage(int $bot_start_message)
    {
        $this->bot_start_message = $bot_start_message;
    }

    /**
     * @return string
     */
    public function getBotTimezone(): string
    {
        return $this->bot_timezone;
    }

    /**
     * @param string $bot_timezone
     */
    public function setBotTimezone(string $bot_timezone)
    {
        $this->bot_timezone = $bot_timezone;
    }

    /**
     * @param string $bot_lang
     */
    public function setBotLang(string $bot_lang)
    {
        $this->bot_lang = $bot_lang;
    }

    /**
     * @return int
     */
    public function getBotIsRunning(): int
    {
        return $this->bot_is_running;
    }

    /**
     * @return int
     */
    public function getBotIsStopped(): int
    {
        return $this->bot_is_stopped;
    }

    /**
     * @return string
     */
    public function getBotLang(): string
    {
        return $this->bot_lang;
    }

    /**
     * @param int $bot_is_running
     */
    public function setBotIsRunning(int $bot_is_running)
    {
        $this->bot_is_running = $bot_is_running;
    }

    /**
     * @param int $bot_is_stopped
     */
    public function setBotIsStopped(int $bot_is_stopped)
    {
        $this->bot_is_stopped = $bot_is_stopped;
    }

    /**
     * @param mixed $instance
     */
    public function setInstance(Instances $instance = null)
    {
        $this->instance = $instance;
    }

    /**
     * @return mixed
     */
    public function getInstance()
    {
        return $this->instance;
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
    public function getBotCreated()
    {
        return $this->bot_created;
    }

    /**
     * @return int
     */
    public function getBotDefaultCid(): int
    {
        return $this->bot_default_cid;
    }

    /**
     * @return DateTime|null
     */
    public function getBotModified()
    {
        return $this->bot_modified;
    }

    /**
     * @return int
     */
    public function getBotSlowMode(): int
    {
        return $this->bot_slow_mode;
    }

    /**
     * @return string
     */
    public function getBotUidLast(): string
    {
        return $this->bot_uid_last;
    }

    /**
     * @return array
     */
    public function getConfig(): array
    {
        return !is_null($this->config) ? json_decode($this->config, true) : [];
    }

    /**
     * @return int
     */
    public function getCronAutostart(): int
    {
        return $this->cron_autostart;
    }

    /**
     * @return int
     */
    public function getInstanceId(): int
    {
        return $this->instance_id;
    }

    /**
     * @return int
     */
    public function getVirtualserverId(): int
    {
        return $this->virtualserver_id;
    }

    /**
     * @param int $bot_default_cid
     */
    public function setBotDefaultCid(int $bot_default_cid)
    {
        $this->bot_default_cid = $bot_default_cid;
    }

    /**
     * @param int $bot_slow_mode
     */
    public function setBotSlowMode(int $bot_slow_mode)
    {
        $this->bot_slow_mode = $bot_slow_mode;
    }

    /**
     * @param string $bot_uid_last
     */
    public function setBotUidLast(string $bot_uid_last)
    {
        $this->bot_uid_last = $bot_uid_last;
    }

    /**
     * @return string
     */
    public function getBotDefaultNickname(): string
    {
        return $this->bot_default_nickname;
    }

    /**
     * @param string $bot_default_nickname
     */
    public function setBotDefaultNickname(string $bot_default_nickname)
    {
        $this->bot_default_nickname = $bot_default_nickname;
    }

    /**
     * @param array $config
     */
    public function setConfig(array $config = array())
    {
        $this->config = json_encode($config);
    }

    /**
     * @param int $cron_autostart
     */
    public function setCronAutostart(int $cron_autostart)
    {
        $this->cron_autostart = $cron_autostart;
    }

    /**
     * @param int $instance_id
     */
    public function setInstanceId(int $instance_id)
    {
        $this->instance_id = $instance_id;
    }

    /**
     * @param int $virtualserver_id
     */
    public function setVirtualserverId(int $virtualserver_id)
    {
        $this->virtualserver_id = $virtualserver_id;
    }
}