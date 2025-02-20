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

const RincianRemunP1 = () => {
  console.debug('rendering... RincianRemunP1')

  const [data, setData] = useState()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()
  const keycloak = useContext(KeycloakContext)

  useEffect(() => {
    setLoading(true)
    setError('')
    axios
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/remun-pegawai/${id}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then(function (response) {
        // handle success
        setData(response.data)
      })
      .catch(function (error) {
        // handle error
        // console.log(error)
        if (error.response) {
          // console.log(error.response.data)
          setError(error.response.data)
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

  let remun

  if (loading) {
    remun = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    remun = (
      <CAlert color="warning" className="d-flex align-items-center">
        <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>{error.message}</div>
      </CAlert>
    )
  } else {
    remun = (
      <CTable responsive>
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell>Keterangan</CTableHeaderCell>
            <CTableHeaderCell>Total</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow>
            <CTableDataCell>Grade {data?.grade}</CTableDataCell>
            <CTableDataCell>{formatter.format(data?.remunGrade)}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>Implementasi {data?.implementasiRemunPersen}%</CTableDataCell>
            <CTableDataCell>{formatter.format(data?.implementasiRemun)}</CTableDataCell>
          </CTableRow>
          <CTableRow color="success">
            <CTableDataCell>Remun P1 (30%)</CTableDataCell>
            <CTableDataCell>{formatter.format(data?.remunP1)}</CTableDataCell>
          </CTableRow>
          <CTableRow color="danger">
            <CTableDataCell>Potongan Indisipliner {data?.persenPotongan}%</CTableDataCell>
            <CTableDataCell>{formatter.format(data?.rupiahPotongan)}</CTableDataCell>
          </CTableRow>
          <CTableRow color="info">
            <CTableDataCell className="text-center">Subtotal</CTableDataCell>
            <CTableDataCell>{formatter.format(data?.setelahPotongan)}</CTableDataCell>
          </CTableRow>
          <CTableRow color="danger">
            <CTableDataCell>Pajak {data?.persenPajak}%</CTableDataCell>
            <CTableDataCell>{formatter.format(data?.rupiahPajak)}</CTableDataCell>
          </CTableRow>
        </CTableBody>
        <CTableHead>
          <CTableRow color="primary">
            <CTableHeaderCell className="text-center">Total</CTableHeaderCell>
            <CTableHeaderCell>{formatter.format(data?.netto)}</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
      </CTable>
    )
  }
  return (
    <>
      <h1 className="display-6 text-center">
        Remun {namaBulan(data?.bulan)} {data?.tahun}
      </h1>
      <CButton className="mb-3" color="secondary" onClick={() => navigate('/keuangan/remun-p1')}>
        <CIcon icon={cilArrowThickLeft} />
      </CButton>
      {remun}
      {data?.createdDate && (
        <div className="text-center mt-3">
          <p>Direkap pada {dayjs(data.createdDate).format('D/M/YYYY')}</p>
        </div>
      )}
      <p>
        Note:{' '}
        <a
          href={import.meta.env.VITE_CDN_URL + '/simpeg/KR-implementasi-remun.pdf'}
          target="_blank"
          rel="noreferrer"
        >
          KR Implementasi Remun
        </a>
      </p>
    </>
  )
}

export default RincianRemunP1
