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

const RincianSelisihRemun = () => {
  console.debug('rendering... RincianSelisihRemun')

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
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/selisih-remun-pegawai/${id}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then(function (response) {
        setData(response.data)
      })
      .catch(function (error) {
        if (error.response) {
          setError(error.response.data)
        } else {
          setError({ message: 'Terjadi kesalahan koneksi' })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id, keycloak.token])

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })

  let content

  if (loading) {
    content = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    content = (
      <CAlert color="warning" className="d-flex align-items-center">
        <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>{error.message || 'Gagal memuat detail'}</div>
      </CAlert>
    )
  } else {
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
          <CTableDataCell className="text-end">
            {isCurrency ? formatter.format(value || 0) : value || 0}
          </CTableDataCell>
        </CTableRow>
      )
    }

    const infoPegawai = (
      <CCard className="mb-4 shadow-sm border-top-info border-top-3">
        <CCardBody>
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <small className="text-muted d-block">Nama Lengkap</small>
                <span className="fw-bold fs-5">{data?.nama}</span>
              </div>
            </CCol>
            <CCol md={3}>
              <div className="mb-3">
                <small className="text-muted d-block">NIP</small>
                <span className="fw-semibold">{data?.nip}</span>
              </div>
            </CCol>
            <CCol md={3}>
              <div className="mb-3">
                <small className="text-muted d-block">Periode Selisih</small>
                <span className="fw-semibold text-primary">{data?.periode}</span>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    )

    const renderRincianSelisih = () => {
      const rows = []
      const jenis = data?.jenisJabatan

      // Logika P2 berdasarkan jenis jabatan
      if (jenis === 'JF') {
        rows.push(
          renderRow(
            'Selisih Pembayaran Progress',
            data?.pembayaranKelebihanKekuranganProgress,
            true,
            '',
            'p2-progress',
          ),
        )
      } else if (jenis === 'Pelaksana') {
        rows.push(
          renderRow(
            'Selisih Pembayaran LKH',
            data?.pembayaranKelebihanKekuranganLkh,
            true,
            '',
            'p2-lkh',
          ),
        )
      } else if (jenis === 'Manajerial') {
        rows.push(
          renderRow(
            'Selisih Pembayaran IKU',
            data?.pembayaranKelebihanKekuranganIku,
            true,
            '',
            'p2-iku',
          ),
        )
      } else if (jenis === 'DT') {
        rows.push(
          renderRow(
            'Selisih Pembayaran IKU',
            data?.pembayaranKelebihanKekuranganIku,
            true,
            '',
            'p2-iku-dt',
          ),
        )
        if (data?.penguranganBkdDt) {
          rows.push(renderRow('Pengurangan BKD DT', data?.penguranganBkdDt, true, '', 'p2-bkd-dt'))
        }
      } else if (jenis === 'DS') {
        rows.push(renderRow('Pembayaran BKR', data?.pembayaranBkr, true, '', 'p2-bkr'))
        rows.push(renderRow('Pembayaran BKD DS', data?.pembayaranBkdDs, true, '', 'p2-bkd-ds'))
      }

      return rows
    }

    content = (
      <>
        {infoPegawai}
        <CTable responsive bordered hover className="shadow-sm">
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell>Keterangan Rincian Selisih</CTableHeaderCell>
              <CTableHeaderCell className="text-end">Jumlah</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {/* Baris Volume dinaikkan ke atas Komponen P2 */}
            {renderRow('Volume (Jumlah Bulan)', data?.volume, false, 'bg-light-info', 'volume-row')}

            <CTableRow className="bg-light">
              <CTableHeaderCell colSpan={2} className="text-uppercase small fw-bold text-info">
                Komponen P2
              </CTableHeaderCell>
            </CTableRow>
            {renderRincianSelisih()}

            {/* Total Bruto */}
            <CTableRow className="bg-light fw-bold border-top">
              <CTableDataCell>Total Bruto Selisih</CTableDataCell>
              <CTableDataCell className="text-end">{formatter.format(data?.bruto)}</CTableDataCell>
            </CTableRow>

            {/* Pajak */}
            <CTableRow>
              <CTableDataCell>PPh Rupiah ({data?.pphPersen || 0}%)</CTableDataCell>
              <CTableDataCell className={`text-end ${data?.pphRupiah > 0 ? 'text-danger' : ''}`}>
                {formatter.format(data?.pphRupiah || 0)}
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
          <CTableHead>
            <CTableRow color="primary">
              <CTableHeaderCell className="text-center">TOTAL NETTO SELISIH</CTableHeaderCell>
              <CTableHeaderCell className="text-end">
                {formatter.format(data?.netto)}
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
        </CTable>
      </>
    )
  }

  return (
    <>
      <h1 className="display-6 text-center">
        Rincian Selisih Remunerasi {namaBulan(data?.bulan)} {data?.tahun}
      </h1>
      <CButton className="mb-3" color="secondary" onClick={() => navigate('/keuangan/remun')}>
        <CIcon icon={cilArrowThickLeft} />
      </CButton>
      {content}
      {data?.createdDate && (
        <div className="text-center mt-3 text-muted">
          <small>
            Diunggah oleh {data.createdBy} pada {dayjs(data.createdDate).format('DD/MM/YYYY HH:mm')}
          </small>
        </div>
      )}
      <p className="text-center mt-2">
        Jika terdapat perbedaan data, silahkan hubungi bagian keuangan.
      </p>
    </>
  )
}

export default RincianSelisihRemun
