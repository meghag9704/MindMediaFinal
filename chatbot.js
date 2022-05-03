let nameInput;
let nameButton;
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

// runway
let model;
let input_slider;
let output_text;
let slider_val;
let text_display;

let waitingForResponse = false;

// firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGKf7fEupgwvYjoH6oNlwRk48k2sdADX8",
  authDomain: "mindmedia-final.firebaseapp.com",
  databaseURL: "https://mindmedia-final-default-rtdb.firebaseio.com",
  projectId: "mindmedia-final",
  storageBucket: "mindmedia-final.appspot.com",
  messagingSenderId: "114850818615",
  appId: "1:114850818615:web:dc7cfcb54fa79f1a886db2"
};

let group;
let currentDB;
let typeOfThing = "messages";
let db;
let allTextsLocal = {};
let inputBox;
let moveItButton;
let currentKey = -1;
let movedIt = false;

function preload() { 
    model = new rw.HostedModel({
        url: "https://personal-stories-2-547f55d1.hosted-models.runwayml.cloud/v1/",
        token: "OFsJQeAgwdIGpTdwW6YY/A==",
   });
 }

function setup(){

  nameInput = createInput('Enter your name');
  group = nameInput.value();
  console.log(group);
  nameInput.position(0,0);
  nameButton = createButton("Enter");
  nameButton.mousePressed(pullID);
  nameButton.position(150, 0);
  // document.getElementById('header').appendChild(nameInput);
  // inp.position(0, 100);
  // inp.input(myInputEvent);

  color_r = random(100, 255);
  color_g = random(100, 255);
  color_b = random(100, 255);
  myColor = color(color_r, color_g, color_b);
  cnv = createCanvas(500, 500);

  inp = createInput('');
  inp.position(0, 50);
  inp.input(myInputEvent);

  sendButton = createButton("Send");
  sendButton.mousePressed(sendText);
  sendButton.position(150, 50);
  
  input_slider = createSlider(0, 120, 20, 1);
  input_slider.position(0, 70);

  p5l = new p5LiveMedia(this, "DATA", null, roomName);
  p5l.on("data", gotData);
  p5l.on('disconnect', gotDisconnect);

  connectToFirebase();

}

function pullID() { 
  let currentDB = db.ref("group/" + group + "/" + typeOfThing + "/");  
  console.log(currentDB);
}

// from Dano's code 
function connectToFirebase() {
  const app = firebase.initializeApp(firebaseConfig);
  db = app.database();

  pullID();
  var myRef = db.ref("group/" + group + "/" + typeOfThing + "/");
  myRef.on("child_added", (data) => {
    //console.log("add", data.key, data.val());
    let key = data.key;
    let value = data.val();
    //update our local variable
    allTextsLocal[key] = value;
    console.log(allTextsLocal);
    // drawAll();
  });

  myRef.on("child_changed", (data) => {
    console.log("changed", data.key, data.val());
    let key = data.key;
    let value = data.val();
    allTextsLocal[key] = value;
    // drawAll();
   
  });

  myRef.on("child_removed", (data) => {
    console.log("removed", data.key);
    delete allTextsLocal[data.key];
  });
}

function sendTextToDB(dataToSend) {
  let mydata = dataToSend;
  //add a stroke
  if (currentKey == -1) {
    //new one
    let idOfNew = db.ref("group/" + group + "/" + typeOfThing + "/").push(mydata);
  } else {
    let idOfOld = db.ref("group/" + group + "/" + typeOfThing + "/" + currentKey).update(mydata);
  }
}

function gotDisconnect(id) {
  print(id + ": disconnected");
}

function gotData(data, id) {
  print(id + ":" + data);
  console.log('got it');
  
  // If it is JSON, parse it
  let d = JSON.parse(data);
  // console.log(data);
  messages.push(d);
}

function draw() {
    group = nameInput.value();
    chat();
    runwayText();
}

function chat() { 
  // console.log(messages);
  for(let i = 0; i < messages.length; i++) { 
    let s = messages[i].time_hour + ':' + messages[i].time_min + ' // ' + messages[i].msg;
   fill(color(messages[i].r, messages[i].g, messages[i].b));
    text(s, 0, (20*i)+112);
    // console.log(s);
  }
}

function runwayText() {
  textAlign(LEFT);
  textSize(12);
  fill(0);
  strokeWeight(1)
  text(output_text, 10, 190);
}

function myInputEvent() {
    if(prompt_value = this.value()) { 
        prompt_value = this.value();
        waitingForResponse = true;
    } else { 
        prompt_value = output_text;
        waitingForResponse = false;
    }
}

function sendText() {
  console.log(prompt_value);
   var slider_val = input_slider.value();
   console.log(slider_val);  
    const inputs = {
      prompt: prompt_value,
      max_characters: 1024,
      top_p: 0.9,
      seed: slider_val
  };
  
  model.query(inputs).then(outputs => {
    const { generated_text, encountered_end} = outputs;
    console.log(outputs);
    output_text = outputs.generated_text;
    console.log(output_text);

  });
//   queryData();

  if(prompt_value != inp.value()) { 

  }
  // console.log(prompt_value);
  let dataToSend = {msg: prompt_value, r: color_r, g: color_g, b: color_b, time_min: minute(), time_hour: hour()};
  console.log(dataToSend);
  messages.push(dataToSend);
  sendTextToDB(dataToSend);

  p5l.send(JSON.stringify(dataToSend));


}

function queryData() { 
}

