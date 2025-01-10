let starionary={x:0,charge:(1.6e-19)};
let moving={x:1,charge:(1.6e-19),v:0,volts:0,m:9.109e-31};
let work=0;
let playing=false;
let vk=9e18;
let startVoltage=0;
let endVoltage=0;
let calculatedWork=0;
let k=9e6;
let intial=0;

function drawGridLine(ctx,tickLineLength){
    ctx.beginPath();
    ctx.fillStyle="Black";
    ctx.moveTo(0,200);
    ctx.lineTo($("#field").width(),200);
    ctx.stroke();
    for(let i=1;i<=15;i++){
        ctx.moveTo(100*i -25 ,200-tickLineLength);
        ctx.lineTo(100*i-25,200+tickLineLength);
        ctx.stroke();
        ctx.font = "10px Arial";
        ctx.fillText(i,100*i - (i>=10? 31:26),200+tickLineLength*4); 
    }
    let units="km";
    ctx.fillText(units,$("#field").width()-18,220);
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
    ctx.arc(100*moving.x-25, 200, 10, 0, 2 * Math.PI);
    ctx.fill();
}
function clearScreen(ctx){
    ctx.beginPath();
    ctx.fillStyle='#faff81';
    ctx.fillRect(0,0,$("#field").width(),$("#field").height());
}
function calculateForce(x){
    return k*(moving.charge*starionary.charge)/Math.pow(x,2)
}
function calculateVoltage(){
    return vk*(starionary.charge)/(moving.x)
}
function updateMoving(dt){
    const force= calculateForce(moving.x);
    
    moving.v+=(force/moving.m)*dt;
    const prevX=moving.x;
    moving.x+=moving.v*dt;
    const newForce=calculateForce(moving.x);
    work+=(newForce*(moving.x-prevX));
    moving.volts=calculateVoltage();
    console.log(moving);
}
function draw(){
    const dt=0.005;
    clearScreen(ctx);
    updateMoving(dt);
    drawMovingCharge(ctx,moving);
    if(playing){
        window.requestAnimationFrame(draw);
    }   
}
function calculateWork(v1,v2,q,divisor){
    return (v1-v2)/divisor*q;
}
$(document).ready(
    function(){
    drawMovingCharge(ctx,moving);    
    $('#StationaryTypeE').click(function(){
        if(!($('#StationaryTypeE').hasClass('choosen'))){
            $('#StationaryTypeE').addClass("choosen");
            $('#StationaryTypeC').removeClass("choosen");
            starionary.charge*=1.6e-19;
            drawMovingCharge(ctx,moving);
        }
    });
    $("#StationaryTypeC").click(function(){
        if(!($('#StationaryTypeC').hasClass('choosen'))){
            $('#StationaryTypeC').addClass("choosen");
            $('#StationaryTypeE').removeClass("choosen");
            starionary.charge/=1.6e-13;
            drawMovingCharge(ctx,moving);
        }
    });
    $('#MovingTypeE').click(function(){
        if(!($('#MovingTypeE').hasClass('choosen'))){
            $('#MovingTypeE').addClass("choosen");
            $('#MovingTypeC').removeClass("choosen");
            moving.charge*=1.6e-19;
            drawMovingCharge(ctx,moving);
        }
    });
    $("#MovingTypeC").click(function(){
        if(!($('#MovingTypeC').hasClass('choosen'))){
            $('#MovingTypeC').addClass("choosen");
            $('#MovingTypeE').removeClass("choosen");
            moving.charge/=1.6e-13;
            drawMovingCharge(ctx,moving);
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
        if(moving.charge<1e-6){
            moving.charge=(parseInt($(this).val())*(1.6e-19));
        }else{
            moving.charge=(parseInt($(this).val())*1e-6);
            scale++;
        }
    })
    $("#StationaryChargeAmount").change(function(){
        if(starionary.charge<1e-6){
            starionary.charge=(parseInt($(this).val())*(1.6e-19));
        }else{
            starionary.charge=(parseInt($(this).val())*1e-6);
        }
    })
    $("#PlaySim").click(function(){
        if(!playing){
            playing=true;
            $(this).attr("src","./images/pause.png");
            startVoltage=calculateVoltage();
            const sV=startVoltage;
            intial=moving.x;
            $("#startVoltage").text(sV.toFixed(2)+" nV");
            window.requestAnimationFrame(draw);
        }else{
            playing=false;
            $(this).attr("src","./images/play-button.png");
            endVoltage=calculateVoltage();
            calculatedWork=calculateWork(startVoltage,endVoltage,moving.charge,9e9);
            let coolWork=0;
            for(let i=intial*1000;i<(moving.x*1000){
                const x=i/1000;
                coolWork+=calculateForce(i)*1/1000;
            }
            alert(coolWork);
            $("#endVoltage").text(endVoltage.toFixed(2)+" nV");
            $("#WorkEstimate").text((work*1e32).toFixed(2)+" x 10^-30 J");
            $("#WorkCalculated").text((calculatedWork*1e30).toFixed(2)+" x 10^-30 J");
        }
        
    })
},
)
const canvas=document.getElementById("field");
    var ctx=canvas.getContext("2d");
