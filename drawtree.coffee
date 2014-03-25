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
  constructor: (@parent, @value, @depth, @extra) ->
    if @parent? then @parent.children.push this
    @children = []
    @dimensions = null
  
  # Rendering capabilities
  computeDimensions: (ctx, fontSize = 20, lineHeight = 20) ->
    ctx.font = "#{fontSize}px Arial"
    width = 0
    topHeight = fontSize + lineHeight
    bottomHeight = 0

    for child in @children
      child.computeDimensions ctx, fontSize, lineHeight
      bottomHeight = Math.max child.dimensions.height, bottomHeight
      width += child.dimensions.width

    if width > (ref = ctx.measureText(@value).width + PADDING)
      @centerChildren = false
    else
      @centerChildren = true
      @childrenWidth = width
      width = ref

    @dimensions = {
      width: width
      height: topHeight + bottomHeight
    }

  drawTreePath: (ctx, fontSize = 20, lineHeight = 20, coords = {x:20, y:20}) ->
    ctx.strokeStyle = '#000'

    @rectX = coords.x + (@dimensions.width - ctx.measureText(@value).width) / 2
    @rectY = coords.y - fontSize / 2
    
    top = coords.y + fontSize + lineHeight
    runningLeft = coords.x

    if @centerChildren
      runningLeft += (@dimensions.width - @childrenWidth) / 2

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

  drawBoxPath: (ctx, fontSize = 20, lineHeight = 20, coords = {x:20, y:20}) ->
    ctx.strokeStyle = '#000'

    @rectX = coords.x + (@dimensions.width - ctx.measureText(@value).width) / 2
    @rectY = coords.y
    
    top = coords.y + fontSize + lineHeight
    runningLeft = coords.x

    if @centerChildren
      runningLeft += (@dimensions.width - @childrenWidth) / 2

    for child in @children
      child.drawBoxPath ctx, fontSize, lineHeight, {
        x: runningLeft,
        y: top
      }

      runningLeft += child.dimensions.width
      
    unless @parent is null
      ctx.strokeStyle = '#000'
      console.log 'stroking rect', @value

      ctx.strokeRect coords.x, coords.y, @dimensions.width, @dimensions.height #fontSize + lineHeight
  
  drawText: (ctx, fontSize = 20, lineHeight = 20, style = {border: '#000', background: '#FFF'}) ->
    unless @parent is null
      ctx.strokeStyle = style.border
      ctx.fillStyle = style.background
      ctx.strokeRect @rectX, @rectY, ctx.measureText(@value).width, fontSize
      ctx.fillRect @rectX, @rectY, ctx.measureText(@value).width, fontSize
      ctx.fillStyle = style.color ? '#000'
      
      ctx.font = "#{fontSize}px #{style.font ? 'Arial'}"
      ctx.fillText @value, @rectX, @rectY + fontSize

    for child in @children then child.drawText ctx, fontSize, lineHeight, style

  drawTree: (ctx, fontSize = 20, lineHeight = 20, coords = {x:20, y:20}) ->
    @computeDimensions ctx, fontSize, lineHeight
    @drawTreePath ctx, fontSize, lineHeight, coords
    @drawText ctx, fontSize, lineHeight

  drawBox: (ctx, fontSize = 20, lineHeight = 20, coords = {x:20, y:20}) ->
    @computeDimensions ctx, fontSize, lineHeight
    @drawBoxPath ctx, fontSize, lineHeight, coords
    @drawText ctx, fontSize, lineHeight, {
      border: 'transparent',
      background: 'transparent'
    }

  draw: -> @drawTree.apply this, arguments

exports.parseTabdown = (string) ->
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

exports.parseLisp = (string) ->
  tokens = []
  str = ''
  for char in string
    switch char
      when '('
        if str.length > 0 then tokens.push str; str = ''
        tokens.push '('
      when ')'
        if str.length > 0 then tokens.push str; str = ''
        tokens.push ')'
      when ' ', '\n'
        if str.length > 0 then tokens.push str; str = ''
      else
        str += char

  if str.length > 0 then tokens.push str; str = ''
  
  tree = new Tree null, 'root', 0
  depth = 0
  engage = false
  for token in tokens
    console.log token
    switch token
      when '('
        tree = new Tree tree, '  ', tree.depth + 1
      when ')'
        tree = tree.parent
      else
        new Tree tree, token, tree.depth + 1
  
  until tree.parent is null
    tree = tree.parent

  return tree

parseCoffee = (node) ->
  root = new Tree null, node.constructor.name
  node.eachChild (child) ->
    newNode = parseCoffee child
    newNode.parent = root
    root.children.push newNode

  return root

exports.parseCoffee = (text) ->
  parseCoffee CoffeeScript.nodes text

window.tabdown = exports
