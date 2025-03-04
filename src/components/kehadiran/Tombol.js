import React, { useState, useContext, useRef } from 'react'
import PropTypes from 'prop-types'

import axios from 'axios'
import {
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardTitle,
  CLoadingButton,
  CToaster,
} from '@coreui/react-pro'
import { KeycloakContext } from 'src/context'
import SuccessToast from 'src/components/SuccessToast'

const successToast = <SuccessToast message={'Kehadiran Anda sudah terekam'} />

const Tombol = (props) => {
  const [processing, setProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [toast, addToast] = useState()
  const toaster = useRef(null)

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  const absenHandler = async () => {
    if (localStorage.getItem('absenId') && localStorage.getItem('absenId') !== loginId) {
      setErrorMessage(
        'Browser ini sudah digunakan absen oleh ' +
          localStorage.getItem('absenNama') +
          ' (' +
          localStorage.getItem('absenId') +
          '), silahkan menggunakan browser lain.',
      )
      return
    }
    setErrorMessage('')
    setProcessing(true)

    await axios
      .post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/kehadiran`,
        {
          idPegawai: loginId,
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      .then(() => {
        addToast(successToast)
        localStorage.setItem('absenId', props.pegawai.id)
        localStorage.setItem('absenNama', props.pegawai.nama)
        props.clicked()
      })
      .catch((error) => {
        setErrorMessage(error?.response?.data?.message)
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  return (
    <>
      <CCard className="text-center">
        <CCardHeader>Kehadiran</CCardHeader>
        <CCardBody>
          <CCardTitle>{props.pegawai?.nama}</CCardTitle>
          <CCardText>{loginId}</CCardText>
          <CLoadingButton
            color="success"
            loading={processing}
            onClick={absenHandler}
            disabled={processing}
          >
            {props.status}
          </CLoadingButton>
        </CCardBody>
      </CCard>
      {errorMessage && (
        <CAlert className="mt-2" color="danger">
          Error: {errorMessage}
        </CAlert>
      )}
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
    </>
  )
}

Tombol.propTypes = {
  clicked: PropTypes.func,
  status: PropTypes.string,
  pegawai: PropTypes.object,
}

export default Tombol
