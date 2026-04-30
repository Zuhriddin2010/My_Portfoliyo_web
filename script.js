const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン';
let latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let nums = '0123456789';
let korean = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ';
let bamum = 'ꚠꚡꚢꚣꚤꚥꚦꚧꚨꚩꚪꚫꚬꚭꚮꚯꚰꚱꚲꚳꚴꚵꚶꚷꚸꚹꚺꚻꚼꚽꚾꚿꛀꛁꛂꛃꛄꛅꛆꛇꛈꛉꛊꛋꛌꛍꛎꛏꛐꛑꛒꛓꛔꛕꛖꛗꛘꛙꛚꛛꛜꛝꛞꛟꛠꛡꛢꛣꛤꛥꛦꛧꛨꛩꛪꛫꛬꛭꛮꛯ';
let emoji = '😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🤩🥳😏😒😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😤😠😡🤬🤯😳🥵🥶😱😨😰😥😓🤗🤔🤭🤫🤥😶😐😑😬🙄😯😦😧😮😲🥱😴🤤😪😵🤐🥴🤢🤮🤧😷🤒🤕🤑🤠😈👿👹👺🤡💩👻💀☠️👽👾🤖🎃😺😸😹😻😼😽🙀😿😾🥰💀✌️🌴🐢🐐🍄⚽🍻👑📸😬👀🚨🏡🐦‍🔥🍋‍🟩🍄‍🟫🙂‍↕️🕊️🏆😻🌟🧿🍀🎨🍜😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚☺🙂🤗🤩🤔🤨😐😑😶🙄😏😣😥😮🤐😯😪😫🥱😴😌😛😜😝🤤😒😓😔😕🙃🤑😲☹🙁😖😞😟😤😢😭😦😧😨😩🤯😬🥴😵🤪😳🥶🥵😱😰😠😡🤬😷🤒🤕🤢🤮🤫🤥🤡🤠🥺🥳😇🤧';

let alphabet = bamum; // Set Bamum as default

let fontSize = 16;
let columns = canvas.width / fontSize;

let rainDrops = [];

for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
}

let color = '#0f0';
let speed = 50;
let paused = false;
let fadeSpeed = 0.05;
let horizontalMovement = 0;
let cycleColorActive = true; // Set cycle color as default
let hue = 0;

function draw() {
    if (paused) return;
    
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeSpeed})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (cycleColorActive) {
        hue = (hue + 1) % 360;
        color = `hsl(${hue}, 100%, 50%)`;
        updateMenuButtonColor(color);
        document.getElementById('colorPicker').value = hslToHex(hue, 100, 50);
    }

    ctx.fillStyle = color;
    
    let fontFamily = 'Noto Sans Bamum'; // Set Bamum font as default
    ctx.font = fontSize + 'px ' + fontFamily;

    for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize + rainDrops[i] * horizontalMovement, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
}

let interval = setInterval(draw, speed);

window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    columns = canvas.width / fontSize;
    rainDrops = Array(Math.ceil(columns)).fill(1);
});

function togglePause() {
    paused = !paused;
}

function randomizeColor() {
    color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    document.getElementById('colorPicker').value = color;
    updateMenuButtonColor(color);
}

function updateColor(newColor) {
    color = newColor;
    updateMenuButtonColor(newColor);
}

function updateMenuButtonColor(newColor) {
    document.getElementById('toggleToolbar').style.backgroundColor = newColor;
    document.getElementById('toggleToolbar').style.color = getContrastColor(newColor);
}

function getContrastColor(hexcolor) {
    let r = parseInt(hexcolor.substr(1,2),16);
    let g = parseInt(hexcolor.substr(3,2),16);
    let b = parseInt(hexcolor.substr(5,2),16);
    let yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}

function updateSpeed(newSpeed) {
    clearInterval(interval);
    speed = newSpeed;
    interval = setInterval(draw, speed);
    document.getElementById('speedValue').textContent = newSpeed;
}

function updateFontSize(newSize) {
    fontSize = parseInt(newSize);
    columns = canvas.width / fontSize;
    rainDrops = Array(Math.ceil(columns)).fill(1);
    document.getElementById('fontSizeValue').textContent = newSize;
}

function updateFadeSpeed(newSpeed) {
    fadeSpeed = parseFloat(newSpeed);
    document.getElementById('fadeSpeedValue').textContent = newSpeed;
}

function updateHorizontalMovement(newMovement) {
    horizontalMovement = parseFloat(newMovement);
    document.getElementById('horizontalValue').textContent = newMovement;
}

function updateCharacterSet(set) {
    switch(set) {
        case 'binary':
            alphabet = '01';
            break;
        case 'matrix':
            alphabet = katakana + latin + nums;
            break;
        case 'korean':
            alphabet = korean;
            break;
        case 'bamum':
            alphabet = bamum;
            break;
        case 'emoji':
            alphabet = emoji;
            break;
        default:
            alphabet = '';
            for (let i = 33; i <= 126; i++) {
                alphabet += String.fromCharCode(i);
            }
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function toggleToolbar() {
    document.getElementById('toolbar').classList.toggle('hidden');
}

function toggleCycleColor() {
    cycleColorActive = !cycleColorActive;
}

function resetToDefaults() {
    color = '#0f0';
    speed = 50;
    fontSize = 16;
    fadeSpeed = 0.05;
    horizontalMovement = 0;
    cycleColorActive = true; // Set cycle color as default
    alphabet = bamum; // Set Bamum as default

    document.getElementById('colorPicker').value = color;
    document.getElementById('speedSlider').value = speed;
    document.getElementById('fontSizeSlider').value = fontSize;
    document.getElementById('fadeSpeedSlider').value = fadeSpeed;
    document.getElementById('horizontalSlider').value = horizontalMovement;
    document.getElementById('charSetSelect').value = 'bamum';

    updateColor(color);
    updateSpeed(speed);
    updateFontSize(fontSize);
    updateFadeSpeed(fadeSpeed);
    updateHorizontalMovement(horizontalMovement);
    
    columns = canvas.width / fontSize;
    rainDrops = Array(Math.ceil(columns)).fill(1);
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Initialize menu button color and slider values
updateMenuButtonColor(color);
document.getElementById('speedValue').textContent = speed;
document.getElementById('fontSizeValue').textContent = fontSize;
document.getElementById('fadeSpeedValue').textContent = fadeSpeed;
document.getElementById('horizontalValue').textContent = horizontalMovement;

// Load Noto Sans KR, Noto Sans Bamum, and Noto Emoji fonts
let link = document.createElement('link');
link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+KR&family=Noto+Sans+Bamum&family=Noto+Emoji&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

// Start with Bamum character set and cycle color active
updateCharacterSet('bamum');
cycleColorActive = true;