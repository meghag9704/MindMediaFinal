let model;
let model2;
let send_btn;
let input_text;
let output_text;
let prompt_value;
let input_slider;
let slider_val;
let text_display;
let cnv;

function preload() { 
   model = new rw.HostedModel({
    url: "https://personal-stories-67b5f536.hosted-models.runwayml.cloud/v1/",
  token: "oEum3TQoJ7cHvEGEu5hJGg==",
  });
}
function setup(){
    cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent("p5canvas")
    cnv.style('z-index', '-1');
    cnv.position(0, 10);

    createMenu();

    input_text = createInput('');
    input_text.position(0, 100);
    input_text.input(myInputEvent);
    input_text.addClass("form-control");
    input_text.parent("input")

    input_slider = createSlider(0, 120, 20, 1);
    input_slider.position(0, 125);
    input_slider.parent("input")
    input_slider.addClass("slider")
}


function createMenu(){
    send_btn = createButton("Send Text");
    send_btn.mousePressed(sendText);
    send_btn.addClass("btn btn-lg btn-primary");
    send_btn.parent("#send_btn");
    send_btn.position(0, 150);
}

function myInputEvent() {
  prompt_value = this.value()
}

function sendText() {

   console.log(prompt_value);
   var slider_val = input_slider.value();
   console.log(slider_val);  
    const inputs = {
      prompt: prompt_value,
      max_characters: 1024,
      top_p: 0.9,
      "seed": slider_val
  };
  
  model.query(inputs).then(outputs => {
    const { generated_text, encountered_end} = outputs;
    console.log(outputs);
    output_text = outputs.generated_text;
    console.log(output_text);
    if(output_text) { 
      textAlign(LEFT);
      textSize(12);
      //fill(0);
      strokeWeight(1)
      text(output_text, 10, 190);
    }
  });
}