<?php
/**
 * Copyright (c) 2020. DW Web-Engineering, all rights reserved.
 */

namespace Translations;

use Entities\Extensions;
use Exception;
use function loadFile;
use function saveFile;

/**
 * Class Translation
 * @package Translations
 */
class Translation extends AbstractBase implements TransInterface
{
    /**
     * @var
     */
    private $path;

    /**
     * @var
     */
    private $lang;

    /**
     * @var
     */
    private $default;

    /**
     * @var
     */
    private $extraction_mode;

    /**
     * @var
     */
    protected $original;

    /**
     * @var
     */
    protected $dict;

    /**
     * Translation constructor.
     * @param string $lang
     * @param string $path
     */
    public function __construct($lang = "en_GB", $path = "lang")
    {
        if (!empty($lang)) {
            $this->setLang($lang);
        } else {
            $this->setLang($this->getLanguage());
        }

        if (!empty($path)) {
            $this->setPath(strtolower($path));
        }
    }

    /**
     * @param $original
     * @return mixed
     * @throws Exception
     */
    public function getText($original)
    {
        if ($this->getLang() != "en_GB") {
            $this->setDict($this->getPath() . "/" . $this->getLang() . ".json");

            if (!is_dir($this->getPath())) {
                $this->mkumaskdir($this->getPath(), '0777', true);
            }

            $translation = array();
            if (!empty($this->getDefault()) && file_exists($this->getDefault() . "/" . $this->getLang() . ".json")) {
                $translation = json_decode(loadFile($this
                        ->getDefault() . "/" . $this->getLang() . ".json"), true);
            }

            $key = strtolower($original);
            if (is_array($translation) && @key_exists($key, $translation) && $translation[$key] != "?") {
                try {
                    $original = $translation[$key];
                } catch (Exception $e) {
                }
            } elseif (file_exists($this->getDict())) {
                try {
                    $translation = json_decode(loadFile($this->getDict()), true);
                    if (is_array($translation) && @key_exists($key, $translation)) {
                        if (strcasecmp($translation[$key], "?") == 0) {
                            return $original;
                        }
                        $original = $translation[$key];
                    } elseif ($this->getExtractionMode()) {
                        $translation[$key] = "?";
                        @saveFile($this->getDict(), json_encode($translation));
                    }
                } catch (Exception $e) {
                }
            } elseif ($this->getExtractionMode()) {
                try {
                    $translation = array();
                    $translation[$key] = "?";
                    @saveFile($this->getDict(), json_encode($translation));
                } catch (Exception $e) {
                }
            }
        }

        return $original;
    }

    /**
     * @param array $input
     * @return mixed
     * @throws Exception
     */
    public function getExtensionText(array $input)
    {
        $e = $input[0];
        $initClass = false;
        $original = array();

        if ($e instanceof Extensions) {
            $initClass = $e->getInitClass();

            try {
                $original = $input[1];
                if (key_exists(2, $input) && $input[2]) {
                    $original = $e->{"get" . $input[1]}();
                }
            } catch (Exception $e) {
                $original = $input[1];
            }
        }

        if ($this->getLang() != "en_GB") {
            $initClass = strtolower($initClass);

            $this->setDict("lang/" . $initClass . "/" . $this->getLang() . ".json");

            if (!is_dir("lang/" . $initClass)) {
                $this->mkumaskdir("lang/" . $initClass, 0777, true);
            }

            $translation = array();
            if (!empty($this->getDefault()) && file_exists($this->getDefault() . "/" . $this->getLang() . ".json")) {
                $translation = json_decode(loadFile($this
                        ->getDefault() . "/" . $this->getLang() . ".json"), true);
            }

            $key = strtolower($original);
            if (key_exists($key, $translation) && $translation[$key] != "?") {
                try {
                    $original = $translation[$key];
                } catch (Exception $e) {
                }
            } elseif (file_exists($this->getDict())) {
                try {
                    $translation = json_decode(loadFile($this->getDict()), true);
                    if (key_exists($key, $translation)) {
                        if (strcasecmp($translation[$key], "?") == 0) {
                            return $original;
                        }
                        $original = $translation[$key];
                    } elseif ($this->getExtractionMode()) {
                        $translation[$key] = "?";
                        @saveFile($this->getDict(), json_encode($translation));
                    }
                } catch (Exception $e) {
                }
            } elseif ($this->getExtractionMode()) {
                try {
                    $translation = array();
                    $translation[$key] = "?";
                    @saveFile($this->getDict(), json_encode($translation));
                } catch (Exception $e) {
                }
            }
        }

        return $original;
    }

