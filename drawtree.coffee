###
# drawtree.coffee
# Quick-and-dirty tree visualization
#
# Copyright (c) 2013 Anthony Bau
# MIT License.
###
PADDING = 10

exports = {}

exports.Tree = class Tree
  constructor: (@parent, @value, @depth) ->
    if @parent? then @parent.children.push this
    @children = []
    @dimensions = null
  
  # Rendering capabilities
  computeDimensions: (ctx, fontSize = 20, lineHeight = 20) ->
    ctx.font = "#{fontSize}px Courier New"
    width = 0
    topHeight = fontSize + lineHeight
    bottomHeight = 0

    for child in @children
      child.computeDimensions ctx, fontSize, lineHeight
      bottomHeight = Math.max child.dimensions.height, bottomHeight
      width += child.dimensions.width

    width = Math.max width, ctx.measureText(@value).width + PADDING

    @dimensions = {
      width: width
      height: topHeight + bottomHeight
    }

  drawTreePath: (ctx, fontSize = 20, lineHeight = 20, coords = {x:20, y:20}) ->
    ctx.strokeStyle = '#000'

    @rectX = coords.x + (@dimensions.width - ctx.measureText(@value).width) / 2
    @rectY = coords.y - fontSize
    
    top = coords.y + fontSize + lineHeight
    runningLeft = coords.x

    for child in @children
      child.drawTreePath ctx, fontSize, lineHeight, {
        x: runningLeft,
        y: top
      }
      
      unless @parent is null
        ctx.strokeStyle = '#000'
        
        ctx.beginPath()
        ctx.moveTo coords.x + @dimensions.width / 2, coords.y
        ctx.lineTo runningLeft + child.dimensions.width / 2, top
        ctx.stroke()

      runningLeft += child.dimensions.width
  
  drawText: (ctx, fontSize = 20, lineHeight = 20) ->
    unless @parent is null
      ctx.fillStyle = '#FFF'
      ctx.strokeRect @rectX, @rectY, ctx.measureText(@value).width, fontSize
      ctx.fillRect @rectX, @rectY, ctx.measureText(@value).width, fontSize
      ctx.fillStyle = '#000'
      
      ctx.font = "#{fontSize}px Courier New"
      ctx.fillText @value, @rectX, @rectY + fontSize

    for child in @children then child.drawText ctx, fontSize, lineHeight

  draw: (ctx, fontSize = 20, lineHeight = 20, coords = {x:20, y:20}) ->
    @computeDimensions ctx, fontSize, lineHeight
    @drawTreePath ctx, fontSize, lineHeight, coords
    @drawText ctx, fontSize, lineHeight

exports.parse = parse = (string) ->
  lines = string.split '\n'
  tree = new Tree null, 'root', -1
  for line in lines
    indent = line.length - line.trimLeft().length
    if indent is line.length
      continue
    else if indent > tree.depth
      tree = new Tree tree, line.trimLeft(), indent
    else if indent <= tree.depth
      until tree.depth < indent
        tree = tree.parent
      tree = new Tree tree, line.trimLeft(), indent

  until tree.parent is null
    tree = tree.parent

  return tree

window.tabdown = exports
