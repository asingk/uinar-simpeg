import React, { useContext, useEffect, useState } from 'react'
import {
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
} from '@coreui/react-pro'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilBug } from '@coreui/icons'
import { useParams } from 'react-router-dom'
import { KeycloakContext } from 'src/context'

const RincianPotonganGaji = () => {
  console.debug('rendering... RincianPotonganGaji')

  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const keycloak = useContext(KeycloakContext)

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/potongan-gaji-pegawai/${id}`, {
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
        setError('Ooopsss... terjadi kesalahan!')
        if (error.response) {
          setError(error.response.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id, keycloak.token])

  // Create our number formatter.
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  })

  const getBulanName = (bulan) => {
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ]
    return months[bulan - 1] || bulan
  }

  const columns = [
    {
      key: 'nama',
      label: 'Nama Potongan',
      _props: { scope: 'col' },
    },
    {
      key: 'nilai',
      label: 'Nilai',
      _props: { scope: 'col' },
    },
  ]

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
      <CAlert color="danger" className="d-flex align-items-center">
        <CIcon icon={cilBug} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>{error}</div>
      </CAlert>
    )
  } else if (data) {
    // Filter potongan yang nilainya lebih besar dari 0
    const potonganItems = data.potongan
      .filter((pot) => pot.nilai > 0)
      .map((pot) => ({
        nama: pot.nama,
        nilai: formatter.format(pot.nilai),
        _cellProps: { id: { scope: 'row' } },
      }))

    // Jika tidak ada potongan dengan nilai > 0
    if (potonganItems.length === 0) {
      potonganItems.push({
        nama: 'Tidak ada potongan',
        _cellProps: { id: { scope: 'row' }, nama: { colSpan: 2 } },
      })
    }

    content = (
      <>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Informasi Pegawai</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md="3">
                <strong>NIP:</strong>
              </CCol>
              <CCol md="9">{data.nip}</CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="3">
                <strong>Nama:</strong>
              </CCol>
              <CCol md="9">{data.nama}</CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="3">
                <strong>Periode:</strong>
              </CCol>
              <CCol md="9">
                {getBulanName(data.bulan)} {data.tahun}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="3">
                <strong>Unit Gaji:</strong>
              </CCol>
              <CCol md="9">{data.unitGajiNama}</CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardHeader>
            <strong>Ringkasan Gaji</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md="4">
                <strong>Gaji Bersih:</strong>
              </CCol>
              <CCol md="8">{formatter.format(data.gajiBersih)}</CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="4">
                <strong>Total Potongan:</strong>
              </CCol>
              <CCol md="8" className="text-danger">
                {formatter.format(data.jumlahPotongan)}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="4">
                <strong>Gaji yang Diterima:</strong>
              </CCol>
              <CCol md="8">
                <strong className="text-success">{formatter.format(data.thp)}</strong>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardHeader>
            <strong>Rincian Potongan</strong>
          </CCardHeader>
          <CCardBody>
            <CTable responsive striped columns={columns} items={potonganItems} />
          </CCardBody>
        </CCard>

        {data.createdBy && (
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Informasi Dokumen</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md="3">
                  <strong>Diunggah oleh:</strong>
                </CCol>
                <CCol md="9">{data.createdBy}</CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md="3">
                  <strong>Tanggal diunggah:</strong>
                </CCol>
                <CCol md="9">
                  {new Date(data.createdDate).toLocaleString('id-ID', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        )}
      </>
    )
  }

  return (
    <>
      <h1 className="text-center mb-4">Rincian Potongan Gaji</h1>
      {content}
    </>
  )
}

export default RincianPotonganGaji
