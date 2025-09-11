import React, { useContext, useState } from 'react'
import { gql } from '@apollo/client'
import PropTypes from 'prop-types'
import { CButton, CCol, CRow } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPen } from '@coreui/icons'
import UbahProfilDosenModal from './UbahProfilDosenModal'
import { KeycloakContext } from 'src/context'

const Dosen = ({ pegawai }) => {
  const [basicModal, setBasicModal] = useState(false)
  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  return (
    <>
      {loginId === pegawai.id && (
        <CRow className="justify-content-end mb-2">
          <CCol lg="1" md="2" xs="4">
            <CButton color={'warning'} onClick={() => setBasicModal(true)}>
              <CIcon icon={cilPen} /> Edit
            </CButton>
          </CCol>
        </CRow>
      )}
      <CRow xs={{ cols: 1, gutter: 3 }} lg={{ cols: 2, gutter: 3 }}>
        <CCol>
          <CRow>
            <CCol sm={4}>Fakultas</CCol>
            <CCol sm={8}>{pegawai.dosen?.prodi?.fakultas.nama}</CCol>
          </CRow>
        </CCol>
        <CCol>
          <CRow>
            <CCol sm={4}>Program Studi</CCol>
            <CCol sm={8}>{pegawai.dosen?.prodi?.nama}</CCol>
          </CRow>
        </CCol>
        <CCol>
          <CRow>
            <CCol sm={4}>NIDN</CCol>
            <CCol sm={8}>{pegawai.dosen?.nidn}</CCol>
          </CRow>
        </CCol>
        <CCol>
          <CRow>
            <CCol sm={4}>ID Sinta</CCol>
            <CCol sm={8}>{pegawai.dosen?.sintaId}</CCol>
          </CRow>
        </CCol>
        <CCol>
          <CRow>
            <CCol sm={4}>ID Scopus</CCol>
            <CCol sm={8}>{pegawai.dosen?.scopusId}</CCol>
          </CRow>
        </CCol>
        <CCol>
          <CRow>
            <CCol sm={4}>ID WOS</CCol>
            <CCol sm={8}>{pegawai.dosen?.wosId}</CCol>
          </CRow>
        </CCol>
        <CCol>
          <CRow>
            <CCol sm={4}>ID Orcid</CCol>
            <CCol sm={8}>{pegawai.dosen?.orcidId}</CCol>
          </CRow>
        </CCol>
        <CCol>
          <CRow>
            <CCol sm={4}>ID Google Scholar</CCol>
            <CCol sm={8}>{pegawai.dosen?.gsId}</CCol>
          </CRow>
        </CCol>
        <CCol>
          <CRow>
            <CCol sm={4}>SK Sertifikasi Serdos</CCol>
            <CCol sm={8}>{pegawai.dosen?.serdosSkSertifikat}</CCol>
          </CRow>
        </CCol>
        <CCol>
          <CRow>
            <CCol sm={4}>Bidang Studi Serdos</CCol>
            <CCol sm={8}>{pegawai.dosen?.serdosBidangStudi}</CCol>
          </CRow>
        </CCol>
        <CCol>
          <CRow>
            <CCol sm={4}>Nomor Registrasi Serdos</CCol>
            <CCol sm={8}>{pegawai.dosen?.serdosNoRegistrasi}</CCol>
          </CRow>
        </CCol>
        <CCol>
          <CRow>
            <CCol sm={4}>Serdos Tahun Sertifikasi</CCol>
            <CCol sm={8}>{pegawai.dosen?.serdosTahunSertifikasi}</CCol>
          </CRow>
        </CCol>
      </CRow>
      {basicModal && (
        <UbahProfilDosenModal pegawai={pegawai} show={basicModal} setBasicModal={setBasicModal} />
      )}
    </>
  )
}

Dosen.propTypes = {
  pegawai: PropTypes.object.isRequired,
}

Dosen.fragments = {
  entry: gql`
    fragment DosenFragment on Pegawai {
      dosen {
        nidn
        sintaId
        scopusId
        wosId
        orcidId
        gsId
        serdosSkSertifikat
        serdosBidangStudi
        serdosNoRegistrasi
        serdosTahunSertifikasi
        prodi {
          id
          nama
          fakultas {
            id
            nama
          }
        }
      }
    }
  `,
}

export default Dosen
