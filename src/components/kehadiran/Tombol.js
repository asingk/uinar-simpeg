import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'

import axios from 'axios'
import dayjs from 'dayjs'
import {
  CAlert,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardText,
  CCardTitle,
  CLoadingButton,
} from '@coreui/react-pro'
import { KeycloakContext } from 'src/context'

const Tombol = (props) => {
  const [processing, setProcessing] = useState(false)
  const [disable, setDisable] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [time, setTime] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

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
        import.meta.env.VITE_KEHADIRAN_API_URL + '/kehadiran',
        {
          idPegawai: loginId,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            apikey: import.meta.env.VITE_API_KEY,
          },
        },
      )
      .then((response) => {
        if (response.data.status === 'DATANG') {
          setDisable(true)
        }
        setRecorded(true)
        setTime(response.data['waktu'])
        localStorage.setItem('absenId', props.pegawai.id)
        localStorage.setItem('absenNama', props.pegawai.nama)
        props.clicked()
      })
      .catch((error) => {
        // console.log(error)
        setErrorMessage(error?.response?.data?.message)
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  useEffect(() => {
    const todayDateString = dayjs(new Date()).format('YYYY-MM-DD')

    // jika status DATANG, mengecek apakah user sudah absen?
    if (props.status === 'DATANG' || props.status === 'PULANG') {
      axios
        .get(
          import.meta.env.VITE_KEHADIRAN_API_URL +
            '/kehadiran/search?idPegawai=' +
            loginId +
            '&status=' +
            props.status +
            '&tanggal=' +
            todayDateString,
        )
        .then(function (response) {
          // handle success
          if (response.data['status'] === 'DATANG') {
            setDisable(true)
          }
          setRecorded(true)
          setTime(response.data['waktu'])
        })
        .catch(function (error) {
          // handle error
          // console.log(error)
          if (error.response) {
            // console.log(error.response.data)
            // setErrorMessage(error.response.data)
          }
        })
    } else if (props.status) {
      setDisable(true)
    }
  }, [loginId, props.status])

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
            disabled={disable || processing}
          >
            {props.status}
          </CLoadingButton>
        </CCardBody>
        {recorded && (
          <CCardFooter className="text-medium-emphasis">{`Anda ${
            props.status
          } pukul ${time.substring(11, 16)}`}</CCardFooter>
        )}
      </CCard>
      {errorMessage && (
        <CAlert className="mt-2" color="danger">
          Error: {errorMessage}
        </CAlert>
      )}
    </>
  )
  // }
}

Tombol.propTypes = {
  clicked: PropTypes.func,
  status: PropTypes.string,
  pegawai: PropTypes.object,
}

export default Tombol
