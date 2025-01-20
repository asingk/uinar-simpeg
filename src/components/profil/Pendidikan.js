import React from 'react'
import PropTypes from 'prop-types'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro'
import { gql } from '@apollo/client'

const Pendidikan = ({ pegawai }) => {
  const pendidikans = pegawai.riwayatPendidikan
  const rows = []
  for (let index = 0; index < pendidikans.length; index++) {
    rows.push(
      <CTableRow key={index}>
        <CTableHeaderCell scope="row">{pendidikans[index].namaSekolah}</CTableHeaderCell>
        <CTableDataCell>{pendidikans[index].fakultas}</CTableDataCell>
        <CTableDataCell>{pendidikans[index].jurusan}</CTableDataCell>
        <CTableDataCell>{pendidikans[index].tahunLulus}</CTableDataCell>
        <CTableDataCell>{pendidikans[index].jenjang}</CTableDataCell>
        <CTableDataCell>{pendidikans[index].lokasiSekolah}</CTableDataCell>
        <CTableDataCell>{pendidikans[index].akta}</CTableDataCell>
      </CTableRow>,
    )
  }
  return (
    <CTable striped responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">Nama Sekolah</CTableHeaderCell>
          <CTableHeaderCell scope="col">Fakultas</CTableHeaderCell>
          <CTableHeaderCell scope="col">Jurusan</CTableHeaderCell>
          <CTableHeaderCell scope="col">Tahun Lulus</CTableHeaderCell>
          <CTableHeaderCell scope="col">Jenjang</CTableHeaderCell>
          <CTableHeaderCell scope="col">Lokasi</CTableHeaderCell>
          <CTableHeaderCell scope="col">Akta</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>{rows}</CTableBody>
    </CTable>
  )
}

Pendidikan.propTypes = {
  pegawai: PropTypes.object.isRequired,
}

Pendidikan.fragments = {
  entry: gql`
    fragment PendidikanFragment on Pegawai {
      riwayatPendidikan {
        namaSekolah
        fakultas
        jurusan
        tahunLulus
        jenjang
        lokasiSekolah
        akta
      }
    }
  `,
}

export default Pendidikan
