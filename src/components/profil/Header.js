import React from 'react'
import PropTypes from 'prop-types'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CAvatar } from '@coreui/react-pro'
import { gql } from '@apollo/client'

const Header = ({ pegawai }) => {
  let remunPosisi
  let ukerRow = []

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (pegawai.unitKerjaSaatIni.length > 0) {
    pegawai.unitKerjaSaatIni.forEach((row) => {
      if (row.grade && !row.isSecondary) {
        remunPosisi = row.grade
      }
      const uker = row.unitKerja?.nama || ''
      const bag = row.bagian?.nama ? row.bagian?.nama + ' - ' : ''
      const sub = row.subbag?.nama ? row.subbag?.nama + ' - ' : ''
      ukerRow.push(
        <div className="mb-2" key={row.id}>
          <div className="fw-semibold">
            {row.posisi.nama}
            <div className="text-medium-emphasis small">
              {sub}
              {bag}
              {uker}
            </div>
            {row.grade && (
              <div className="d-flex flex-wrap gap-2 mt-1">
                <CBadge color="info">Kelas Jabatan {row.grade.id}</CBadge>
                {/*{row.grade.remun && (*/}
                {/*  <CBadge color="success" variant="outline" className="fw-normal">*/}
                {/*    {formatCurrency(row.grade.remun)}*/}
                {/*  </CBadge>*/}
                {/*)}*/}
              </div>
            )}
          </div>
        </div>,
      )
    })
  }

  // Generate initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <CCard className="shadow-sm border-0 profile-card">
      <CCardHeader className="bg-gradient border-0">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <CBadge color="light" className="px-3 py-2 text-dark">
            {pegawai.statusPegawai.nama}
          </CBadge>
          {pegawai.statusAktif.id > 1 && (
            <CBadge color="warning" className="px-3 py-2">
              {pegawai.statusAktif.nama}
            </CBadge>
          )}
        </div>
      </CCardHeader>
      <CCardBody className="text-center py-4">
        <CAvatar
          color="primary"
          textColor="white"
          size="xl"
          className="mb-3 shadow-md"
          style={{
            width: '100px',
            height: '100px',
            fontSize: '2rem',
            fontWeight: '600',
          }}
        >
          {getInitials(pegawai.nama)}
        </CAvatar>
        <h4 className="mb-1 fw-bold">{pegawai.nama}</h4>
        <p className="text-medium-emphasis mb-4">{pegawai.id}</p>

        <CRow className="g-3">
          <CCol xs={12}>
            <CCard className="bg-light border-0 shadow-sm">
              <CCardBody className="py-3 px-3 text-start">
                <h6 className="mb-2 text-success fw-semibold d-flex align-items-center">
                  <span className="me-2">💼</span>
                  Jabatan
                </h6>
                <div className="fw-semibold mb-1">{pegawai.jabatanSaatIni.level.jabatan.nama}</div>
                <div className="text-medium-emphasis small">
                  {pegawai.jabatanSaatIni.level.nama} {pegawai.jabatanSaatIni.sublevel?.nama}
                </div>
                {pegawai.jabatanSaatIni.grade && pegawai.statusPegawai.id !== 3 && !remunPosisi && (
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    <CBadge color="info">Kelas Jabatan {pegawai.jabatanSaatIni.grade.id}</CBadge>
                    {/*{pegawai.jabatanSaatIni.grade.remun && (*/}
                    {/*  <CBadge color="success" variant="outline">*/}
                    {/*    Remun: {formatCurrency(pegawai.jabatanSaatIni.grade.remun)}*/}
                    {/*  </CBadge>*/}
                    {/*)}*/}
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>

          {ukerRow.length > 0 && (
            <CCol xs={12}>
              <CCard className="bg-light border-0 shadow-sm">
                <CCardBody className="py-3 px-3 text-start">
                  <h6 className="mb-3 text-primary fw-semibold d-flex align-items-center">
                    <span className="me-2">🏢</span>
                    Unit Kerja
                  </h6>
                  <div className="d-flex flex-column gap-2">{ukerRow}</div>
                </CCardBody>
              </CCard>
            </CCol>
          )}
        </CRow>
      </CCardBody>
    </CCard>
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
