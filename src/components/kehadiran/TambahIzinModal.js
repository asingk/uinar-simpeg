import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import dayjs from 'dayjs'
import {
  CAlert,
  CButton,
  CDatePicker,
  CDateRangePicker,
  CForm,
  CFormInput,
  CFormSelect,
  CFormSwitch,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import { KeycloakContext } from 'src/context'

const TambahIzinModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [jenisCuti, setJenisCuti] = useState([])
  const [selectedJenisCutiId, setSelectedJenisCutiId] = useState('')
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [file, setFile] = useState()
  const [validated, setValidated] = useState(false)
  const [banyakHari, setBanyakHari] = useState(false)

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/kategori-izin`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then((response) => {
        let jenis = [{ label: '-- Pilih Jenis Cuti/DL --', value: '' }]
        response.data.kategoriIzin.forEach((row) => {
          jenis.push({ label: row.desc, value: row.id })
        })
        setJenisCuti(jenis)
      })
      .catch((error) => {
        setError(error)
      })
      .then(() => {
        setLoading(false)
      })
  }, [])

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  let modalBody = (
    <>
      <CFormSelect
        aria-label="Default pilih jenis cuti/DL"
        options={jenisCuti}
        onChange={(e) => setSelectedJenisCutiId(e.target.value)}
        required
        feedbackInvalid="Jenis cuti wajib dipiih"
      />
      <div className="mt-3">
        <CFormSwitch
          reverse
          label="Lebih 1 hari?"
          id="formSwitchCheckDefault"
          onChange={() => setBanyakHari(!banyakHari)}
        />
      </div>
      {!banyakHari ? (
        <CDatePicker
          label="Tanggal"
          locale="id-ID"
          onDateChange={(date) => setStartDate(date)}
          required
          feedbackInvalid="Tanggal wajib dipilih"
          portal={false}
        />
      ) : (
        <CDateRangePicker
          label="Tanggal"
          locale="id-ID"
          onStartDateChange={(date) => setStartDate(date)}
          onEndDateChange={(date) => setEndDate(date)}
          required
          feedbackInvalid="Tanggal wajib dipilih"
          portal={false}
        />
      )}

      <div className="mt-3">
        <CFormInput
          type="file"
          id="formFile"
          label="File"
          accept=".pdf"
          text="File max 1 MB"
          onChange={handleFileChange}
          required
          feedbackInvalid="File wajib dipilih"
        />
      </div>
      {errorMessage && <CAlert color="danger">errorMessage</CAlert>}
    </>
  )

  if (error) {
    // console.debug(errorMessage)
    modalBody = <CAlert color="danger">{errorMessage}</CAlert>
  }

  async function tambahAction(event) {
    // const form = event.currentTarget
    // if (form.checkValidity() === false) {
    event.preventDefault()
    event.stopPropagation()
    // }
    setValidated(true)
    if (!selectedJenisCutiId || !startDate || !file) return
    if (banyakHari && !endDate) return
    if (file.size > 1048576) setErrorMessage('File lebih dari 1 MB')
    try {
      setLoading(true)
      await axios.post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/pegawai/${loginId}/usul-izin`,
        {
          izinCategoryId: selectedJenisCutiId,
          startDate: dayjs(startDate).format('YYYY-MM-DD'),
          endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : '',
          file: file,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      setLoading(false)
      setSelectedJenisCutiId('')
      setStartDate()
      setFile()
      props.done()
    } catch (error) {
      if (error.response) {
        console.log(error)
        // The client was given an error response (5xx, 4xx)
        setLoading(false)
        // setErrorResp(true)
        setErrorMessage(error.response.data.message)
      } else if (error.request) {
        console.log(error.request)
        // The client never received a response, and the request was never left
        setLoading(false)
        setError(true)
      } else {
        console.log(error)
        // Anything else
        setLoading(false)
        setError(true)
      }
    }
  }

  const onBatal = () => {
    setError(false)
    setErrorMessage('')
    props.setVisible(false)
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Tambah Cuti/DL</CModalTitle>
      </CModalHeader>
      <CForm
        className="row g-3 needs-validation"
        noValidate
        validated={validated}
        onSubmit={tambahAction}
      >
        <CModalBody>{modalBody}</CModalBody>
        <CModalFooter>
          <CButton disabled={loading} color="secondary" onClick={onBatal}>
            Batal
          </CButton>
          <CLoadingButton type="submit" loading={loading} color="primary">
            Submit
          </CLoadingButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

TambahIzinModal.propTypes = {
  done: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
}

export default TambahIzinModal
