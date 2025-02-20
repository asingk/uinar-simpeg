import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import {
  CAlert,
  CButton,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilArrowThickLeft, cilWarning } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { KeycloakContext } from 'src/context'
import { namaBulan } from 'src/utils'
import dayjs from 'dayjs'

const RincianUangMakan = () => {
  console.debug('rendering... RincianUangMakan')

  const [dataUangMakan, setDataUangMakan] = useState()
  const [errorUangMakan, setErrorUangmakan] = useState('')
  const [loading, setLoading] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()
  const keycloak = useContext(KeycloakContext)

  useEffect(() => {
    setLoading(true)
    setErrorUangmakan('')
    axios
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/uang-makan-pegawai/${id}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then(function (response) {
        // handle success
        setDataUangMakan(response.data)
      })
      .catch(function (error) {
        // handle error
        // console.log(error)
        if (error.response) {
          // console.log(error.response.data)
          setErrorUangmakan(error.response.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  // Create our number formatter.
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  })

  let uangMakan
  if (loading) {
    uangMakan = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (errorUangMakan) {
    uangMakan = (
      <CAlert color="warning" className="d-flex align-items-center">
        <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>{errorUangMakan.message}</div>
      </CAlert>
    )
  } else {
    uangMakan = (
      <CTable responsive hover>
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell>Keterangan</CTableHeaderCell>
            <CTableHeaderCell>Total</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow color="success">
            <CTableDataCell>
              {dataUangMakan?.jumlahHari} hari x {formatter.format(dataUangMakan?.rupiahHarian)}
            </CTableDataCell>
            <CTableDataCell>{formatter.format(dataUangMakan?.rupiahBulanan)}</CTableDataCell>
          </CTableRow>
          <CTableRow color="danger">
            <CTableDataCell>Pajak {dataUangMakan?.persenPajak}%</CTableDataCell>
            <CTableDataCell>{formatter.format(dataUangMakan?.rupiahPajakBulanan)}</CTableDataCell>
          </CTableRow>
        </CTableBody>
        <CTableHead>
          <CTableRow color="primary">
            <CTableHeaderCell scope="row" className="text-center">
              Total
            </CTableHeaderCell>
            <CTableHeaderCell>{formatter.format(dataUangMakan?.thp)}</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
      </CTable>
    )
  }
  return (
    <>
      <h1 className="display-6 text-center">
        Uang Makan {namaBulan(dataUangMakan?.bulan)} {dataUangMakan?.tahun}
      </h1>
      <CButton className="mb-3" color="secondary" onClick={() => navigate('/keuangan/uang-makan')}>
        <CIcon icon={cilArrowThickLeft} />
      </CButton>
      {uangMakan}
      {dataUangMakan?.createdDate && (
        <div className="text-center mt-3">
          <p>Direkap pada {dayjs(dataUangMakan.createdDate).format('D/M/YYYY')}</p>
        </div>
      )}
    </>
  )
}

export default RincianUangMakan
