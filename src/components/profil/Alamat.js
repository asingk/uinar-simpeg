import React from 'react'
import PropTypes from 'prop-types'
import { CCol, CFormInput, CFormLabel, CRow } from '@coreui/react-pro'
import { gql } from '@apollo/client'

const Alamat = ({ pegawai }) => {
  return (
    <CRow>
      <CCol md="6">
        <CRow className="mb-3">
          <CFormLabel htmlFor="staticAlamatDesc" className="col-sm-3 col-form-label">
            Alamat
          </CFormLabel>
          <CCol sm={9}>
            <CFormInput
              type="text"
              id="staticAlamatDesc"
              defaultValue={pegawai?.alamat?.deskripsi1 || ''}
              readOnly
              plainText
            />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CFormLabel htmlFor="staticAlamatDesc" className="col-sm-3 col-form-label">
            Kelurahan
          </CFormLabel>
          <CCol sm={9}>
            <CFormInput
              type="text"
              id="staticAlamatDesc"
              defaultValue={pegawai?.alamat?.deskripsi2 || ''}
              readOnly
              plainText
            />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CFormLabel htmlFor="staticAlamatKabKota" className="col-sm-3 col-form-label">
            Kab/Kota
          </CFormLabel>
          <CCol sm={9}>
            <CFormInput
              type="text"
              id="staticAlamatKabKota"
              defaultValue={pegawai?.alamat?.kabKota || ''}
              readOnly
              plainText
            />
          </CCol>
        </CRow>
      </CCol>
      <CCol md="6">
        <CRow className="mb-3">
          <CFormLabel htmlFor="staticAlamatProv" className="col-sm-3 col-form-label">
            Provinsi
          </CFormLabel>
          <CCol sm={9}>
            <CFormInput
              type="text"
              id="staticAlamatProv"
              defaultValue={pegawai?.alamat?.provinsi || ''}
              readOnly
              plainText
            />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CFormLabel htmlFor="staticAlamatKodePos" className="col-sm-3 col-form-label">
            Kode Pos
          </CFormLabel>
          <CCol sm={9}>
            <CFormInput
              type="text"
              id="staticAlamatKodePos"
              defaultValue={pegawai?.alamat?.kodePos || ''}
              readOnly
              plainText
            />
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  )
}

Alamat.propTypes = {
  // pegawaiId: PropTypes.string.isRequired,
  pegawai: PropTypes.object.isRequired,
}

Alamat.fragments = {
  entry: gql`
    fragment AlamatFragment on Pegawai {
      alamat {
        deskripsi1
        deskripsi2
        kabKota
        provinsi
        kodePos
      }
    }
  `,
}

export default Alamat
