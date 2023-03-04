<?php
/**
 * Copyright (c) 2020. DW Web-Engineering, all rights reserved.
 */

namespace Entities;


use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as GEDMO;
use Helper\ArrayMapper;

/**
 * Class Users
 * @package Entities
 * @ORM\Entity
 * @ORM\Table(name="users")
 */
class Users
{
    const MFA_TYPE_NONE = "none";
    const MFA_TYPE_GOOGLE = "google";
    const MFA_TYPE_EMAIL = "email";

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
    protected $group_id;

    /**
     * @var
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    protected $reseller_id;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $username = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=510, options={"default"=""})
     */
    protected $password = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=510, options={"default"=""})
     */
    protected $init_pw = "";

    /**
     * @var bool
     * @ORM\Column(type="boolean", length=1, options={"default"=false})
     */
    protected $mfa_active = false;

    /**
     * @var string
     * @ORM\Column(type="string", length=55, options={"default"="none"})
     */
    protected $mfa_type = "none";

    /**
     * @var string
     * @ORM\Column(type="string", length=210, options={"default"=""})
     */
    protected $mfa_secret = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $first_name = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $last_name = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default"=""})
     */
    protected $email = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=55, options={"default"=""})
     */
    protected $query_nickname = "";

    /**
     * @var string
     * @ORM\Column(type="string", length=5, options={"default"="en_GB"})
     */
    protected $lang = "en_GB";

    /**
     * @var string
     * @ORM\Column(type="string", length=510, options={"default"="[[]]"})
     */
    protected $fixed_virtual_servers = "";

    /**
     * @var int
     * @ORM\Column(type="integer", length=11, options={"default"=16})
     */
    protected $max_slots_per_virtualservers = 16;

    /**
     * @var string
     * @ORM\Column(type="string", length=510, options={"default"="images/pkg-default"})
     */
    protected $icon_pkg = "images/pkg-default";

    /**
     * @var DateTime|null
     * @GEDMO\Timestampable(on="create")
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $reg_date;

    /**
     * @var int
     * @ORM\Column(type="integer", length=1, options={"default"=1})
     */
    protected $active = 1;

    /**
     * @var
     * @ORM\ManyToOne(targetEntity="UserGroups", inversedBy="users")
     * @ORM\JoinColumn(name="group_id", referencedColumnName="id")
     */
    protected $user_group;

    /**
     * @var
     * @ORM\ManyToOne(targetEntity="Resellers", inversedBy="users")
     * @ORM\JoinColumn(name="reseller_id", referencedColumnName="id")
     */
    protected $reseller;

    /**
     * Users constructor.
     * @param array $data
     */
    public function __construct(array $data = array())
    {
        ArrayMapper::setEntity($this)->setData($data);
        $this->user_group = new ArrayCollection();
        $this->reseller = new ArrayCollection();
    }

    /**
     * @param int $max_slots_per_virtualservers
     */
    public function setMaxSlotsPerVirtualservers(int $max_slots_per_virtualservers): void
    {
        $this->max_slots_per_virtualservers = $max_slots_per_virtualservers;
    }

    /**
     * @return int
     */
    public function getMaxSlotsPerVirtualservers(): int
    {
        return $this->max_slots_per_virtualservers;
    }

    /**
     * @return mixed
     */
    public function getReseller()
    {
        return $this->reseller;
    }

    /**
     * @return mixed
     */
    public function getResellerId()
    {
        return $this->reseller_id;
    }

    /**
     * @param mixed $reseller
     */
    public function setReseller(Resellers $reseller = null)
    {
        $this->reseller = $reseller;
    }

    /**
     * @param mixed $reseller_id
     */
    public function setResellerId($reseller_id)
    {
        $this->reseller_id = $reseller_id;
    }

    /**
     * @return string
     */
    public function getIconPkg(): string
    {
        return $this->icon_pkg;
    }

    /**
     * @param string $icon_pkg
     */
    public function setIconPkg(string $icon_pkg)
    {
        $this->icon_pkg = is_dir($icon_pkg) ? $icon_pkg : $this->icon_pkg;
    }

    /**
     * @return int
     */
    public function getActive(): int
    {
        return $this->active == null ? 0 : $this->active;
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
    public function getInitPw(): string
    {
        return $this->init_pw;
    }

    /**
     * @param string $init_pw
     */
    public function setInitPw(string $init_pw)
    {
        $this->init_pw = !empty($init_pw) ? password_hash($init_pw, PASSWORD_DEFAULT) : '';
    }

    /**
     * @return string
     */
    public function getLang(): string
    {
        return $this->lang;
    }

    /**
     * @param string $lang
     */
    public function setLang(string $lang)
    {
        $this->lang = $lang;
    }

    /**
     * @return string
     */
    public function getQueryNickname(): string
    {
        return $this->query_nickname;
    }

    /**
     * @param string $query_nickname
     */
    public function setQueryNickname(string $query_nickname)
    {
        $this->query_nickname = $query_nickname;
    }

    /**
     * @return array|null
     */
    public function getFixedVirtualServers()
    {
        return json_decode($this->fixed_virtual_servers, true);
    }

    /**
     * @param array $fixed_virtual_servers
     */
    public function setFixedVirtualServers(array $fixed_virtual_servers)
    {
        $this->fixed_virtual_servers = json_encode($fixed_virtual_servers);
    }

    /**
     * @return mixed
     */
    public function getUserGroup()
    {
        return $this->user_group;
    }

    /**
     * @param mixed $user_group
     */
    public function setUserGroup(UserGroups $user_group = null)
    {
        $this->user_group = $user_group;
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
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @return string
     */
    public function getFirstName(): string
    {
        return $this->first_name;
    }

    /**
     * @return int
     */
    public function getGroupId(): int
    {
        return $this->group_id;
    }

    /**
     * @return string
     */
    public function getLastName(): string
    {
        return $this->last_name;
    }

    /**
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * @return DateTime|null
     */
    public function getRegDate()
    {
        return $this->reg_date;
    }

    /**
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * @param string $email
     */
    public function setEmail(string $email)
    {
        $this->email = $email;
    }

    /**
     * @param string $first_name
     */
    public function setFirstName(string $first_name)
    {
        $this->first_name = $first_name;
    }

    /**
     * @param int $group_id
     */
    public function setGroupId(int $group_id)
    {
        $this->group_id = $group_id;
    }

    /**
     * @param string $last_name
     */
    public function setLastName(string $last_name)
    {
        $this->last_name = $last_name;
    }

    /**
     * @param string $password
     */
    public function setPassword(string $password)
    {
        $this->password = !empty($password) ? password_hash($password, PASSWORD_DEFAULT) : "";
    }

    /**
     * @param string $username
     */
    public function setUsername(string $username)
    {
        $this->username = $username;
    }

    /**
     * @return string
     */
    public function getMfaSecret(): string
    {
        return $this->mfa_secret;
    }

    /**
     * @param string $mfa_secret
     */
    public function setMfaSecret(string $mfa_secret): void
    {
        $this->mfa_secret = $mfa_secret;
    }

    /**
     * @return string
     */
    public function getMfaType(): string
    {
        return $this->mfa_type;
    }

    /**
     * @param string $mfa_type
     */
    public function setMfaType(string $mfa_type): void
    {
        $this->mfa_type = $mfa_type;
    }

    /**
     * @return bool
     */
    public function isMfaActive(): bool
    {
        return $this->mfa_active;
    }

    /**
     * @param bool $mfa_active
     */
    public function setMfaActive(bool $mfa_active): void
    {
        $this->mfa_active = $mfa_active;
    }

    /**
     * @return bool
     */
    public function mfaCheckIsNecessary()
    {
        if ($this->isMfaActive()) {
            return !isset($_SESSION["mfa"]) || empty($_SESSION["mfa"]) ||
                $_SESSION["mfa"] !== md5($this->getPassword());
        }

        return false;
    }

    /**
     * @param bool|null $specification
     * @return bool
     */
    public function mustSetUpMfaCheck(?bool $specification = false)
    {
        if ($this->isMfaActive() || $specification) {
            return $this->getMfaType() == self::MFA_TYPE_NONE || ($this->getMfaType() != self::MFA_TYPE_EMAIL && $this->getMfaType() != self::MFA_TYPE_GOOGLE) || ($specification && !$this->isMfaActive());
        }

        return false;
    }
}