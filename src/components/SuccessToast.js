import React from 'react'
import { CToast, CToastBody, CToastClose } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle } from '@coreui/icons'
import PropTypes from 'prop-types'

const SuccessToast = ({ message }) => {
  return (
    <CToast visible={true} color="success" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>
          <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" />
          {message}
        </CToastBody>
        <CToastClose className="me-2 m-auto" />
      </div>
    </CToast>
  )
}

SuccessToast.propTypes = {
  message: PropTypes.string.isRequired,
}

export default SuccessToast
