<?php

use Carbon\Carbon;

function get_base_path($model): string
{
    return strtolower(class_basename($model));
}

function convert_into_default_select_box($objects = null, $key = 'id', $value = 'name', $type = 'default'): array
{
    $def = 'Lựa chọn';
    if ($type != 'default') {
        $def = $type;
    }

    return collect($objects)->mapWithKeys(function ($item) use ($key, $value) {
        return [$item->$key => $item->$value];
    })->prepend($def, null)->all();
}

function limitTo($text, $limit)
{
    if (str_word_count($text, 0) > $limit) {
        $words = str_word_count($text, 2);
        $pos = array_keys($words);
        $text = substr($text, 0, $pos[$limit]) . '...';
    }
    return $text;
}

function limitCharacter($text, $limit = null)
{
    if ($limit == null) {
        $limit = 40;
    }
    return Str::limit($text, $limit, '...');
}
function db_date($date, $fromFormat = 'd-m-Y', $toFormat = 'Y-m-d'): ?string
{
    if (!$date) {
        return null;
    }

    return Carbon::createFromFormat($fromFormat, $date)->format($toFormat);
}

function db_end_date_filter($date, $fromFormat = 'd-m-Y', $toFormat = 'Y-m-d')
{
    return db_date($date, $fromFormat, $toFormat) . ' 23:59:59';
}

function view_date($date, $fromFormat = 'Y-m-d', $toFormat = 'd-m-Y'): ?string
{
    if (!$date) {
        return null;
    }

    return Carbon::createFromFormat($fromFormat, $date)->format($toFormat);
}

function db_date_time($time, $fromFormat = 'd-m-Y H:i:s', $toFormat = 'Y-m-d H:i:s'): ?string
{
    if (!$time) {
        return null;
    }

    return Carbon::createFromFormat($fromFormat, $time)->format($toFormat);
}


function view_date_time($time, $fromFormat = 'Y-m-d H:i:s', $toFormat = 'd-m-Y H:i'): ?string
{
    if (!$time) {
        return null;
    }

    return Carbon::createFromFormat($fromFormat, $time)->format($toFormat);
}
