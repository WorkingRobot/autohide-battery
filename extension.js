const UPower = imports.ui.status.power.UPower
const Main = imports.ui.main

let watching

function show () {
  getBattery((proxy, icon) => {
    icon.show()
  })
}

function hide () {
  getBattery((proxy, icon) => {
    icon.hide()
  })
}

function update () {
  getBattery(proxy => {
    let isDischarging = proxy.State === UPower.DeviceState.DISCHARGING
    let isFullyCharged = proxy.State === UPower.DeviceState.FULLY_CHARGED
    if (proxy.Type !== UPower.DeviceKind.BATTERY) {
      show()
    } else if (isFullyCharged) {
      hide()
    } else if (proxy.Percentage === 100 && !isDischarging) {
      hide()
    } else {
      show()
    }
  })
}

function getBattery (callback) {
  let menu = Main.panel.statusArea.aggregateMenu
  if (menu && menu._power) {
    callback(menu._power._proxy, menu._power.indicators)
  }
}

/* exported enable, disable */

function enable () {
  getBattery(proxy => {
    watching = proxy.connect('g-properties-changed', update)
  })
  update()
}

function disable () {
  getBattery(proxy => {
    proxy.disconnect(watching)
  })
  show()
}
