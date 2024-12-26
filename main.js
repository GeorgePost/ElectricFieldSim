let starionary={x:0,charge:(1.6e-19)};
let moving={x:1,charge:(1.6e-19)};
$(document).ready(function(){
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
})

