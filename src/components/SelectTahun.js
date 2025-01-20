import React from 'react'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'

const SelectTahun = (props) => {
  const selectChange = (e) => {
    props.setSelect(e.target.value)
  }

  let options = []
  for (let i = props.start; i >= props.end; i--) {
    let opt = {
      label: i,
      value: i,
    }
    options.push(opt)
  }

  return (
    <CFormSelect
      aria-label="Default select tahun"
      defaultValue={props.tahun}
      options={options}
      onChange={(e) => selectChange(e)}
    />
  )
}

SelectTahun.propTypes = {
  setSelect: PropTypes.func,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  tahun: PropTypes.number.isRequired,
}

export default SelectTahun
