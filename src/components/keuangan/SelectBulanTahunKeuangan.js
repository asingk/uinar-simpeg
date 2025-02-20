import React from 'react'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'
import { namaBulan } from 'src/utils'

const SelectBulanTahunKeuangan = (props) => {
  const selectChange = (e) => {
    props.setSelect(e.target.value.substring(4), e.target.value.substring(0, 4))
  }

  const date = new Date()
  let thisYear = date.getFullYear()
  let thisMonth = date.getMonth()

  let options = []

  for (let i = thisMonth; i > 0; i--) {
    if (thisYear >= 2023 && i >= 10) {
      let opt = {
        label: namaBulan(i) + ' ' + thisYear,
        value: thisYear.toString() + i.toString(),
      }
      if (i === thisMonth) opt.selected = true
      options.push(opt)
    }
  }
  for (let i = 12; i > 0; i--) {
    const lastYear = thisYear - 1
    if (lastYear >= 2023 && i >= 10) {
      let opt = {
        label: namaBulan(i) + ' ' + lastYear,
        value: lastYear.toString() + i.toString(),
      }
      options.push(opt)
    }
  }

  return (
    <CFormSelect
      aria-label="Default select bulan tahun"
      options={options}
      // defaultValue={selected}
      onChange={(e) => selectChange(e)}
    />
  )
}

SelectBulanTahunKeuangan.propTypes = {
  setSelect: PropTypes.func,
}

export default SelectBulanTahunKeuangan
