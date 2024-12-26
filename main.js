let starionary={x:0,charge:(1.6e-19)};
let moving={x:1,charge:(1.6e-19),v:0,volts:0,m:9.109e-31};
let work=0;
let playing=false;
const k=9e3;

function drawGridLine(ctx,tickLineLength){
    ctx.beginPath();
    ctx.fillStyle="Black";
    ctx.moveTo(0,200);
    ctx.lineTo($("#field").width(),200);
    ctx.stroke(); 
    for(let i=1;i<=15;i++){
        ctx.moveTo(100*i -10 ,200-tickLineLength);
        ctx.lineTo(100*i-10,200+tickLineLength);
        ctx.stroke();
        ctx.font = "10px Arial";
        ctx.fillText(i,100*i - (i>=10? 16:9),200+tickLineLength*4);
    }
}
function drawStationaryCharge(ctx,charge){
    let Stationarycolor="#ff0e0e";
    if(charge<0){
        Stationarycolor="#dbf321";
    }
    ctx.beginPath();
    ctx.fillStyle=Stationarycolor;
    ctx.arc(30, 200, 30, 0, 2 * Math.PI);
    
    ctx.fill();
}
function drawMovingCharge(ctx,moving){
    let color="#ff0e0e";
    if(moving.charge<0){
        color="#dbf321";
    }
    clearScreen(ctx);
    drawGridLine(ctx,5);
    drawStationaryCharge(ctx,starionary.charge);
    ctx.beginPath();
    ctx.fillStyle=color;
    ctx.arc(100*moving.x-10, 200, 10, 0, 2 * Math.PI);
    ctx.fill();
}
function clearScreen(ctx){
    ctx.beginPath();
    ctx.fillStyle='white';
    ctx.fillRect(0,0,$("#field").width(),$("#field").height());
}
function claculateForce(){
    return k*(moving.charge*starionary.charge)/Math.pow(moving.x,2)
}
function calculateVoltage(){
    return k*(starionary.charge)/(moving.x)
}
function updateMoving(dt){
    const force= claculateForce()
    work+=force*moving.v*dt;
    moving.v+=(force/moving.m)*dt;
    moving.x+=moving.v*dt;
    moving.volts=calculateVoltage();
    console.log(moving,work);
}
function draw(){
    const dt=0.1;
    clearScreen(ctx);
    updateMoving(dt);
    drawMovingCharge(ctx,moving);
    if(playing){
        window.requestAnimationFrame(draw);
    }   
}
$(document).ready(
    function(){
    drawMovingCharge(ctx,moving);    
    $('#StationaryTypeE').click(function(){
        if(!($('#StationaryTypeE').hasClass('choosen'))){
            $('#StationaryTypeE').addClass("choosen");
            $('#StationaryTypeC').removeClass("choosen");
            starionary.charge*=1.6e-19;
        }
    });
    $("#StationaryTypeC").click(function(){
        if(!($('#StationaryTypeC').hasClass('choosen'))){
            $('#StationaryTypeC').addClass("choosen");
            $('#StationaryTypeE').removeClass("choosen");
            starionary.charge/=1.6e-19;
        }
    });
    $('#MovingTypeE').click(function(){
        if(!($('#MovingTypeE').hasClass('choosen'))){
            $('#MovingTypeE').addClass("choosen");
            $('#MovingTypeC').removeClass("choosen");
            moving.charge*=1.6e-19;
        }
    });
    $("#MovingTypeC").click(function(){
        if(!($('#MovingTypeC').hasClass('choosen'))){
            $('#MovingTypeC').addClass("choosen");
            $('#MovingTypeE').removeClass("choosen");
            moving.charge/=1.6e-19;
        }
    });
    $("#StationaryCharge").click(function(){
        starionary.charge*=-1;
        console.log(starionary);
        drawStationaryCharge(ctx,starionary.charge);
    });
    $("#MovingCharge").click(function(){
        moving.charge*=-1;
        console.log(moving);
        drawMovingCharge(ctx,moving);
    });
    $("#Position").change(function(){
        moving.x=parseInt($(this).val());
        drawMovingCharge(ctx,moving);
    });
    $("#MovingChargeAmount").change(function(){
        if(moving.charge<1){
            moving.charge=(parseInt($(this).val())*(1.6e-19));
        }else{
            moving.charge=(parseInt($(this).val()));
        }
    })
    $("#StationaryChargeAmount").change(function(){
        if(starionary.charge<1){
            starionary.charge=(parseInt($(this).val())*(1.6e-19));
        }else{
            starionary.charge=(parseInt($(this).val()));
        }
    })
    $("#PlaySim").click(function(){
        playing=!playing;
        window.requestAnimationFrame(draw);
    })
},
)
const canvas=document.getElementById("field");
    var ctx=canvas.getContext("2d");
