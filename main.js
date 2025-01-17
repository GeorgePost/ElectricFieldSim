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
    if(playing && moving.x>0.9){
        window.requestAnimationFrame(draw);
    }else if(moving.x<0.9){
        playing=false;
        $("#PlaySim").attr("src","./images/play-button.png");
        endVoltage=calculateVoltage();
        calculatedWork=calculateWork(startVoltage,endVoltage,moving.charge);
        let coolWork=0;
        const slices=1000000;
        if(intial>moving.x){
            for(let i=moving.x*slices;i<(intial*slices);i++){
                const x=i/slices+1/slices;
                coolWork+=calculateForce(x)*(-1/slices);
            }
        }else{
            for(let i=intial*slices;i<(moving.x*slices);i++){
                const x=i/slices+1/slices;
                coolWork+=calculateForce(x)*(1/slices);
            }
        }
        $("#endVoltage").text(endVoltage.toFixed(5)+" pV");
        $("#WorkEstimate").text((coolWork*1e32).toFixed(5)+" x 10^-32 J");
        $("#WorkCalculated").text((calculatedWork*1e20).toFixed(5)+" x 10^-32 J");
    }
}
function calculateWork(v1,v2,q){
    console.log(v1,v2,q);
    const work=((v1-v2))*q;
    console.log(work);
    return work;
}
$(document).ready(
    function(){
    drawMovingCharge(ctx,moving);
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
        if(moving.charge<0){
            moving.charge=(parseInt($(this).val())*(-1.6e-19));
        }else{
            moving.charge=(parseInt($(this).val())*(1.6e-19));
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
            document.getElementById("StationaryChargeAmount").disabled=true;
            document.getElementById("MovingChargeAmount").disabled=true;
            document.getElementById("Position").disabled=true;
            document.getElementById("StationaryCharge").disabled=true;
            document.getElementById("MovingCharge").disabled=true;
            $("#startVoltage").text(sV.toFixed(5)+" pV");
            window.requestAnimationFrame(draw);
        }else{
            playing=false;
            $(this).attr("src","./images/play-button.png");
            endVoltage=calculateVoltage();
            calculatedWork=calculateWork(startVoltage,endVoltage,moving.charge);
            let coolWork=0;
            const slices=1000000;
            if(intial>moving.x){
                for(let i=moving.x*slices;i<(intial*slices);i++){
                    const x=i/slices+1/slices;
                    coolWork+=calculateForce(x)*(-1/slices);
                }
            }else{
                for(let i=intial*slices;i<(moving.x*slices);i++){
                    const x=i/slices+1/slices;
                    coolWork+=calculateForce(x)*(1/slices);
                }
            }
            $("#endVoltage").text(endVoltage.toFixed(5)+" pV");
            $("#WorkEstimate").text((coolWork*1e32).toFixed(5)+" x 10^-32 J");
            $("#WorkCalculated").text((calculatedWork*1e20).toFixed(5)+" x 10^-32 J");
        }
        
    })
},
)
const canvas=document.getElementById("field");
var ctx=canvas.getContext("2d");
