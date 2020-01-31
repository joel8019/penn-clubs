import { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import s from 'styled-components'

import Shade from './Shade'
import { Icon } from './Icon'
import { LIGHT_GRAY } from '../../constants/colors'
import {
  BORDER_RADIUS_LG,
  MD,
  SM,
  mediaMaxWidth,
  LONG_ANIMATION_DURATION,
} from '../../constants/measurements'
import { fadeIn, fadeOut } from '../../constants/animations'

const ModalWrapper = s.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1002;
  text-align: center;
  animation-name: ${({ show }) => (show ? fadeIn : fadeOut)};
  animation-duration: ${LONG_ANIMATION_DURATION};
`

const ModalCard = s.div`
  border-radius: ${BORDER_RADIUS_LG};
  border: 0 !important;
  box-shadow: none !important;
  height: auto;
  width: 35%;

  ${mediaMaxWidth(MD)} {
    width: 50%;
  }

  ${mediaMaxWidth(SM)} {
    width: 90%;
  }
`

const ModalContent = s.div`
  margin: auto;
  margin-bottom: 10%;
`

const CloseModalIcon = s(Icon)`
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
  color: ${LIGHT_GRAY};
`

// Do not propagate events on the modal content to the modal background
// This would otherwise cause the modal to close on any click
const noop = event => event.stopPropagation()

export const Modal = ({ show, children, closeModal }) => {
  const focusRef = useRef()

  const handleKeyPress = ({ key, keyCode }) => {
    const ESCAPE_KEY_CODE = 27
    if (
      (keyCode === ESCAPE_KEY_CODE || key.toLowerCase() === 'escape') &&
      show
    ) {
      closeModal()
    }
  }

  useEffect(() => {
    if (show && focusRef.current) {
      focusRef.current.focus()
    }
  }, [show])

  return (
    <ModalWrapper
      ref={focusRef}
      className={show ? 'modal is-active' : 'modal'}
      id="modal"
      onKeyPress={handleKeyPress}
      onKeyDown={handleKeyPress}
      tabIndex="0"
      show={show}
    >
      <Shade className="modal-background" onClick={closeModal} show={show} />
      <ModalCard className="card" onClick={noop} show={show}>
        <CloseModalIcon
          show={show}
          name="x"
          alt="&#215;"
          onClick={closeModal}
        />
        <ModalContent>{children}</ModalContent>
      </ModalCard>
    </ModalWrapper>
  )
}

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.any.isRequired,
}

export default Modal
