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
import { useNavigate, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilArrowThickLeft } from '@coreui/icons'

const GET_STRUKTUR_ORG = gql`
  query DaftarStrukturOrganisasi($unitKerjaId: String, $bagianId: ID, $subbagId: ID) {
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
        jabatanSaatIni {
          id
          level {
            id
            nama
          }
          sublevel {
            id
            nama
          }
        }
      }
    }
  }
`

const StrukturBag = () => {
  console.debug('rendering... StrukturBag')

  const { id, bagId, subbagId } = useParams()
  const navigate = useNavigate()

  const { data } = useQuery(GET_STRUKTUR_ORG, {
    variables: { unitKerjaId: id, bagianId: bagId, subbagId: subbagId },
  })

  let kepala
  let cardList = []

  if (data?.daftarStrukturOrganisasi.length > 0) {
    const strOrg = data?.daftarStrukturOrganisasi
    kepala = strOrg.find((el) => el.posisi.kategori === 1)
    const wak = strOrg.filter((el) => el.posisi.kategori === 2)
    wak.forEach((row) => {
      cardList.push(
        <CCol xs key={row.id}>
          <CCard className="h-100 text-center">
            <CCardBody>
              <CCardTitle>{row.pegawai[0]?.nama || '-'}</CCardTitle>
              <CCardSubtitle className="mb-2 text-medium-emphasis">{row.posisi.nama}</CCardSubtitle>
              <CCardText>{row.subbag.nama}</CCardText>
              <CButton
                color="link"
                disabled={!row.pegawai[0]}
                onClick={() => navigate('/profil/' + row.pegawai[0]?.id)}
              >
                Profil
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>,
      )
    })
    const ang = strOrg.find((el) => el.posisi.kategori === 3)
    ang?.pegawai.forEach((row) => {
      cardList.push(
        <CCol xs key={row.id}>
          <CCard className="h-100 text-center">
            <CCardBody>
              <CCardTitle>{row.nama}</CCardTitle>
              <CCardSubtitle className="mb-2 text-medium-emphasis">Staf</CCardSubtitle>
              <CCardText>
                {row.jabatanSaatIni.level.nama}
                {' - '}
                {row.jabatanSaatIni.sublevel.nama}
              </CCardText>
              <CButton color="link" onClick={() => navigate('/profil/' + row.id)}>
                Profil
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
      <CButton
        className="mb-3"
        color="secondary"
        onClick={() => navigate('/struktur-org/' + id + '/' + bagId)}
      >
        <CIcon icon={cilArrowThickLeft} />
      </CButton>
      <CCard className="text-center">
        <CCardBody>
          <CCardTitle>{kepala?.pegawai[0]?.nama}</CCardTitle>
          <CCardSubtitle className="mb-2 text-medium-emphasis">{kepala?.posisi.nama}</CCardSubtitle>
          <CCardText>{kepala?.subbag.nama}</CCardText>
          <CButton color="link" onClick={() => navigate('/profil/' + kepala?.pegawai[0]?.id)}>
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

export default StrukturBag
