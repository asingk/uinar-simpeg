import React from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'

const GET_DAFTAR_STATUS_KAWIN = gql`
  query DaftarStatusKawin {
    daftarStatusKawin {
      id
      nama
    }
  }
`

const SelectStatusKawin = (props) => {
  const { loading, error, data } = useQuery(GET_DAFTAR_STATUS_KAWIN)

  if (loading) {
    return <p className="text-center">Loading..</p>
  }
  if (error) {
    return <p className="text-center">Error.. :-(</p>
  }

  const statusKawinOptions = [
    {
      value: 0,
      label: '-- Pilih Status Kawin --',
      disabled: true,
    },
  ]

  const kawins = [...data.daftarStatusKawin]
  kawins.forEach((row) => {
    const kawin = {
      value: row.id,
      label: row.nama,
    }
    statusKawinOptions.push(kawin)
  })

  return (
    <CFormSelect
      aria-label="Pilih Agama"
      value={props.idStatusKawin}
      disabled={props.disabled}
      options={statusKawinOptions}
      onChange={(e) => props.setIdStatusKawin(e || '')}
    />
  )
}

SelectStatusKawin.propTypes = {
  idStatusKawin: PropTypes.number,
  setIdStatusKawin: PropTypes.func,
  disabled: PropTypes.bool,
}

export default SelectStatusKawin