    /**
     * @param $original
     * @param $lang
     * @param $initClass
     * @return mixed
     * @throws Exception
     */
    public function t($original, $lang, $initClass)
    {
        if ($this->getLang() != "en_GB") {
            $initClass = strtolower($initClass);
            $this->setDict("lang/" . $initClass . "/" . $lang . ".json");

            if (!is_dir("lang/" . $initClass)) {
                $this->mkumaskdir("lang/" . $initClass, 0777, true);
            }

            $translation = array();
            if (!empty($this->getDefault()) && file_exists($this->getDefault() . "/" . $this->getLang() . ".json")) {
                $translation = json_decode(loadFile($this
                        ->getDefault() . "/" . $this->getLang() . ".json"), true);
            }

            $key = strtolower($original);
            if (key_exists($key, $translation) && $translation[$key] != "?") {
                $original = $translation[$key];
            } elseif (file_exists($this->getDict())) {
                $translation = json_decode(loadFile($this->getDict()), true);
                if (key_exists($key, $translation)) {
                    if (strcasecmp($translation[$key], "?") == 0) {
                        return $original;
                    }
                    $original = $translation[$key];
                } elseif ($this->getExtractionMode()) {
                    $translation[$key] = "?";
                    @saveFile($this->getDict(), json_encode($translation));
                }
            } elseif ($this->getExtractionMode()) {
                $translation = array();
                $translation[$key] = "?";
                @saveFile($this->getDict(), json_encode($translation));
            }
        }

        return $original;
    }

    /**
     * @return mixed
     */
    public function getLang()
    {
        return $this->lang;
    }

    /**
     * @return mixed
     */
    public function getPath()
    {
        return $this->getWithDirectorySeparator($this->path);
    }

    /**
     * @return mixed
     */
    public function getExtractionMode()
    {
        return $this->extraction_mode;
    }

    /**
     * @param mixed $lang
     */
    public function setLang($lang)
    {
        $this->lang = $lang;
    }

    /**
     * @param mixed $path
     */
    public function setPath($path)
    {
        $this->path = $path;
    }

    /**
     * @param mixed $extraction_mode
     */
    public function setExtractionMode($extraction_mode)
    {
        $this->extraction_mode = $extraction_mode;
    }

    /**
     * @return mixed
     */
    public function getDict()
    {
        return $this->getWithDirectorySeparator($this->dict);
    }

    /**
     * @param mixed $dict
     */
    public function setDict($dict)
    {
        $this->dict = $dict;
    }

    /**
     * @return string
     */
    public function getDefault()
    {
        return $this->getWithDirectorySeparator($this->default);
    }

    /**
     * @param string $default
     */
    public function setDefault($default)
    {
        $this->default = $default;
    }

    /**
     * @return string
     */
    public function getLanguage(): string
    {
        if (!isset($_SESSION["lang"])) {
            $option = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? "en_GB";
            switch (substr($option, 0, 2)) {
                case "de":
                    return "de_DE";
                case "es":
                    return "es_ES";
                case "it":
                    return "it_IT";
                case "ru":
                    return "ru_RU";
                case "fr":
                    return "fr_FR";
                case "nl":
                    return "nl_NL";
                default:
                    return "en_GB";
            }
        }

        return $_SESSION["lang"];
    }

    /**
     * @return string
     */
    public function getLangCode(): string
    {
        if (isset($_SESSION["lang"])) {
            switch (substr($_SESSION["lang"], 0, 2)) {
                case "de":
                    return "de";
                case "es":
                    return "es";
                case "it":
                    return "it";
                case "ru":
                    return "ru";
                case "fr":
                    return "fr";
                case "nl":
                    return "nl";
                default:
                    return "en";
            }
        } else {
            $option = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? "en_GB";
            switch (substr($option, 0, 2)) {
                case "de":
                    return "de";
                case "es":
                    return "es";
                case "it":
                    return "it";
                case "ru":
                    return "ru";
                case "fr":
                    return "fr";
                case "nl":
                    return "nl";
                default:
                    return "en";
            }
        }
    }

    /**
     * @param $path
     * @return mixed
     */
    private function getWithDirectorySeparator($path)
    {
        return str_replace(["\\, /"], DIRECTORY_SEPARATOR, $path);
    }

    /**
     * @param $pathname
     * @param int $mode
     * @param bool $recursive
     * @return bool
     */
    private function mkumaskdir($pathname, $mode = 0777, $recursive = false)
    {
        $umask = umask(0);
        $mkdir = mkdir($pathname, $mode, $recursive);
        umask($umask);

        return $mkdir;
    }
}