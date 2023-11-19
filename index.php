<?php

// Валидация входных данных
function inputValidation($xVal, $yVal, $rVal)
{
    if (!is_numeric($xVal) || !is_numeric($yVal) || !is_numeric($rVal)) {
        return false;
    }
    if ($xVal < -4 || $xVal > 4) {
        return false;
    }
    if ($yVal <= -5 || $yVal >= 3) {
        return false;
    }
    if ($rVal < 1 || $rVal > 5) {
        return false;
    }
    return true;
}

function intersection($xVal, $yVal, $rVal)
{
    if ($yVal >= 0 && $yVal <= -$rVal / 2.0 && $xVal >= $rVal && $xVal >= 0)// прямоугольник
        return true;
    elseif ($yVal <= 0 && $yVal >= -$rVal / 2.0) {
        if ($xVal >= -$rVal / 2.0 && $xVal <= 0 && sqrt($xVal * $xVal + $yVal * $yVal)) // сегмент окружности
            return true;
    } else {
        $xWidth = abs(2 * $yVal - $rVal);
        if ($xWidth - abs($xVal) >= 0)
            return true;
    }
    return false;

}

function main()
{
    $time_start = microtime(true);
    // поверяем не пустой ли запрос
    if (empty($_POST))
        return;
    $x = $_POST["xValue"];
    $y = $_POST["yValue"];
    $r = $_POST["rValue"];
    $timeID = $_POST["timeID"];

    // проводим валидацию данных
    if (!inputValidation($x, $y, $r)) {
        echo "console.log('PHP validation error.');";
        return;
    }

    $result = intersection($x, $y, $r);

    $time_end = microtime(true);
    $execution_time = ($time_end - $time_start) / 1000; // millisecond
    echo "addNewValue('" . $timeID . "'," . $execution_time . "," . $x . "," . $y . "," . $r . "," . ($result ? "1" : "0") . ");";
}

?>
