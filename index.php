<?php

// Валидация входных данных
function inputValidation($xVal, $yVal, $rVal){
    if(!is_numeric($xVal) || !is_numeric($yVal) || !is_numeric($rVal)) {

        echo 'console.log("1");';
        return false;
    }
    if($xVal < -4 || $xVal > 4){
        echo 'console.log("2");';
        return false;
    }
    if($yVal <= -5 || $yVal >= 3){
        echo 'console.log("3");';
        return false;
    }
    if($rVal <1 || $rVal > 5){
        echo 'console.log("4");';
        return false;
    }
    return true;
}

function intersection($xVal, $yVal, $rVal){
    if($yVal >= 0 && $yVal<=-$rVal/2.0 && $xVal >=$rVal && $xVal >= 0)// прямоугольник
        return true;
    elseif($yVal<=0 && $yVal>= -$rVal/2.0) {
        if ($xVal >= -$rVal / 2.0 && $xVal <= 0 && sqrt($xVal * $xVal + $yVal * $yVal)) // сегмент окружности
            return true;
    }
    else{
        $xWidth = abs(2* $yVal - $rVal);
        if(   $xWidth -  abs($xVal) >=0 )
            return true;
    }
    return false;

}

function main(){
    $time_start = microtime(true);
    // поверяем не пустой ли запрос
    if (empty($_POST))
        return;
    $x = $_POST["xValue"];
    $y = $_POST["yValue"];
    $r = $_POST["rValue"];
    $timeID = $_POST["timeID"];

    // проводим валидацию данных
    if(!inputValidation($x, $y, $r)) {
        echo "console.log('PHP validation error.');";
        return;
    }

    $result = intersection($x, $y, $r);

    $time_end = microtime(true);
    $execution_time = ($time_end - $time_start) * 1000; // millisecond
    echo "addNewValue('" .$timeID . "'," . $execution_time . "," . $x . "," .  $y . "," . $r . "," . ($result ? "1":"0") . ");";
}

?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Лабораторная работа #1</title>
    <script type="text/javascript" src="script.js"></script>
    <link rel="stylesheet" href="style.css">
    <script>
        let myCanvas;
        window.onload = function(){
            <?php
            if (!empty($_POST))
                echo 'initElementsOfForm(' . $_POST["xValue"] .  ', ' . $_POST["yValue"] .  ', ' . $_POST["rValue"] .  ');';
            else
                echo 'initElementsOfForm();';
            ?>

            myCanvas = new Canv(200,100);
            myCanvas.setVars(0,0,3);
            myCanvas.draw();

            <?php
            main();
            ?>
            fillTable();

        }
        function drawMe(){
            if(!formValidation())
                return false;
            myCanvas.setVars( Number(document.getElementById("xValue").getAttribute("value")),
                Number(document.getElementById("yValue").getAttribute("value")),
                Number(document.getElementById("rValue").getAttribute("value")) );
            myCanvas.draw();
            myCanvas.draw();
        }
    </script>

</head>
<body>
<div id="container">
    <div id="header">
        <p>Лабораторная работа #1</p>
        <p>Киселёв Константин</p>
        <p>P3212<br/>Вариант 2327</p>
    </div>
    <div id="main">
        <div id="canv">
        </div>
        <form name="myForm" action="index.php" onsubmit="return formValidation()" method="post">

            <div id="xCheckboxes">
                <label>X = </label>
            </div>

            <div id="yCheckboxes">
                <label id="yLab" for="y">Y = </label>
                <input id="yText" name="yText" type="text"/>
            </div>

            <div id="rCheckboxes">
                <label id="rLab" >R = </label>
            </div>
            <input type="button" value="Draw" onclick="drawMe()">
            <input type="hidden" id="xValue" name="xValue" value="">
            <input type="hidden" id="yValue" name="yValue" value="">
            <input type="hidden" id="rValue" name="rValue" value="">
            <input type="hidden" id="timeID" name="timeID" value="">
            <input type="submit">
        </form>
        <table id="results">
            <tr>
                <th>#</th>
                <th>Time</th>
                <th>Exec time (ms)</th>
                <th>x</th>
                <th>y</th>
                <th>r</th>
                <th>Result</th>
            </tr>

        </table>
    </div>
    <div id="footer">

    </div>
</div>





</body>
</html>