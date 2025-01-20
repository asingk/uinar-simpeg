import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CFormInput,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import PropTypes from 'prop-types'
import { gql, useMutation } from '@apollo/client'

const UPSERT_PEGAWAI_PROFIL_DOSEN = gql`
  mutation UpsertDosen($pegawaiId: ID!, $input: UpsertDosenInput!) {
    upsertDosen(pegawaiId: $pegawaiId, input: $input) {
      code
      success
      message
    }
  }
`

const UbahProfilDosenModal = (props) => {
  const [nidn, setNidn] = useState(props.pegawai?.dosen?.nidn)
  const [sintaId, setSintaId] = useState(props.pegawai?.dosen?.sintaId)
  const [scopusId, setScopusId] = useState(props.pegawai?.dosen?.scopusId)
  const [wosId, setWosId] = useState(props.pegawai?.dosen?.wosId)
  const [orcidId, setorcidId] = useState(props.pegawai?.dosen?.orcidId)
  const [gsId, setGsId] = useState(props.pegawai?.dosen?.gsId)
  const [errorMessage, setErrorMessage] = useState('')

  const [submit, { data, loading, error }] = useMutation(UPSERT_PEGAWAI_PROFIL_DOSEN)

  const simpanPegawai = async () => {
    try {
      await submit({
        variables: {
          pegawaiId: props.pegawai.id,
          input: {
            nidn: nidn,
            sintaId: sintaId,
            scopusId: scopusId,
            wosId: wosId,
            gsId: gsId,
            prodiId: props.pegawai?.dosen?.prodi?.id,
            orcidId: orcidId,
          },
        },
        refetchQueries: ['PegawaiProfil'],
        awaitRefetchQueries: true,
      })
    } catch (mutationErr) {
      console.debug(mutationErr.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.upsertDosen.success) {
        setErrorMessage(data.upsertDosen.message)
      } else if (data?.upsertDosen.success) {
        props.setBasicModal(false)
      }
    }
  }, [data, props])

  return (
    <>
      <CModal scrollable visible={props.show} onClose={() => props.setBasicModal(false)}>
        <CModalHeader>
          <CModalTitle>Ubah Profil Dosen</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <>
            <CFormInput
              type="text"
              id="nidnInput"
              defaultValue={nidn}
              floatingClassName="mb-3"
              floatingLabel="NIDN"
              placeholder="NDIN"
              onChange={(e) => {
                setNidn(e.target.value)
              }}
            />
            <CFormInput
              type="text"
              id="sintaInput"
              defaultValue={sintaId}
              floatingClassName="mb-3"
              floatingLabel="ID Sinta"
              placeholder="ID Sinta"
              onChange={(e) => {
                setSintaId(e.target.value)
              }}
            />
            <CFormInput
              type="text"
              id="scopusInput"
              defaultValue={scopusId}
              floatingClassName="mb-3"
              floatingLabel="ID Scopus"
              placeholder="ID Scopus"
              onChange={(e) => {
                setScopusId(e.target.value)
              }}
            />
            <CFormInput
              type="text"
              id="wosInput"
              defaultValue={wosId}
              floatingClassName="mb-3"
              floatingLabel="WOS"
              placeholder="ID WOS"
              onChange={(e) => {
                setWosId(e.target.value)
              }}
            />
            <CFormInput
              type="text"
              id="orcidInput"
              defaultValue={orcidId}
              floatingClassName="mb-3"
              floatingLabel="ID Orcid"
              placeholder="ID Orcid"
              onChange={(e) => {
                setorcidId(e.target.value)
              }}
            />
            <CFormInput
              type="text"
              id="gsInput"
              defaultValue={gsId}
              floatingClassName="mb-3"
              floatingLabel="ID Goole Scholar"
              placeholder="ID Google Scholar"
              onChange={(e) => {
                setGsId(e.target.value)
              }}
            />
          </>
          {error && (
            <CAlert className="mt-3" color="danger">
              Error: {error.message}
            </CAlert>
          )}
          {errorMessage && (
            <CAlert className="mt-3" color="danger">
              Error: {errorMessage}
            </CAlert>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => props.setBasicModal(false)}>
            Tutup
          </CButton>

          <CLoadingButton loading={loading} onClick={simpanPegawai} color="primary">
            Simpan
          </CLoadingButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

UbahProfilDosenModal.propTypes = {
  pegawai: PropTypes.object.isRequired,
  show: PropTypes.bool,
  setBasicModal: PropTypes.func,
  setSubmitted: PropTypes.func,
}

export default UbahProfilDosenModal
