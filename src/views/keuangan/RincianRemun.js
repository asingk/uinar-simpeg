import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
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

const RincianRemun = () => {
  console.debug('rendering... RincianRemun')

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
    // Helper function untuk merender baris (menambahkan parameter key)
    const renderRow = (label, value, isCurrency = true, customClass = '', key, subLabel = '') => {
      return (
        <CTableRow className={customClass} key={key || label}>
          <CTableDataCell>
            <div>{label}</div>
            {subLabel && (
              <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                {subLabel}
              </small>
            )}
          </CTableDataCell>
          <CTableDataCell>{isCurrency ? formatter.format(value || 0) : value || 0}</CTableDataCell>
        </CTableRow>
      )
    }

    const infoPegawai = (
      <CCard className="mb-4 shadow-sm">
        <CCardBody>
          <CRow>
            <CCol md={5}>
              <div className="mb-3">
                <small className="text-muted d-block">Nama Lengkap</small>
                <span className="fw-bold fs-5">{data?.nama}</span>
              </div>
              <div className="mb-2">
                <small className="text-muted d-block">NIP</small>
                <span>{data?.nip}</span>
              </div>
            </CCol>
            <CCol md={7}>
              <CRow>
                <CCol sm={8}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Jabatan ({data?.kategoriAsn})</small>
                    <span className="fw-semibold">{data?.jabatan}</span>
                  </div>
                </CCol>
                <CCol sm={4}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Kelas Jabatan</small>
                    <span className="badge bg-info">{data?.kelasJabatan}</span>
                  </div>
                </CCol>
              </CRow>
              <CRow className="mt-2 pt-2 border-top">
                <CCol>
                  <small className="text-muted d-block text-uppercase small fw-bold">
                    Komponen P1
                  </small>
                  <span className="fw-bold text-success fs-5">{formatter.format(data?.p1)}</span>
                </CCol>
                <CCol>
                  <small className="text-muted d-block text-uppercase small fw-bold">
                    Komponen P2
                  </small>
                  <span className="fw-bold text-info fs-5">{formatter.format(data?.p2)}</span>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    )

    const renderRincianP1 = () => {
      return renderRow('Pembayaran P1', data?.p1, true, '', 'p1-row')
    }

    const renderRincianP2 = () => {
      const rows = []
      const jenis = data?.jenisJabatan

      if (jenis === 'JF') {
        rows.push(
          renderRow(
            'Pembayaran Progress',
            data?.pembayaranProgress,
            true,
            '',
            'p2-progress',
            'Dibayar 80% dari total 90% (Sisa 10% setelah laporan progress)',
          ),
        )
      } else if (jenis === 'Pelaksana') {
        rows.push(
          renderRow(
            'Pembayaran LKH',
            data?.pembayaranLkh,
            true,
            '',
            'p2-lkh',
            'Dibayar 80% dari total 90% (Sisa 10% setelah laporan LKH)',
          ),
        )
      } else if (jenis === 'Manajerial') {
        rows.push(
          renderRow(
            'Pembayaran IKU',
            data?.pembayaranIku,
            true,
            '',
            'p2-iku',
            'Dibayar 80% dari total 90% (Sisa 10% setelah laporan IKU)',
          ),
        )
      } else if (jenis === 'DT') {
        rows.push(
          renderRow(
            'Pembayaran IKU',
            data?.pembayaranIku,
            true,
            '',
            'p2-iku',
            'Dibayar 80% dari total 60% (Sisa dibayar setelah laporan IKU)',
          ),
        )
        rows.push(
          renderRow(
            'Pembayaran BKD',
            data?.pembayaranBkd,
            true,
            '',
            'p2-bkd',
            'Dibayar 30% (Penuh)',
          ),
        )
      } else if (jenis === 'DS') {
        rows.push(
          renderRow(
            'Pembayaran BKR',
            0,
            true,
            'text-muted',
            'p2-bkr',
            'Dibayar 0% (Menunggu laporan BKD)',
          ),
        )
        rows.push(
          renderRow(
            'Pembayaran BKD',
            0,
            true,
            'text-muted',
            'p2-bkd',
            'Dibayar 0% (Menunggu laporan BKD)',
          ),
        )
      }

      rows.push(
        renderRow('Pembayaran SKP', data?.pembayaranSkp, true, '', 'p2-skp', 'Dibayar 10% (Penuh)'),
      )

      return rows
    }

    const getP2Description = (jenis) => {
      switch (jenis) {
        case 'JF':
          return '(Progress 90% + SKP 10%)'
        case 'Pelaksana':
          return '(LKH 90% + SKP 10%)'
        case 'Manajerial':
          return '(IKU 90% + SKP 10%)'
        case 'DT':
          return '(IKU 60% + BKD 30% + SKP 10%)'
        case 'DS':
          return '(BKR 60% + BKD 30% + SKP 10%)'
        default:
          return ''
      }
    }

    remun = (
      <>
        {infoPegawai}
        <CTable responsive bordered hover className="shadow-sm">
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell>Keterangan Rincian</CTableHeaderCell>
              <CTableHeaderCell>Jumlah</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {/* Bagian P1 */}
            <CTableRow className="bg-light">
              <CTableHeaderCell colSpan={2} className="text-uppercase small fw-bold text-success">
                Komponen P1
              </CTableHeaderCell>
            </CTableRow>
            {renderRincianP1()}

            {/* Bagian P2 */}
            <CTableRow className="bg-light">
              <CTableHeaderCell colSpan={2} className="text-uppercase small fw-bold text-info">
                Komponen P2{' '}
                <span
                  className="text-muted ms-1 text-none fw-normal italic"
                  style={{ textTransform: 'none' }}
                >
                  {getP2Description(data?.jenisJabatan)}
                </span>
              </CTableHeaderCell>
            </CTableRow>
            {renderRincianP2()}

            {/* Total Bruto */}
            <CTableRow className="bg-light fw-bold">
              <CTableDataCell>Total Bruto (P1 + P2)</CTableDataCell>
              <CTableDataCell>{formatter.format(data?.bruto)}</CTableDataCell>
            </CTableRow>

            {/* Pajak */}
            <CTableRow>
              <CTableDataCell>PPh ({data?.pphPersen || 0}%)</CTableDataCell>
              <CTableDataCell className={data?.pphRupiah > 0 ? 'text-danger' : ''}>
                {formatter.format(data?.pphRupiah || 0)}
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
          <CTableHead>
            <CTableRow color="primary">
              <CTableHeaderCell className="text-center">NETTO (DITERIMA)</CTableHeaderCell>
              <CTableHeaderCell>{formatter.format(data?.netto)}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
        </CTable>
      </>
    )
  }
  return (
    <>
      <h1 className="display-6 text-center">
        Rincian Remunerasi {namaBulan(data?.bulan)} {data?.tahun}
      </h1>
      <CButton className="mb-3" color="secondary" onClick={() => navigate('/keuangan/remun')}>
        <CIcon icon={cilArrowThickLeft} />
      </CButton>
      {remun}
      {data?.createdDate && (
        <div className="text-center mt-3 text-muted">
          <small>
            Diunggah oleh {data.createdBy} pada {dayjs(data.createdDate).format('DD/MM/YYYY HH:mm')}
          </small>
        </div>
      )}
      <p className="text-center">Jika terdapat perbedaan data, silahkan hubungi bagian keuangan.</p>
    </>
  )
}

export default RincianRemun
