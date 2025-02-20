import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CAlert,
  CButton,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import axios from 'axios'
import { KeycloakContext } from 'src/context'

const BatalkanIzinModal = (props) => {
  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const onAction = () => {
    setLoading(true)
    axios
      .put(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/usul-izin/${props.id}`,
        {
          status: 3,
          updatedBy: loginId,
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      .then(function () {
        // console.log(response)
        props.done()
      })
      .catch(function (error) {
        // console.log(error)
        setError(error)
      })
      .finally(function () {
        setLoading(false)
      })
  }

  let modalBody = <p>Anda Yakin?</p>

  if (error) {
    modalBody = <CAlert color="danger">Terjadi Kesalahan! Coba lagi?</CAlert>
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Batalkan Cuti/DL</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton disabled={loading} color="danger" onClick={() => props.setVisible(false)}>
          Tidak
        </CButton>
        <CLoadingButton
          loading={loading}
          color="danger"
          variant="outline"
          onClick={() => onAction()}
        >
          Ya
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

BatalkanIzinModal.propTypes = {
  id: PropTypes.string,
  deleted: PropTypes.func,
  done: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
}

export default BatalkanIzinModal
