
this.onmessage = function (event) {

}

var time = 50;
setTimeout(function () { Tick() }, time);

function Tick() {
    postMessage("Tick");
    setTimeout(function () { Tick() }, time);
}