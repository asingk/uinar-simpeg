import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
} from '@coreui/react-pro'
import { gql, useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

const GET_STRUKTUR_ORG = gql`
  query DaftarStrukturOrganisasi($unitKerjaId: String, $bagianId: Int, $subbagId: Int) {
    daftarStrukturOrganisasi(unitKerjaId: $unitKerjaId, bagianId: $bagianId, subbagId: $subbagId) {
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
        kategori
      }
      pegawai {
        id
        nama
      }
    }
  }
`

const StrukturSatker = () => {
  console.debug('rendering... StrukturSatker')

  const navigate = useNavigate()

  const { data } = useQuery(GET_STRUKTUR_ORG, {
    variables: { bagianId: null },
  })

  let rektor
  let cardList = []

  if (data?.daftarStrukturOrganisasi.length > 0) {
    const strOrg = data?.daftarStrukturOrganisasi
    rektor = strOrg.find((el) => el.unitKerja === null)
    const kepUker = strOrg.filter((el) => el.unitKerja !== null && el.posisi.kategori === 1)
    kepUker.forEach((row, index) => {
      cardList.push(
        <CCol xs key={index}>
          <CCard className="h-100 text-center">
            <CCardBody>
              <CCardTitle>{row.pegawai[0]?.nama || '-'}</CCardTitle>
              <CCardSubtitle className="mb-2 text-medium-emphasis">{row.posisi.nama}</CCardSubtitle>
              <CCardText>{row.unitKerja.nama}</CCardText>
              <CButton color="link" onClick={() => navigate('/profil/' + row.pegawai[0]?.id)}>
                Profil
              </CButton>
              <CButton color="link" onClick={() => navigate('/struktur-org/' + row.unitKerja.id)}>
                Anggota
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>,
      )
    })
  }

  return (
    <>
      <h1 className="text-center">Struktur Organisasi</h1>
      <CCard className="text-center">
        <CCardBody>
          <CCardTitle>{rektor?.pegawai[0]?.nama}</CCardTitle>
          <CCardSubtitle className="mb-2 text-medium-emphasis">{rektor?.posisi.nama}</CCardSubtitle>
          <CCardText>Universitas Islam Negeri Ar-Raniry</CCardText>
          <CButton color="link" onClick={() => navigate('/profil/' + rektor?.pegawai[0]?.id)}>
            Profil
          </CButton>
        </CCardBody>
      </CCard>
      <hr />
      <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }} className="mb-3">
        {cardList}
      </CRow>
    </>
  )
}

export default StrukturSatker
