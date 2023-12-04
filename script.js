let myCanvas;
function makeRequest(requestData){
    // добавить время
    let xhr = new XMLHttpRequest();
    xhr.upload.onerror = function() {
        alert(`Произошла ошибка во время отправки: ${xhr.status}`);
    };
    xhr.onload = function()
    {
        let responseObj = xhr.response;
        addNewValue(responseObj.dtCreate
            , responseObj.execTime
            , responseObj.x
            , responseObj.y
            , responseObj.r
            , responseObj.result
        );
    }

    // конфигурируем запрос
    xhr.open('POST', 'add_value.php');
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.responseType = 'json';
    let json = JSON.stringify({
        x: requestData.x,
        y: requestData.y,
        r: requestData.r
    });
    xhr.send(json);
}
function onFormSubmit()
{
    let values = makeFormValidationAndGetValues();
    if(!values.isValid)
        return;
    makeRequest(values.data);
}
function onFormDraw()
{
    let values = makeFormValidationAndGetValues();
    if(!values.isValid)
    {
        return;
    }
    myCanvas.setVars(values.data.x, values.data.y, values.data.r);
    myCanvas.draw();
    myCanvas.draw();
}
function initElementsOfForm(x,y,r) {

    const xDiv = document.getElementById("xCheckboxes");
    const rDiv = document.getElementById("rCheckboxes");
    let i, j;
    for(i = -4, j=0; i < 5; i++, j++){
        let input = document.createElement("input");
        input.setAttribute("id", "x"+ j.toString());
        input.setAttribute("value", i);
        input.setAttribute("type", "checkbox");
        input.setAttribute("name", "xCheckbox");
        if(x && Number(x) == i)
            input.setAttribute("checked", "");
        let label = document.createElement("label");
        label.setAttribute("for", input.getAttribute("id"));
        label.innerText = i.toString() ;
        xDiv.appendChild(input);
        xDiv.appendChild(label);
    }

    if(y)
        document.getElementById("yText").setAttribute("value", y.toString());

    for(i=1; i<6; i++){
        let input = document.createElement("input");
        input.setAttribute("type", "button");
        input.setAttribute("value", i);
        input.setAttribute("name", "rButton");
        input.setAttribute("onclick", "changeR(" + i.toString() +")");
        if(r && Number(r) == i)
            input.setAttribute("checked","");
        rDiv.appendChild(input);
    }
    if(r)
        changeR(Number(r));
    
}
function addNewValue(timeID, exeTime, x,y,r,result){
    // проверка на сущестование подобного значения
    if(!localStorage.getItem(timeID)) {
        window.localStorage.setItem(timeID, exeTime + " " + x + " " + y + " " + r + " " + result);
        myCanvas.setVars(x,y,r);
        myCanvas.draw();
        appendTable(timeID, exeTime, x,y,r,result);
    }
}
function appendTable(timeID, exeTime, x,y,r,result)
{
    let table = document.getElementById("results");
    let index = table.rows.length;
    let row = table.insertRow(index);
    row.insertCell(0).innerText = index;
    row.insertCell(1).innerText = (new Date( Number(timeID)*1000 )).toLocaleString();
    row.insertCell(2).innerText = exeTime;
    row.insertCell(3).innerText = x;
    row.insertCell(4).innerText = y;
    row.insertCell(5).innerText = r;
        if(result == "true" || result)
            row.insertCell(6).innerHTML = '<p class=\"green\">IN</p>';
        else
            row.insertCell(6).innerHTML = "<p class=\"red\">OUT</p>";
}
function fillTable(){
    let table = document.getElementById("results");
    let lsSize = window.localStorage.length;
    let keys = Object.keys(window.localStorage).sort();

    for(let i=0; i<lsSize; i++) {
        let key = keys.at(i);
        let row = table.insertRow(i+1);
        let data = window.localStorage.getItem(key).split(" ");
        row.insertCell(0).innerText = i+1;
        let dd =  new Date(key);
        row.insertCell(1).innerText = (new Date( Number(key)*1000 )).toLocaleString();
        data.forEach(function(item, i){
            let cell = row.insertCell(i+2);
            switch (i){
                case 4:{
                    if(item == "true")
                        cell.innerHTML = '<p class=\"green\">IN</p>';
                    else
                        cell.innerHTML = "<p class=\"red\">OUT</p>";
                    break;
                }
                default:
                    cell.innerText = item;
            }
        });
    }
}
function changeR(rVal) {
    document.getElementById("rLab").innerHTML = "r = " + rVal;
    document.getElementById("rValue").setAttribute("value", rVal);
}
function makeFormValidationAndGetValues() {
    // document.getElementById("timeID").setAttribute("value", Date.now().toString());
    let y = document.forms["myForm"]["yText"].value;
    y.replace(",",".");
    y = Number(y);
    if (Number.isNaN(y) || (y<=-5 || y>=3)) {
        alert("Y value is not valid.");
        return {
            isValid: false
        }
    }
    let xCount = document.forms["myForm"]["xCheckbox"].length;
    let checkedCount = 0;
    let x;
    for(let i = 0; i<xCount; i++){
        if(document.forms["myForm"]["xCheckbox"][i].checked == true) {
            checkedCount++;
            x = Number(document.forms["myForm"]["xCheckbox"][i].value);
            if(checkedCount > 1) {
                alert("X value is not valid.");
                return {
                    isValid: false
                }
            }
        }
    }

    let r = document.getElementById("rValue").getAttribute("value");
    if(r == "" || r>"5" || r<"1"){
        alert("R value is not valid.");
        return {
            isValid: false
        }
    }
    return {
        isValid: true,
        data:
            {
                x: x,
                y: y,
                r: r
            }
    };
}

