const PMC = require( "pack-mc-2" )
var mcmod = PMC.Addon.fromJSON( "./item" )
mcmod.setNamespace( "pmcii" )
var ctx = mcmod.getAddonCtx()

ctx.Item( "Hello World" )

mcmod.generate()