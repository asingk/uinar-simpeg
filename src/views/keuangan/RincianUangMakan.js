import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CAlert,
  CButton,
  CCol,
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
import dayjs from 'dayjs'

const RincianUangMakan = () => {
  console.debug('rendering... RincianUangMakan')

  const [dataUangMakan, setDataUangMakan] = useState()
  const [errorUangMakan, setErrorUangmakan] = useState('')
  const [rekapData, setRekapData] = useState()
  const [riwayatProfil, setRiwayatProfil] = useState([])

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setErrorUangmakan('')
    axios
      .get(import.meta.env.VITE_KEHADIRAN_API_URL + '/rekap/uang-makan-pegawai/' + id)
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
  }, [id])

  useEffect(() => {
    if (dataUangMakan) {
      axios
        .get(
          import.meta.env.VITE_KEHADIRAN_API_URL +
            '/pegawai/' +
            dataUangMakan?.nip +
            '/riwayat-profil',
          {
            params: {
              tahun: dataUangMakan?.tahun,
              bulan: dataUangMakan?.bulan,
            },
          },
        )
        .then(function (response) {
          // handle success
          setRiwayatProfil(response.data)
        })
        .catch(function (error) {
          // handle error
          // console.log(error)
          if (error.response) {
            console.log(error.response.data)
            // setErrorUangmakan(error.response.data)
          }
        })
    }
  }, [dataUangMakan])

  useEffect(() => {
    if (dataUangMakan && riwayatProfil.length > 0) {
      axios
        .get(import.meta.env.VITE_KEHADIRAN_API_URL + '/rekap/uang-makan', {
          params: {
            tahun: dataUangMakan?.tahun,
            bulan: dataUangMakan?.bulan,
            unitGajiId: riwayatProfil[0].unitGaji,
          },
        })
        .then(function (response) {
          // handle success
          setRekapData(response.data)
        })
        .catch(function (error) {
          // handle error
          // console.log(error)
          if (error.response) {
            console.log(error.response.data)
            // setErrorUangmakan(error.response.data)
          }
        })
    }
  }, [dataUangMakan, riwayatProfil])

  // Create our number formatter.
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  })

  let uangMakan

  if (errorUangMakan) {
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
        Uang Makan Bulan {dataUangMakan?.bulan} {dataUangMakan?.tahun}
      </h1>
      <CButton className="mb-3" color="secondary" onClick={() => navigate('/keuangan/uang-makan')}>
        <CIcon icon={cilArrowThickLeft} />
      </CButton>
      {uangMakan}
      <CCol className="text-center mt-3">
        <p>
          Direkap pada {dayjs(rekapData?.lastModifiedDate).format('D/M/YYYY')} oleh{' '}
          {rekapData?.lastModifiedBy}
        </p>
      </CCol>
    </>
  )
}

export default RincianUangMakan
