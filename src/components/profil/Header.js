import React from 'react'
import PropTypes from 'prop-types'
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardText,
  CCardTitle,
  CListGroup,
  CListGroupItem,
} from '@coreui/react-pro'
import { gql } from '@apollo/client'

// untuk format currency
const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

const Header = ({ pegawai }) => {
  let remunPosisi
  let ukerRow = []
  if (pegawai.unitKerjaSaatIni.length > 0) {
    pegawai.unitKerjaSaatIni.forEach((row) => {
      if (row.grade && !row.isSecondary) {
        remunPosisi = row.grade
      }
      const uker = row.unitKerja?.nama || ''
      const bag = row.bagian?.nama ? row.bagian?.nama + ' - ' : ''
      const sub = row.subbag?.nama ? row.subbag?.nama + ' - ' : ''
      ukerRow.push(
        <div className="mb-1" key={row.id}>
          {row.posisi.nama + ' '}
          {sub}
          {bag}
          {uker}{' '}
          {remunPosisi
            ? '; Grade ' + remunPosisi.id + ', Remun: ' + formatter.format(remunPosisi.remun)
            : ''}{' '}
        </div>,
      )
    })
  }

  return (
    <>
      <CCard className="text-center">
        <CCardHeader>{pegawai.statusPegawai.nama}</CCardHeader>
        <CCardBody>
          <CCardTitle>{pegawai.nama}</CCardTitle>
          <CCardText>{pegawai.id}</CCardText>
          <CListGroup flush>
            <CListGroupItem>
              <div className="mb-1">
                {pegawai.jabatanSaatIni.level.jabatan.nama} - {pegawai.jabatanSaatIni.level.nama}{' '}
                {pegawai.jabatanSaatIni.sublevel?.nama}
                {pegawai.jabatanSaatIni.grade && !remunPosisi && pegawai.statusPegawai.id !== 3
                  ? '; Grade ' +
                    pegawai.jabatanSaatIni.grade.id +
                    ', Remun: ' +
                    formatter.format(pegawai.jabatanSaatIni.grade.remun)
                  : ''}{' '}
              </div>
            </CListGroupItem>
            <CListGroupItem>{ukerRow}</CListGroupItem>
          </CListGroup>
        </CCardBody>
        {pegawai.statusAktif.id > 1 && (
          <CCardFooter className="text-medium-emphasis">{pegawai.statusAktif.nama}</CCardFooter>
        )}
      </CCard>
    </>
  )
}

Header.propTypes = {
  pegawai: PropTypes.object.isRequired,
}

Header.fragments = {
  entry: gql`
    fragment HeaderFragment on Pegawai {
      nama
      jabatanSaatIni {
        id
        level {
          id
          nama
          jabatan {
            id
            nama
          }
        }
        sublevel {
          id
          nama
        }
        grade {
          id
          remun
        }
      }
      unitKerjaSaatIni {
        id
        unitKerja {
          id
          nama
        }
        bagian {
          id
          nama
        }
        subbag {
          id
          nama
        }
        posisi {
          id
          nama
        }
        grade {
          id
          remun
        }
        isSecondary
      }
    }
  `,
}

export default Header
