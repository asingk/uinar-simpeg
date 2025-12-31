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
  CContainer,
  CCard,
  CCardBody,
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
      <div className="loading-wrapper">
        <div className="text-center">
          <CSpinner color="primary" size="lg" className="mb-3" />
          <div className="text-medium-emphasis fw-semibold">Memuat data profil...</div>
        </div>
      </div>
    )
  else if (error)
    return (
      <CContainer fluid className="px-4">
        <CAlert className="shadow-sm border-0" color="danger">
          <h4 className="alert-heading mb-3">
            <strong>❌ Terjadi Kesalahan</strong>
          </h4>
          <p className="mb-0">{error.message}</p>
        </CAlert>
      </CContainer>
    )

  return (
    <CContainer fluid className="px-4 py-3">
      <CRow className="g-4">
        {/* Profile Header Section */}
        <CCol lg={4} xl={4}>
          <div className="profile-sidebar-sticky">
            <Header pegawai={data.pegawai} />
          </div>
        </CCol>

        {/* Profile Details Section */}
        <CCol lg={8} xl={8}>
          <CRow className="g-4">
            {/* Informasi Pribadi Card */}
            <CCol xs={12}>
              <CCard className="shadow-sm border-0 profile-card">
                <CCardBody className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="icon-wrapper icon-info me-3">
                      <span style={{ fontSize: '1.25rem' }}>👤</span>
                    </div>
                    <h5 className="mb-0 fw-bold">Informasi Pribadi</h5>
                  </div>
                  <Pribadi pegawai={data.pegawai} />
                </CCardBody>
              </CCard>
            </CCol>

            {/* Accordion Section */}
            <CCol xs={12}>
              <CAccordion activeItemKey={1} alwaysOpen className="accordion-profile">
                {data.pegawai.statusPegawai.isSync && loginId === data.pegawai.id && (
                  <CAccordionItem itemKey={1} className="border-0 shadow-sm mb-3">
                    <CAccordionHeader>
                      <div className="d-flex align-items-center">
                        <span className="me-2" style={{ fontSize: '1.25rem' }}>
                          📍
                        </span>
                        <strong>Alamat</strong>
                      </div>
                    </CAccordionHeader>
                    <CAccordionBody>
                      <Alamat pegawai={data.pegawai} />
                    </CAccordionBody>
                  </CAccordionItem>
                )}
                {data.pegawai.statusPegawai.isSync && (
                  <CAccordionItem itemKey={2} className="border-0 shadow-sm mb-3">
                    <CAccordionHeader>
                      <div className="d-flex align-items-center">
                        <span className="me-2" style={{ fontSize: '1.25rem' }}>
                          🎓
                        </span>
                        <strong>Pendidikan</strong>
                      </div>
                    </CAccordionHeader>
                    <CAccordionBody>
                      <Pendidikan pegawai={data.pegawai} />
                    </CAccordionBody>
                  </CAccordionItem>
                )}
                {data.pegawai.statusPegawai.isSync && (
                  <CAccordionItem itemKey={3} className="border-0 shadow-sm mb-3">
                    <CAccordionHeader>
                      <div className="d-flex align-items-center">
                        <span className="me-2" style={{ fontSize: '1.25rem' }}>
                          ⭐
                        </span>
                        <strong>Pangkat</strong>
                      </div>
                    </CAccordionHeader>
                    <CAccordionBody>
                      <Pangkat pegawai={data.pegawai} />
                    </CAccordionBody>
                  </CAccordionItem>
                )}
                {data.pegawai.statusPegawai.isSync && (
                  <CAccordionItem itemKey={4} className="border-0 shadow-sm mb-3">
                    <CAccordionHeader>
                      <div className="d-flex align-items-center">
                        <span className="me-2" style={{ fontSize: '1.25rem' }}>
                          💼
                        </span>
                        <strong>Jabatan</strong>
                      </div>
                    </CAccordionHeader>
                    <CAccordionBody>
                      <JabatanKemenag pegawai={data.pegawai} />
                    </CAccordionBody>
                  </CAccordionItem>
                )}
                {(data.pegawai.jenisJabatan === 'DS' || data.pegawai.jenisJabatan === 'DT') && (
                  <CAccordionItem itemKey={5} className="border-0 shadow-sm mb-3">
                    <CAccordionHeader>
                      <div className="d-flex align-items-center">
                        <span className="me-2" style={{ fontSize: '1.25rem' }}>
                          👨‍🏫
                        </span>
                        <strong>Dosen</strong>
                      </div>
                    </CAccordionHeader>
                    <CAccordionBody>
                      <Dosen pegawai={data.pegawai} />
                    </CAccordionBody>
                  </CAccordionItem>
                )}
              </CAccordion>
            </CCol>

            {/* Footer Section */}
            <CCol xs={12}>
              <Footer pegawai={data.pegawai} />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Profil
