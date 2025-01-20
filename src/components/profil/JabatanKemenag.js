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
import dayjs from 'dayjs'
import { gql } from '@apollo/client'

const JabatanKemenag = ({ pegawai }) => {
  const jabatans = pegawai.riwayatJabatanKemenag
  const rows = []
  for (let index = 0; index < jabatans.length; index++) {
    rows.push(
      <CTableRow key={index}>
        <CTableHeaderCell scope="row">{jabatans[index].nama}</CTableHeaderCell>
        <CTableDataCell>{jabatans[index].unitKerja}</CTableDataCell>
        <CTableDataCell>{dayjs(jabatans[index].tmt).format('DD/MM/YYYY')}</CTableDataCell>
        <CTableDataCell>{jabatans[index].noSk}</CTableDataCell>
        <CTableDataCell>{jabatans[index].bidangStudi}</CTableDataCell>
      </CTableRow>,
    )
  }
  return (
    <CTable striped responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">Nama Jabatan</CTableHeaderCell>
          <CTableHeaderCell scope="col">Unit Kerja</CTableHeaderCell>
          <CTableHeaderCell scope="col">TMT</CTableHeaderCell>
          <CTableHeaderCell scope="col">No. SK</CTableHeaderCell>
          <CTableHeaderCell scope="col">Bidang Studi</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>{rows}</CTableBody>
    </CTable>
  )
}

JabatanKemenag.propTypes = {
  pegawai: PropTypes.object.isRequired,
}

JabatanKemenag.fragments = {
  entry: gql`
    fragment JabatanKemenagFragment on Pegawai {
      riwayatJabatanKemenag {
        nama
        noSk
        tmt
        unitKerja
        bidangStudi
      }
    }
  `,
}

export default JabatanKemenag
