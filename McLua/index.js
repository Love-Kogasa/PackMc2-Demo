var PMC = require( "pack-mc-2" )
var lua = require( "lua.js" )
// 对lua.js有微改动！
var mod = PMC.Addon.fromJSON( "lua-computer" )
mod.setNamespace( "mclua" )
mod.requireModule( "@minecraft/server-ui" )
mod.loadResources( "lua" )
mod.setEntryPack( "data/" )
mod.setEntry()
var ctx = mod.getAddonCtx()
var luactx = lua.newContext()
var block = ctx.Block( "Lua Computer", {
  texture: 3,
  destroy_time: 1, block_light_emission: 0.5
})
block.category = "items"
block.set( "loot", ctx.LootTable( block.getId()).toString() )
ctx.Recipe( block, {
  table: ["xxx", "x x", "xxx"], key: {x: "minecraft:iron_block"}
})
var i18n = ctx.plugins.i18n.new( "zh_CN" )
i18n.t( "tile." + block.object.subId() + ".name", "Lua电脑" )
ctx.onMinecraft((mc) => {
  luactx.loadStdLib()
  luactx._G.set( "mc", mc )
  luactx._G.set( "message", mc.print )
  // lua.js 多好的项目啊，可惜不更了似乎
  // 不过也好理解，纯js的lua解释器跟基于wasm的wasmoon什么的几乎没有优势
  var code = "message( \"Hello World\" )"
  mc.world.afterEvents.entityHitBlock.subscribe(({damagingEntity, hitBlock}) => {
    if( hitBlock.typeId == block.getId() && damagingEntity.typeId == "minecraft:player" ){
      var form = new mc.serverUi.ModalFormData()
      form.title( "Lua Computer" )
        .textField( "luaCode", code )
        // .submitButton( "Run it now！" ) 1.2.0不支持此方法
        .show(damagingEntity)
          .then(( fdata ) => {
            if( fdata.canceled ) return;
            try {
              code = fdata.formValues[0] || code
              luactx.loadString( code )()
            } catch( err ){
              mc.print( "[LuaError] " + err.toString() )
            }
          })
      .catch( console.error )
    }
  })
})
mod.generate()