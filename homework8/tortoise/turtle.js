'use strict';
/*global Raphael: false */

function Turtle(id) {
  //this.paper = new Raphael(x, y, w, h);
  this.paper = new Raphael(id);
  this.size = 64;

  // Start turtle in center of canvas.
  var elem = $('#' + id);
  this.originX = elem.width() / 2;
  this.originY = elem.height() / 2;

  this.clear();
}

Turtle.prototype.clear = function () {
  this.color = '#00f';
  this.opacity = 1.0;
  this.width = 4;
  this.angle = 90; // facing upward
  this.pen = true;
  this.turtleImg = null;
  this.x = this.originX;
  this.y = this.originY;

  this.paper.clear();
  this.updateTurtle();
};

Turtle.prototype.drawTo = function (x, y) {
  var x1 = this.x;
  var y1 = this.y;
  var params = {
    'stroke': this.color,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-opacity': this.opacity,
    'stroke-width': 4
  };
  this.paper.path(
    Raphael.format("M{0},{1}L{2},{3}", x1, y1, x, y)).attr(params);
};

Turtle.prototype.forward = function (d) {
  var newX = this.x + Math.cos(Raphael.rad(this.angle)) * d;
  var newY = this.y - Math.sin(Raphael.rad(this.angle)) * d;
  if (this.pen) {
    this.drawTo(newX, newY);
  }
  this.x = newX;
  this.y = newY;
  this.updateTurtle();
};

Turtle.prototype.home = function () {
  this.setPosition(this.originX, this.originY);
};

Turtle.prototype.left = function (ang) {
  this.angle += ang;
  this.updateTurtle();
};

Turtle.prototype.penUp = function () {
  this.pen = false;
};

Turtle.prototype.penDown = function () {
  this.pen = true;
};

Turtle.prototype.right = function (ang) {
  this.angle -= ang;
  this.updateTurtle();
};

Turtle.prototype.setColor = function (r, g, b) {
  this.color = Raphael.rgb(r, g, b);
};

Turtle.prototype.setHeading = function (a) {
  this.angle = a;
  this.updateTurtle();
};

Turtle.prototype.setOpacity = function (opacity) {
  this.opacity = opacity;
};

Turtle.prototype.setPosition = function (x, y) {
  this.x = x;
  this.y = y;
  this.updateTurtle();
};

Turtle.prototype.setWidth = function (width) {
  this.width = width;
};

Turtle.prototype.updateTurtle = function () {
  if (!this.turtleImg) {
    this.turtleImg = this.paper.image(
      "http://nathansuniversity.com/gfx/turtle2.png",
      0, 0, this.size, this.size);
  }
  var halfSize = this.size / 2;
  this.turtleImg.attr({
    x: this.x - halfSize,
    y: this.y - halfSize,
    transform: "r" + (-this.angle)
  });
  this.turtleImg.toFront();
};
