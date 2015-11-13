var canvas= document.getElementById("main-canvas");
var width;
var height;
var stage;
var shapeContainer;
var hoverShape;
var shift_down = false;

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

function GetRandomNumberBetween(lo, hi) {
  return Math.floor(lo + Math.random() * (hi - lo));
}

Number.prototype.FindClosestNumberThatIsDivisibleBy = function(n) {
  return Math.round(this / n) * n;
};

var eventManager = {
    makeHoverable:function(shape){
        shape.on('mouseout', function(){
            if(hoverShape){
                hoverShape.shadow = new createjs.Shadow("#000000", 0, 0, 10);
            }
            hoverShape = null;
            stage.update();
        });
        shape.on('mouseover', function(){
            hoverShape = shape;
            if(hoverShape){
                hoverShape.shadow = new createjs.Shadow("#7799FF", 0, 0, 10);
            }
            shapeContainer.setChildIndex(hoverShape, shapeContainer.getNumChildren()-1);
            stage.update();
        });
    },
    makeDraggable:function(shape){
        shape.on('mousedown', function(e){
                this.offset = {x: this.x - e.stageX, y: this.y - e.stageY};
        });

        shape.on('pressmove', function(e){
            this.x = e.stageX + this.offset.x;
            this.y = e.stageY + this.offset.y;
            stage.update();
        });
    },
    handleMouseWheel:function(e){
        if(hoverShape){
            var sign = e.wheelDelta > 0 ? 1 : -1;
            var factor = shift_down ? 10 : 1;
            hoverShape.rotation += (sign * factor);
            stage.update();
        }
    }
};

canvas.addEventListener("mousewheel", eventManager.handleMouseWheel, false);
canvas.addEventListener("DOMMouseScroll", eventManager.handleMouseWheel, false);

var init = function(){
    stage = new createjs.Stage("main-canvas");
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

    shapeContainer = new createjs.Container();
    lightSourceContainer = new createjs.Container();
    stage.addChild(lightSourceContainer);
    stage.addChild(shapeContainer);
    resizeCanvas();
};

var getRandCoords = function(margin){
    var x =  (width * Math.random()).clamp(margin, width - margin);
    var y =  (height * Math.random()).clamp(margin, height - margin);
    return {
        x:x,
        y:y
    };
};

var baseLength = 96;

var geo = {
    addPuzzle:function(){
        geo.addSquare();
        geo.addLargeTriangle();
        geo.addLargeTriangle();
        geo.addRhombus();
        geo.addMediumTriangle();
        geo.addSmallTriangle();
        geo.addSmallTriangle();
        geo.addSquare();
        geo.addLargeTriangle();
        geo.addLargeTriangle();
        geo.addRhombus();
        geo.addMediumTriangle();
        geo.addSmallTriangle();
    },
    addAll:function(){
        geo.addSquare();
        geo.addLargeTriangle();
        geo.addLargeTriangle();
        geo.addRhombus();
        geo.addMediumTriangle();
        geo.addSmallTriangle();
        geo.addSmallTriangle();
    },
    addSquare : function(){
        var coords = getRandCoords(baseLength*2);
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#000000")
            .drawRect(0, 0, baseLength, baseLength);

        shape.x = coords.x;
        shape.y = coords.y;

        shape.regX = baseLength/2 ;
        shape.regY = baseLength/2;

        shape.rotation = GetRandomNumberBetween(0, 360)
            .FindClosestNumberThatIsDivisibleBy(3);
        shape.shadow = new createjs.Shadow("#000000", 0, 0, 10);
        eventManager.makeHoverable(shape);
        eventManager.makeDraggable(shape);
        shapeContainer.addChild(shape);
        stage.update();
    },

    addTriangle : function(length){
        var coords = getRandCoords(length*2);
        
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#000000")
            .moveTo(0,0)
            .lineTo(length,0)
            .lineTo(length, length)
            .lineTo(0,0);
        
        shape.x = coords.x;
        shape.y = coords.y;

        shape.regX = length/2;
        shape.regY = length/2;
        shape.rotation = GetRandomNumberBetween(0, 360)
            .FindClosestNumberThatIsDivisibleBy(3);
            
        shape.shadow = new createjs.Shadow("#000000", 0, 0, 10);
        eventManager.makeHoverable(shape);
        eventManager.makeDraggable(shape);
        shapeContainer.addChild(shape);
        stage.update();
    },

    addSmallTriangle : function(){
        geo.addTriangle(baseLength);
    },

    addMediumTriangle : function(){
        geo.addTriangle(Math.sqrt(baseLength*baseLength*2));
    },

    addLargeTriangle : function(){
        geo.addTriangle(baseLength*2);
    },

    addRhombus: function(){
        var coords = getRandCoords(baseLength*2);
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#000000")
            .moveTo(baseLength,0)
            .lineTo(baseLength,baseLength)
            .lineTo(0, baseLength*2)
            .lineTo(0, baseLength)
            .lineTo(baseLength,0);

        shape.x = coords.x;
        shape.y = coords.y;

        shape.regX = baseLength/2;
        shape.regY = baseLength;

        shape.rotation = GetRandomNumberBetween(0, 360)
            .FindClosestNumberThatIsDivisibleBy(3);
        shape.shadow = new createjs.Shadow("#000000", 0, 0, 10);
        eventManager.makeHoverable(shape);
        eventManager.makeDraggable(shape);

        shape.on("dblclick", function(e){
            shape.scaleX = shape.scaleX * -1;
            stage.update();
        });

        shapeContainer.addChild(shape);
        stage.update();  
    }
};

var resizeCanvas = function(){
    if(stage){
        width = window.innerWidth;
        height = window.innerHeight - 10;
        stage.canvas.width = width;
        stage.canvas.height = height;
        stage.width = width;
        stage.height = height;
        
        lightSourceContainer.removeAllChildren();

        var back = new createjs.Shape();
        back.x = 0;
        back.y = 0;
        
        back.graphics.beginBitmapFill(queue.getResult("bg"),'repeat')
            .drawRect(0,0,width,height);
        lightSourceContainer.addChild(back);

        var middleX = width/2;
        var middleY = height/2;
        var outlineImg = queue.getResult("outline");
        var outline = new createjs.Bitmap(outlineImg);
        outline.x = middleX - (outlineImg.width/2);
        outline.y = middleY - (outlineImg.height/2);
        lightSourceContainer.addChild(outline);

        var lightSource = new createjs.Shape();
        var rad = Math.sqrt(middleX*middleX + middleY*middleY);
        lightSource.graphics.beginRadialGradientFill(
            ["rgba(0,0,0,0.01)", "rgba(0,0,0,1.0)"], [0.0, 1], middleX, middleY, 0, middleX, middleY, rad)
            .drawCircle(middleX, middleY, rad);
        lightSourceContainer.addChild(lightSource);

        stage.update();
    }
};

var queue;

$(function(){
    $(window).bind("resize", resizeCanvas);
    $(window).keydown(
        function(e){
            if(e.shiftKey){
                shift_down = true;
            }
        }
    );
    $(window).keyup(
        function(e){
            shift_down = false;
        }
    );

    queue = new createjs.LoadQueue(false);
    queue.on("complete", function(e){
        init();
    }, this);
    queue.loadFile({id:"bg", src:"images/stones.png"});
    queue.loadFile({id:"outline", src:"images/ooboutline.png"});
    queue.load();
});
