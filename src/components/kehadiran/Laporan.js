import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
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
import dayjs from 'dayjs'
import axios from 'axios'
import { KeycloakContext } from 'src/context'

const Laporan = (props) => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)
  const [riwayat, setRiwayat] = useState([])
  const [profilRiwayat, setProfilRiwayat] = useState()

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  useEffect(() => {
    setLoading(true)
    axios
      .get(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/pegawai/${loginId}/riwayat-kehadiran?bulan=${props.bulan}&tahun=${props.tahun}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      .then(function (response) {
        setRiwayat(response.data.riwayatKehadiran.reverse())
      })
      .catch(function (error) {
        setError(error)
      })
      .finally(function () {
        setLoading(false)
      })
    axios
      .get(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/pegawai/${loginId}/riwayat-profil?bulan=${props.bulan}&tahun=${props.tahun}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      .then(function (response) {
        // handle success
        // console.log(response)
        setProfilRiwayat(response.data.riwayatProfil[0])
      })
      .catch(function (error) {
        // handle error
        // console.log(error.message)
      })
  }, [props.bulan, props.tahun, loginId, props.refresh])

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    return (
      <CAlert show className="w-100" color="danger">
        Error: {error.message}
      </CAlert>
    )
  } else {
    let rows
    if (riwayat.length > 0) {
      rows = riwayat.map((item) => (
        <CTableRow key={item.tanggal}>
          <CTableHeaderCell scope="row">
            {dayjs(item.tanggal, 'YYYY-MM-DD').format('D/M/YYYY')}
          </CTableHeaderCell>
          <CTableDataCell>
            {item.keteranganDatang || (item.jamDatang ? item.jamDatang.substr(0, 5) : '-')}
          </CTableDataCell>
          {profilRiwayat?.jenisJabatan !== 'DS' && (
            <CTableDataCell className={item.telatDatang !== 0 ? 'text-danger' : 'text-success'}>
              {item.telatDatang}
            </CTableDataCell>
          )}
          <CTableDataCell>
            {item.keteranganPulang || (item.jamPulang ? item.jamPulang.substr(0, 5) : '-')}
          </CTableDataCell>
          {profilRiwayat?.jenisJabatan !== 'DS' && (
            <CTableDataCell className={item.cepatPulang !== 0 ? 'text-danger' : 'text-success'}>
              {item.cepatPulang}
            </CTableDataCell>
          )}
        </CTableRow>
      ))
    } else {
      rows = (
        <CTableRow>
          <CTableDataCell colSpan={profilRiwayat?.jenisJabatan !== 'DS' ? 5 : 3}>
            Tidak ada Data
          </CTableDataCell>
        </CTableRow>
      )
    }
    return (
      <>
        <CTable striped responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Tanggal</CTableHeaderCell>
              <CTableHeaderCell scope="col">Datang</CTableHeaderCell>
              {profilRiwayat?.jenisJabatan !== 'DS' && (
                <CTableHeaderCell scope="col">Telat Datang (menit)</CTableHeaderCell>
              )}
              <CTableHeaderCell scope="col">Pulang</CTableHeaderCell>
              {profilRiwayat?.jenisJabatan !== 'DS' && (
                <CTableHeaderCell scope="col">Cepat Pulang (menit)</CTableHeaderCell>
              )}
            </CTableRow>
          </CTableHead>
          <CTableBody>{rows}</CTableBody>
        </CTable>
        {riwayat.length > 0 && (
          <div className="d-flex mx-auto justify-content-center mb-3">
            <CButton
              color="danger"
              variant="outline"
              className="rounded-0"
              onClick={() =>
                openInNewTab(
                  '/#/kehadiran/pegawai/pdf/' + loginId + '/' + props.tahun + '/' + props.bulan,
                )
              }
            >
              Cetak PDF
            </CButton>
          </div>
        )}
      </>
    )
  }
}

Laporan.propTypes = {
  bulan: PropTypes.number,
  tahun: PropTypes.number,
  refresh: PropTypes.bool.isRequired,
}

export default Laporan
