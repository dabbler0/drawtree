// Generated by CoffeeScript 1.6.3
/*
# drawtree.coffee
# Quick-and-dirty tree visualization
#
# Copyright (c) 2013 Anthony Bau
# MIT License.
*/


(function() {
  var PADDING, Tree, exports, parseCoffee;

  PADDING = 10;

  exports = {};

  exports.Tree = Tree = (function() {
    function Tree(parent, value, depth, extra) {
      this.parent = parent;
      this.value = value;
      this.depth = depth;
      this.extra = extra;
      if (this.parent != null) {
        this.parent.children.push(this);
      }
      this.children = [];
      this.dimensions = null;
    }

    Tree.prototype.computeDimensions = function(ctx, fontSize, lineHeight) {
      var bottomHeight, child, ref, topHeight, width, _i, _len, _ref;
      if (fontSize == null) {
        fontSize = 20;
      }
      if (lineHeight == null) {
        lineHeight = 20;
      }
      ctx.font = "" + fontSize + "px Arial";
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
      if (width > (ref = ctx.measureText(this.value).width + PADDING)) {
        this.centerChildren = false;
      } else {
        this.centerChildren = true;
        this.childrenWidth = width;
        width = ref;
      }
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
      this.rectY = coords.y - fontSize / 2;
      top = coords.y + fontSize + lineHeight;
      runningLeft = coords.x;
      if (this.centerChildren) {
        runningLeft += (this.dimensions.width - this.childrenWidth) / 2;
      }
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

    Tree.prototype.drawBoxPath = function(ctx, fontSize, lineHeight, coords) {
      var child, runningLeft, top, _i, _len, _ref;
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
      this.rectY = coords.y;
      top = coords.y + fontSize + lineHeight;
      runningLeft = coords.x;
      if (this.centerChildren) {
        runningLeft += (this.dimensions.width - this.childrenWidth) / 2;
      }
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.drawBoxPath(ctx, fontSize, lineHeight, {
          x: runningLeft,
          y: top
        });
        runningLeft += child.dimensions.width;
      }
      if (this.parent !== null) {
        ctx.strokeStyle = '#000';
        console.log('stroking rect', this.value);
        return ctx.strokeRect(coords.x, coords.y, this.dimensions.width, this.dimensions.height);
      }
    };

    Tree.prototype.drawText = function(ctx, fontSize, lineHeight, style) {
      var child, _i, _len, _ref, _ref1, _ref2, _results;
      if (fontSize == null) {
        fontSize = 20;
      }
      if (lineHeight == null) {
        lineHeight = 20;
      }
      if (style == null) {
        style = {
          border: '#000',
          background: '#FFF'
        };
      }
      if (this.parent !== null) {
        ctx.strokeStyle = style.border;
        ctx.fillStyle = style.background;
        ctx.strokeRect(this.rectX, this.rectY, ctx.measureText(this.value).width, fontSize);
        ctx.fillRect(this.rectX, this.rectY, ctx.measureText(this.value).width, fontSize);
        ctx.fillStyle = (_ref = style.color) != null ? _ref : '#000';
        ctx.font = "" + fontSize + "px " + ((_ref1 = style.font) != null ? _ref1 : 'Arial');
        ctx.fillText(this.value, this.rectX, this.rectY + fontSize);
      }
      _ref2 = this.children;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        child = _ref2[_i];
        _results.push(child.drawText(ctx, fontSize, lineHeight, style));
      }
      return _results;
    };

    Tree.prototype.drawTree = function(ctx, fontSize, lineHeight, coords) {
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

    Tree.prototype.drawBox = function(ctx, fontSize, lineHeight, coords) {
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
      this.drawBoxPath(ctx, fontSize, lineHeight, coords);
      return this.drawText(ctx, fontSize, lineHeight, {
        border: 'transparent',
        background: 'transparent'
      });
    };

    Tree.prototype.draw = function() {
      return this.drawTree.apply(this, arguments);
    };

    return Tree;

  })();

  exports.parseTabdown = function(string) {
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

  exports.parseLisp = function(string) {
    var char, depth, engage, str, token, tokens, tree, _i, _j, _len, _len1;
    tokens = [];
    str = '';
    for (_i = 0, _len = string.length; _i < _len; _i++) {
      char = string[_i];
      switch (char) {
        case '(':
          if (str.length > 0) {
            tokens.push(str);
            str = '';
          }
          tokens.push('(');
          break;
        case ')':
          if (str.length > 0) {
            tokens.push(str);
            str = '';
          }
          tokens.push(')');
          break;
        case ' ':
        case '\n':
          if (str.length > 0) {
            tokens.push(str);
            str = '';
          }
          break;
        default:
          str += char;
      }
    }
    if (str.length > 0) {
      tokens.push(str);
      str = '';
    }
    tree = new Tree(null, 'root', 0);
    depth = 0;
    engage = false;
    for (_j = 0, _len1 = tokens.length; _j < _len1; _j++) {
      token = tokens[_j];
      console.log(token);
      switch (token) {
        case '(':
          tree = new Tree(tree, '  ', tree.depth + 1);
          break;
        case ')':
          tree = tree.parent;
          break;
        default:
          new Tree(tree, token, tree.depth + 1);
      }
    }
    while (tree.parent !== null) {
      tree = tree.parent;
    }
    return tree;
  };

  parseCoffee = function(node) {
    var root;
    root = new Tree(null, node.constructor.name);
    node.eachChild(function(child) {
      var newNode;
      newNode = parseCoffee(child);
      newNode.parent = root;
      return root.children.push(newNode);
    });
    return root;
  };

  exports.parseCoffee = function(text) {
    return parseCoffee(CoffeeScript.nodes(text));
  };

  window.tabdown = exports;

}).call(this);

/*
//@ sourceMappingURL=drawtree.map
*/
