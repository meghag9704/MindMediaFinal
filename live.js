let sendButton;
let inp;
let currentMessage;
let prompt_value;
let cnv;
let p5l;
let roomName = "meghaArbChatRoom"
let messages = [];
let colArr = [];
let timeArr = [];
let myColor;
let color_r; 
let color_g;
let color_b;


function setup(){
  color_r = random(100, 255);
  color_g = random(100, 255);
  color_b = random(100, 255);
  myColor = color(color_r, color_g, color_b);
  cnv = createCanvas(windowWidth, windowHeight);

  inp = createInput('');
  inp.position(0, 10);
  inp.input(myInputEvent);

  sendButton = createButton("Send");
  sendButton.mousePressed(sendText);
  sendButton.position(150, 10);
  
    p5l = new p5LiveMedia(this, "DATA", null, roomName);
  p5l.on("data", gotData);
  p5l.on('disconnect', gotDisconnect);

}

function gotDisconnect(id) {
  print(id + ": disconnected");
}

function gotData(data, id) {
  print(id + ":" + data);
  console.log('got it');
  
  // If it is JSON, parse it
  let d = JSON.parse(data);
  console.log(data);
  messages.push(d);
}

function draw() {
  console.log(messages);
  for(let i = 0; i < messages.length; i++) { 
    let s = messages[i].time_hour + ':' + messages[i].time_min + ' // ' + messages[i].msg;
   fill(color(messages[i].r, messages[i].g, messages[i].b));
    text(s, 0, (20*i)+52);
    // console.log(s);
  }
}

function myInputEvent() {
  prompt_value = this.value()
}

function sendText() {
  // console.log(prompt_value);
  let dataToSend = {msg: prompt_value, r: color_r, g: color_g, b: color_b, time_min: minute(), time_hour: hour()};
  console.log(dataToSend);
  messages.push(dataToSend);
  p5l.send(JSON.stringify(dataToSend));
}