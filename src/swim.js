// ------------------------------------------------------------
// Variables & Settings
// ------------------------------------------------------------
var gs = 3; // guard speed is 3x the swimmer speed
var ss = 1;
var r = 10; // radius
var p = 25; // padding
two.renderer.setSize(500, 500);

$(document).ready(function(){
    $(".gs").text(gs);
    $(".ss").text(ss);
    $(".width").text(two.width);
    $(".height").text(two.height);
})

// ------------------------------------------------------------
// Walls, guard, swimmer
// ------------------------------------------------------------
two.makeGroup(
    two.makeLine(p, p, p, two.height-p),
    two.makeLine(p, p, two.width-p, p),
    two.makeLine(two.width-p, p, two.width-p, two.height-p),
    two.makeLine(p, two.height-p, two.width-p, two.height-p)
).stroke = "#a3a3a3";

var guard = two.makeCircle(p, two.height-p, r, r);
guard.fill = "lightgreen";
guard.stroke = "darkgreen";
guard.linewidth = 2;
var gd = new Two.Vector(0, -gs);

var swimmer = two.makeCircle(two.width/2, two.height/2, r, r);
swimmer.fill = "pink";
swimmer.stroke = "orangered";
swimmer.linewidth = 2;

// ------------------------------------------------------------
// Utilities
// ------------------------------------------------------------
function make_trail(obj, c){
    if (two.frameCount % 10 === 0){
        var trail = two.makeCircle(obj.translation.x, obj.translation.y, 1,1);
        trail.fill = c;
        trail.stroke = c;
    }
}

// ------------------------------------------------------------
// Update
// ------------------------------------------------------------

function mainloop(){
    // Swimmer movements (always away form the guard)
    var direction = guard.translation.clone().sub(swimmer.translation);
    var displacement = direction.normalize().multiplyScalar(ss).negate();

    swimmer.translation.add(displacement);
    make_trail(swimmer, "red");    

    // Guard movements
    if (guard.translation.y < p){
        guard.translation.y = p;
        gd = new Two.Vector(-gd.y, gd.x);
    }
    if (guard.translation.x > two.width - p){
        guard.translation.x = two.width - p;
        gd = new Two.Vector(-gd.y, gd.x);
    }
    if (guard.translation.y > two.height - p && guard.translation.x > two.width/2){
        guard.translation.y = two.height - p;
        gd = new Two.Vector(-gd.y, gd.x);
    }
    if (guard.translation.x < p){
        guard.translation.x = p;
        gd = new Two.Vector(-gd.y, gd.x);
    }

    guard.translation.add(gd);
    make_trail(guard, "green");

    // Game over condition
    if (swimmer.translation.x >= two.width - p ||
        swimmer.translation.y >= two.height - p ||
        swimmer.translation.x <= p ||
        swimmer.translation.y <= p){
        two.unbind("update");
    }

    $(".frames").text(two.frameCount);
}

two.bind('update', mainloop);
