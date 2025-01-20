import React from 'react'
import PropTypes from 'prop-types'
import { CCol } from '@coreui/react-pro'
import dayjs from 'dayjs'
import { gql } from '@apollo/client'

const Footer = ({ pegawai }) => {
  const date = new Date(pegawai.updatedAt || pegawai.createdAt)
  return (
    <CCol md="12" className="text-center mt-3">
      <p>
        Diubah terakhir kali oleh {pegawai.updatedBy || pegawai.createdBy} pada{' '}
        {dayjs(date).format('DD/MM/YYYY')}
      </p>
    </CCol>
  )
}

Footer.propTypes = {
  pegawai: PropTypes.object.isRequired,
}

Footer.fragments = {
  entry: gql`
    fragment FooterFragment on Pegawai {
      updatedBy
      updatedAt
    }
  `,
}

export default Footer
