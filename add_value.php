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
    $postData = file_get_contents('php://input');

    if (empty($postData)) {
        http_response_code(400);
        echo "Empty POST entry.";
        exit;
    }
    $post = json_decode($postData, true);
//    var_dump($post);
    $date = new DateTimeImmutable();
    $timestamp = $date->getTimestamp();
    $time_start = microtime(true);
    // поверяем не пустой ли запрос
    $x = $post["x"];
    $y = $post["y"];
    $r = $post["r"];

    // проводим валидацию данных
    if (!inputValidation($x, $y, $r)) {
        http_response_code(400);
        echo "console.log('PHP validation error.');";
        return;
    }
    $result = intersection($x, $y, $r);

    $time_end = microtime(true);
    $execution_time = number_format(($time_end - $time_start)*1000, 10); // millisecond
    $arr = array('x' => $x, 'y' => $y, 'r' => $r, 'dtCreate' => $timestamp, 'execTime' => $execution_time, 'result' => $result);
    header("Content-Type: application/json");
    echo json_encode($arr);
    exit();
}
main();
?>