class Canv {
    #m_center;
    #m_canvas;
    #m_unit;
    #m_point;
    #m_settings;

constructor(width, height){
        this.#m_canvas = document.createElement("CANVAS");
        this.#m_canvas.setAttribute("width", width);
        this.#m_canvas.setAttribute("height", height);
        document.getElementById("canv").appendChild(this.#m_canvas);
        this.#m_center = {x: width / 2.0 ,  y: height / 2.0};
        this.#m_unit= width / 16.0;
    }

    #m_drawAxis = function(){

        let ctx = this.#m_canvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.moveTo(0, this.#m_canvas.height / 2.0);
        ctx.lineTo(this.#m_canvas.width, this.#m_canvas.height / 2.0);
        ctx.stroke();
        ctx.moveTo(this.#m_canvas.width / 2.0, 0);
        ctx.lineTo(this.#m_canvas.width / 2.0, this.#m_canvas.height);
        ctx.stroke();
    };
    #m_drawUnits = function(){
        let ctx = this.#m_canvas.getContext('2d');
        ctx.fillStyle = 'black';

        // if (canvas.getContext) {
        ctx.moveTo(this.#m_center.x + this.#m_unit, this.#m_center.y - 4);
        ctx.lineTo(this.#m_center.x + this.#m_unit, this.#m_center.y + 4);
        ctx.stroke();

        ctx.moveTo(this.#m_center.x - 4, this.#m_center.y - this.#m_unit);
        ctx.lineTo(this.#m_center.x + 4, this.#m_center.y - this.#m_unit);
        ctx.stroke();
    };
    #m_drawShapes = function(){
        let ctx = this.#m_canvas.getContext('2d');
        {
            ctx.fillStyle = 'blue';
            ctx.moveTo(this.#m_center.x, this.#m_center.y)
            let radius = this.#m_settings.r/2.0 * this.#m_unit;
            ctx.arc(this.#m_center.x, this.#m_center.y,
                radius, Math.PI,0.5*Math.PI , true);
            ctx.fill();
        }
        {
            ctx.moveTo( this.#m_center.x,  - this.#m_settings.r / 2.0 * this.#m_unit);
            ctx.rect(this.#m_center.x,  this.#m_center.y, this.#m_settings.r  * this.#m_unit, this.#m_settings.r / 2.0 * this.#m_unit);
            ctx.fill();
        }
        {
            ctx.beginPath();
            ctx.moveTo( this.#m_center.x,  this.#m_center.y );
            ctx.lineTo( this.#m_center.x, this.#m_center.y - this.#m_settings.r / 2.0  * this.#m_unit );
            ctx.lineTo( this.#m_center.x - this.#m_settings.r  * this.#m_unit, this.#m_center.y );
            ctx.fill();
        }
        {
            ctx.fillStyle = 'red';
            let unit = this.#m_unit *0.2;
            ctx.moveTo(this.#m_center.x + this.#m_point.x * this.#m_unit - unit*0.5  ,this.#m_center.y - this.#m_point.y * this.#m_unit - unit*0.5);
            ctx.fillRect(this.#m_center.x + this.#m_point.x * this.#m_unit - unit*0.5  ,this.#m_center.y - this.#m_point.y * this.#m_unit - unit*0.5,unit,unit); // fill in the pixel at (10,10)
        }
    };


    draw(){
        let ctx = this.#m_canvas.getContext('2d');
        ctx.clearRect(0, 0, this.#m_canvas.width, this.#m_canvas.height);
        this.#m_drawAxis();
        this.#m_drawUnits();
        this.#m_drawShapes();
    }
    setVars(xVar,yVar,rVar){
        // после получения значений x, y, r необходимо определить максимальное и после этого изменить масштаб
        this.#m_point = {x:xVar, y: yVar};
        this.#m_settings= {r:rVar};
    }
}

window.onload = function(){
    initElementsOfForm();
    myCanvas = new Canv(200,100);
    myCanvas.setVars(0,0,3);
    myCanvas.draw();
    fillTable();
}