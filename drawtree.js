// Generated by CoffeeScript 1.6.3
/*
# drawtree.coffee
# Quick-and-dirty tree visualization
#
# Copyright (c) 2013 Anthony Bau
# MIT License.
*/


(function() {
  var PADDING, Tree, exports, parse;

  PADDING = 10;

  exports = {};

  exports.Tree = Tree = (function() {
    function Tree(parent, value, depth) {
      this.parent = parent;
      this.value = value;
      this.depth = depth;
      if (this.parent != null) {
        this.parent.children.push(this);
      }
      this.children = [];
      this.dimensions = null;
    }

    Tree.prototype.computeDimensions = function(ctx, fontSize, lineHeight) {
      var bottomHeight, child, topHeight, width, _i, _len, _ref;
      if (fontSize == null) {
        fontSize = 20;
      }
      if (lineHeight == null) {
        lineHeight = 20;
      }
      ctx.font = "" + fontSize + "px Courier New";
      width = 0;
      topHeight = fontSize + lineHeight;
      bottomHeight = 0;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.computeDimensions(ctx, fontSize, lineHeight);
        bottomHeight = Math.max(child.dimensions.height, bottomHeight);
        width += child.dimensions.width;
      }
      width = Math.max(width, ctx.measureText(this.value).width + PADDING);
      return this.dimensions = {
        width: width,
        height: topHeight + bottomHeight
      };
    };

    Tree.prototype.drawTreePath = function(ctx, fontSize, lineHeight, coords) {
      var child, runningLeft, top, _i, _len, _ref, _results;
      if (fontSize == null) {
        fontSize = 20;
      }
      if (lineHeight == null) {
        lineHeight = 20;
      }
      if (coords == null) {
        coords = {
          x: 20,
          y: 20
        };
      }
      ctx.strokeStyle = '#000';
      this.rectX = coords.x + (this.dimensions.width - ctx.measureText(this.value).width) / 2;
      this.rectY = coords.y - fontSize;
      top = coords.y + fontSize + lineHeight;
      runningLeft = coords.x;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.drawTreePath(ctx, fontSize, lineHeight, {
          x: runningLeft,
          y: top
        });
        if (this.parent !== null) {
          ctx.strokeStyle = '#000';
          ctx.beginPath();
          ctx.moveTo(coords.x + this.dimensions.width / 2, coords.y);
          ctx.lineTo(runningLeft + child.dimensions.width / 2, top);
          ctx.stroke();
        }
        _results.push(runningLeft += child.dimensions.width);
      }
      return _results;
    };

    Tree.prototype.drawText = function(ctx, fontSize, lineHeight) {
      var child, _i, _len, _ref, _results;
      if (fontSize == null) {
        fontSize = 20;
      }
      if (lineHeight == null) {
        lineHeight = 20;
      }
      if (this.parent !== null) {
        ctx.fillStyle = '#FFF';
        ctx.strokeRect(this.rectX, this.rectY, ctx.measureText(this.value).width, fontSize);
        ctx.fillRect(this.rectX, this.rectY, ctx.measureText(this.value).width, fontSize);
        ctx.fillStyle = '#000';
        ctx.font = "" + fontSize + "px Courier New";
        ctx.fillText(this.value, this.rectX, this.rectY + fontSize);
      }
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.drawText(ctx, fontSize, lineHeight));
      }
      return _results;
    };

    Tree.prototype.draw = function(ctx, fontSize, lineHeight, coords) {
      if (fontSize == null) {
        fontSize = 20;
      }
      if (lineHeight == null) {
        lineHeight = 20;
      }
      if (coords == null) {
        coords = {
          x: 20,
          y: 20
        };
      }
      this.computeDimensions(ctx, fontSize, lineHeight);
      this.drawTreePath(ctx, fontSize, lineHeight, coords);
      return this.drawText(ctx, fontSize, lineHeight);
    };

    return Tree;

  })();

  exports.parse = parse = function(string) {
    var indent, line, lines, tree, _i, _len;
    lines = string.split('\n');
    tree = new Tree(null, 'root', -1);
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      line = lines[_i];
      indent = line.length - line.trimLeft().length;
      if (indent === line.length) {
        continue;
      } else if (indent > tree.depth) {
        tree = new Tree(tree, line.trimLeft(), indent);
      } else if (indent <= tree.depth) {
        while (!(tree.depth < indent)) {
          tree = tree.parent;
        }
        tree = new Tree(tree, line.trimLeft(), indent);
      }
    }
    while (tree.parent !== null) {
      tree = tree.parent;
    }
    return tree;
  };

  window.tabdown = exports;

}).call(this);

/*
//@ sourceMappingURL=drawtree.map
*/