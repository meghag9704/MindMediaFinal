let sketch = function(p) { 

    p.sendButton;
    p.inp;
    p.currentMessage;
    p.prompt_value;
    p.cnv;
    p.p5l;
    p.roomName = "meghaArbChatRoom"
    p.messages = [];
    p.colArr = [];
    p.timeArr = [];
    p.myColor;
    p.color_r; 
    p.color_g;
    p.color_b;
    p.setup = function (){
        p.color_r = p.random(100, 255);
        p.color_g = p.random(100, 255);
        p.color_b = p.random(100, 255);
        p.myColor = p.color(p.color_r, p.color_g, p.color_b);
        p.cnv = p.createCanvas(500, 500);
        p.inp = p.createInput('');
        p.inp.position(0, 10);
        p.inp.input(p.myInputEvent);
      
        p.sendButton = p.createButton("Send");
        p.sendButton.mousePressed(p.sendText);
        p.sendButton.position(150, 10);
  
        p.p5l = new p5LiveMedia(this, "DATA", null, p.roomName);
        p.p5l.on("data", p.gotData);
        p.p5l.on('disconnect', p.gotDisconnect);
    }

    p.gotDisconnect = function(id) {
        p.print(id + ": disconnected");
    }

    p.gotData = function(data, id) {
        p.print(id + ":" + data);
        console.log('got it');
        
        // If it is JSON, parse it
        p.d = JSON.parse(data);
        console.log(data);
        p.messages.push(p.d);
    }

    p.draw = function() {
        console.log(p.messages);
        for(let i = 0; i < p.messages.length; i++) { 
            p.s = p.messages[i].time_hour + ':' + p.messages[i].time_min + ' // ' + p.messages[i].msg;
            p.fill(color(p.messages[i].r, p.messages[i].g, p.messages[i].b));
            p.text(s, 0, (20*i)+52);
            // console.log(s);
        }
    }

    p.myInputEvent = function() {
        p.prompt_value = this.value()
    }

    p.sendText = function() {
        // console.log(prompt_value);
        let dataToSend = {msg: p.prompt_value, r: p.color_r, g: p.color_g, b: p.color_b, time_min: minute(), time_hour: hour()};
        console.log(dataToSend);
        p.messages.push(dataToSend);
        p.p5l.send(JSON.stringify(dataToSend));
    }
}

let myp5 = new p5(sketch);
