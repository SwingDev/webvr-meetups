import * as webvrui from 'webvr-ui'

import IconExpand from 'images/icon-expand.svg'

const VR_BUTTON_OPTIONS = {
  color: '#ffffff'
}

const getFullscreenButton = () => {
  const button = document.createElement('button')
  const image = document.createElement('img')

  image.classList.add('button__icon')
  image.src = IconExpand

  button.classList.add('button')
  button.appendChild(image)

  return button
}

export default function (renderer) {
  const enterVrButton = new webvrui.EnterVRButton(
    renderer.domElement,
    VR_BUTTON_OPTIONS
  )

  const fullscreenButton = getFullscreenButton()

  fullscreenButton.addEventListener(
    'click',
    () => enterVrButton.requestEnterFullscreen()
  )

  document.body.appendChild(enterVrButton.domElement)
  document.body.appendChild(fullscreenButton)
}
