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

const Pangkat = ({ pegawai }) => {
  const pangkats = pegawai.riwayatPangkat
  const panjang = pangkats != null ? pangkats.length : 0
  const rows = []
  for (let index = 0; index < panjang; index++) {
    rows.push(
      <CTableRow key={index}>
        <CTableHeaderCell scope="row">{pangkats[index].nama}</CTableHeaderCell>
        <CTableDataCell>{pangkats[index].golonganRuang}</CTableDataCell>
        <CTableDataCell>{dayjs(pangkats[index].tmt).format('DD/MM/YYYY')}</CTableDataCell>
        <CTableDataCell>{pangkats[index].noSk}</CTableDataCell>
        <CTableDataCell>{pangkats[index].ket}</CTableDataCell>
      </CTableRow>,
    )
  }
  return (
    <CTable striped responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">Nama Pangkat</CTableHeaderCell>
          <CTableHeaderCell scope="col">Gol Ruang</CTableHeaderCell>
          <CTableHeaderCell scope="col">TMT</CTableHeaderCell>
          <CTableHeaderCell scope="col">No. SK</CTableHeaderCell>
          <CTableHeaderCell scope="col">Keterangan</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>{rows}</CTableBody>
    </CTable>
  )
}

Pangkat.propTypes = {
  pegawai: PropTypes.object.isRequired,
}

Pangkat.fragments = {
  entry: gql`
    fragment PangkatFragment on Pegawai {
      riwayatPangkat {
        nama
        golonganRuang
        tmt
        noSk
        ket
      }
    }
  `,
}

export default Pangkat
