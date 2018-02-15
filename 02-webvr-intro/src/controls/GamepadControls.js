import isObject from 'lodash/isObject'

const SPACE_KEY_CODE = 32

const getGamepads = (
  navigator.getGamepads ||
  navigator.webkitGetGamepads ||
  (() => [])
).bind(navigator)

const isPressed = (button) => (
  (isObject(button)) ? button.pressed : button === 1
)

export default class GamepadControls {
  constructor (target) {
    this.enabled = true
    this.tracking = false
    this.useGamepad = false
    this.target = target || window
    this.batchedEvents = []
    this.prevGamepadState = []

    this.connect()
  }

  getEvents () {
    const events = this.batchedEvents

    if (this.useGamepad) {
      this.listenGamepadEvents()
    }

    if (events.length === 0) {
      return null
    }

    this.batchedEvents = []
    return events
  }

  listenGamepadEvents () {
    const now = Date.now()
    const gamepads = getGamepads()

    for (let i = 0; i < gamepads.length; i += 1) {
      if (gamepads[i]) {
        if (!this.prevGamepadState[i]) {
          this.prevGamepadState[i] = []
        }

        const buttons = gamepads[i].buttons

        for (let j = 0; j < buttons.length; j += 1) {
          const btnState = this.prevGamepadState[i][j]

          if (!btnState) {
            this.prevGamepadState[i][j] = {
              pressed: false,
              startTime: -1
            }
          }

          if (this.prevGamepadState[i][j].pressed !== isPressed(buttons[j])) {
            if (isPressed(buttons[j])) {
              this.prevGamepadState[i][j].pressed = true
              this.prevGamepadState[i][j].startTime = now

              this.batchedEvents.push({
                type: 'GamepadEvent',
                eventType: 'keydown',
                button: buttons[j],
                gamepad: i
              })
            } else {
              this.prevGamepadState[i][j].pressed = false
            }
          }
        }
      }
    }
  }

  connect () {
    this.target.addEventListener('click', this.handleClick, true)
    this.target.addEventListener('keydown', this.handleKeyDown, true)

    window.addEventListener('gamepadconnected', this.handleGamepadConnected)
    window.addEventListener(
      'gamepaddisconnected',
      this.handleGamepadDisconnect
    )
  }

  disconnect () {
    this.target.removeEventListener('click', this.handleClick, true)
    this.target.removeEventListener('keydown', this.handleKeyDown, true)

    window.removeEventListener('gamepadconnected', this.handleGamepadConnected)
    window.removeEventListener(
      'gamepaddisconnected',
      this.handleGamepadDisconnect
    )

    this.enabled = false
  }

  handleClick = (event) => {
    this.batchedEvents.push(event)
  };

  handleKeyDown = (event) => {
    if (event.keyCode === SPACE_KEY_CODE) {
      this.batchedEvents.push(event)
    }
  };

  handleGamepadConnected = () => {
    this.useGamepad = true
  };

  handleGamepadDisconnect = () => {
    this.useGamepad = false
  };
}
