import React, { useContext } from 'react'
import { useQuery, gql } from '@apollo/client'
import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CAlert,
  CCol,
  CRow,
  CSpinner,
} from '@coreui/react-pro'
import Header from '../../components/profil/Header'
import Pribadi from '../../components/profil/Pribadi'
import Alamat from '../../components/profil/Alamat'
import Pendidikan from '../../components/profil/Pendidikan'
import Pangkat from '../../components/profil/Pangkat'
import JabatanKemenag from '../../components/profil/JabatanKemenag'
import Dosen from '../../components/profil/Dosen'
import Footer from '../../components/profil/Footer'
import { useParams } from 'react-router-dom'
import { KeycloakContext } from 'src/context'

const GET_PEGAWAI = gql`
  query PegawaiProfil($id: ID!) {
    pegawai(id: $id) {
      id
      statusPegawai {
        id
        nama
        isSync
      }
      statusAktif {
        id
        nama
      }
      jenisJabatan
      ...FooterFragment
      ...PribadiFragment
      ...HeaderFragment
      ...AlamatFragment
      ...DosenFragment
      ...PendidikanFragment
      ...PangkatFragment
      ...JabatanKemenagFragment
    }
  }
  ${Footer.fragments.entry}
  ${Pribadi.fragments.entry}
  ${Header.fragments.entry}
  ${Alamat.fragments.entry}
  ${Dosen.fragments.entry}
  ${Pendidikan.fragments.entry}
  ${Pangkat.fragments.entry}
  ${JabatanKemenag.fragments.entry}
`

const Profil = () => {
  console.debug('rendering... Profil')

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username
  const { id } = useParams()

  const { loading, error, data } = useQuery(GET_PEGAWAI, {
    variables: { id: id || loginId },
    fetchPolicy: 'no-cache',
  })

  if (loading)
    return (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  else if (error)
    return (
      <CAlert className="w-100" color="danger">
        Error: {error.message}
      </CAlert>
    )

  return (
    <>
      <CRow className="mb-3">
        <CCol>
          <Header pegawai={data.pegawai} />
        </CCol>
      </CRow>
      <CRow className="mb-3">
        <CCol>
          <Pribadi pegawai={data.pegawai} />
        </CCol>
      </CRow>
      <CAccordion className="mb-3">
        {data.pegawai.statusPegawai.isSync && loginId === data.pegawai.id && (
          <CAccordionItem itemKey={1}>
            <CAccordionHeader>Alamat</CAccordionHeader>
            <CAccordionBody>
              <Alamat pegawai={data.pegawai} />
            </CAccordionBody>
          </CAccordionItem>
        )}
        {data.pegawai.statusPegawai.isSync && (
          <CAccordionItem itemKey={2}>
            <CAccordionHeader>Pendidikan</CAccordionHeader>
            <CAccordionBody>
              <Pendidikan pegawai={data.pegawai} />
            </CAccordionBody>
          </CAccordionItem>
        )}
        {data.pegawai.statusPegawai.isSync && (
          <CAccordionItem itemKey={3}>
            <CAccordionHeader>Pangkat</CAccordionHeader>
            <CAccordionBody>
              <Pangkat pegawai={data.pegawai} />
            </CAccordionBody>
          </CAccordionItem>
        )}
        {data.pegawai.statusPegawai.isSync && (
          <CAccordionItem itemKey={4}>
            <CAccordionHeader>Jabatan</CAccordionHeader>
            <CAccordionBody>
              <JabatanKemenag pegawai={data.pegawai} />
            </CAccordionBody>
          </CAccordionItem>
        )}
        {(data.pegawai.jenisJabatan === 'DS' || data.pegawai.jenisJabatan === 'DT') && (
          <CAccordionItem itemKey={5}>
            <CAccordionHeader>Dosen</CAccordionHeader>
            <CAccordionBody>{<Dosen pegawai={data.pegawai} />}</CAccordionBody>
          </CAccordionItem>
        )}
      </CAccordion>
      <CRow>
        <Footer pegawai={data.pegawai} />
      </CRow>
    </>
  )
}

export default Profil
