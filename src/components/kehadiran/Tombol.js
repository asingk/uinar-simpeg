import React, { useState, useContext, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import axios from 'axios'
import {
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CLoadingButton,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
} from '@coreui/react-pro'
import { KeycloakContext } from 'src/context'
import { cilCheckCircle } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const Tombol = (props) => {
  const [processing, setProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [kehadiranInfo, setKehadiranInfo] = useState({
    checked: false,
    hasAbsen: false,
    jam: '',
  })
  const [toast, addToast] = useState()
  const toaster = useRef(null)

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username
  const pegawaiId = props.pegawai?.id || loginId

  const getLocalDateString = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getJamAbsen = (data) => {
    if (data?.jam) return data.jam
    if (typeof data?.waktu === 'string') return data.waktu.slice(11, 16)
    return ''
  }

  const getStatusLabel = () => {
    if (props.status === 'PULANG') return 'pulang'
    if (props.status === 'DATANG') return 'datang'
    return props.status ? props.status.toLowerCase() : ''
  }

  useEffect(() => {
    const fetchKehadiranInfo = async () => {
      if (!keycloak.token || !pegawaiId || !props.status) return

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SIMPEG_REST_URL}/pegawai/${pegawaiId}/kehadiran/search`,
          {
            params: {
              tanggal: getLocalDateString(),
              status: props.status,
            },
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          },
        )
        const jam = getJamAbsen(response.data)
        setKehadiranInfo({
          checked: true,
          hasAbsen: !!response.data?.id,
          jam,
        })
      } catch (error) {
        if (error?.response?.status === 404) {
          setKehadiranInfo({
            checked: true,
            hasAbsen: false,
            jam: '',
          })
          return
        }
        setKehadiranInfo({
          checked: false,
          hasAbsen: false,
          jam: '',
        })
      }
    }

    fetchKehadiranInfo()
  }, [keycloak.token, pegawaiId, props.status])

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

    const successToast = (
      <CToast color="success" className="text-white align-items-center">
        <div className="d-flex">
          <CToastBody>
            <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" />
            Kehadiran Anda sudah terekam
          </CToastBody>
          <CToastClose className="me-2 m-auto" white />
        </div>
      </CToast>
    )

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
      <CCard className="text-center kehadiran-card">
        <CCardHeader className="kehadiran-card__header">Kehadiran</CCardHeader>
        <CCardBody>
          <CLoadingButton
            color="success"
            loading={processing}
            onClick={absenHandler}
            disabled={processing}
            className="kehadiran-card__button"
          >
            {props.status}
          </CLoadingButton>
          {(props.status === 'DATANG' || props.status === 'PULANG') &&
            (props.infoText || kehadiranInfo.checked) && (
              <CCardText className="mt-2">
                {kehadiranInfo.checked
                  ? kehadiranInfo.hasAbsen
                    ? kehadiranInfo.jam
                      ? `Anda sudah absen ${getStatusLabel()} pada pukul ${kehadiranInfo.jam}`
                      : `Anda sudah absen ${getStatusLabel()}`
                    : `Anda belum absen ${getStatusLabel()}`
                  : props.infoText}
              </CCardText>
            )}
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
  infoText: PropTypes.string,
}

export default Tombol
