import React from 'react'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'
import { namaBulan } from 'src/utils'

const SelectBulanTahunKehadiran = (props) => {
  const selectChange = (e) => {
    props.setSelect(e.target.value.substring(4), e.target.value.substring(0, 4))
  }

  const date = new Date()
  let thisYear = date.getFullYear()
  let thisMonth = date.getMonth() + 1

  let options = []
  for (let i = thisMonth; i > 0; i--) {
    let opt = {
      label: namaBulan(i) + ' ' + thisYear,
      value: thisYear.toString() + i.toString(),
    }
    if (i === thisMonth) opt.selected = true
    options.push(opt)
  }
  for (let i = 12; i > 0; i--) {
    const lastYear = thisYear - 1
    let opt = {
      label: namaBulan(i) + ' ' + lastYear,
      value: lastYear.toString() + i.toString(),
    }
    options.push(opt)
  }

  return (
    <CFormSelect
      aria-label="Default select bulan tahun"
      options={options}
      onChange={(e) => selectChange(e)}
    />
  )
}

SelectBulanTahunKehadiran.propTypes = {
  setSelect: PropTypes.func,
}

export default SelectBulanTahunKehadiran
