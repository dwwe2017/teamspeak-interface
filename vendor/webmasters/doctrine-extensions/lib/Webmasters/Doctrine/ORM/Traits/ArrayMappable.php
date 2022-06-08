<?php

namespace Traits;

use Webmasters\Doctrine\ORM\Util\StringConverter;

trait ArrayMappable
{
    public function mapFromArray(array $data, $camelize = true)
    {
        if ($data) {
            foreach ($data as $key => $value) {
                if ($camelize) {
                    $setterName = 'set' . StringConverter::camelize($key);
                } else {
                    $setterName = 'set' . ucfirst($key);
                }

                if (method_exists($this, $setterName)) {
                    $this->$setterName($value);
                }
            }
        }
    }

    public function mapToArray($withId = true, $decamelize = true)
    {
        $attributes = get_object_vars($this);

        $result = [];
        foreach ($attributes as $key => $value) {
            if ($decamelize) {
                $key = StringConverter::decamelize($key);
            }

            $result[$key] = $value;
        }

        if ($withId === false) {
            unset($result['id']);
        }

        return $result;
    }
}
