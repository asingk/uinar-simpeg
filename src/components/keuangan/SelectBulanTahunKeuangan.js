import React from 'react'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'

const SelectBulanTahunKeuangan = (props) => {
  const selectChange = (e) => {
    props.setSelect(e.target.value.substring(4), e.target.value.substring(0, 4))
  }

  const date = new Date()
  let thisYear = date.getFullYear()
  let thisMonth = date.getMonth()
  const namaBulan = (bulan) => {
    switch (bulan) {
      case 1:
        return 'Januari'
      case 2:
        return 'Februari'
      case 3:
        return 'Maret'
      case 4:
        return 'April'
      case 5:
        return 'Mei'
      case 6:
        return 'Juni'
      case 7:
        return 'Juli'
      case 8:
        return 'Agustus'
      case 9:
        return 'September'
      case 10:
        return 'Oktober'
      case 11:
        return 'November'
      case 12:
        return 'Desember'
      default:
        return ''
    }
  }

  let options = []
  // for (let i = date.getMonth(); i > 0; i--) {
  //   let opt = {
  //     label: namaBulan(i) + ' ' + thisYear,
  //     value: thisYear.toString() + i.toString(),
  //   }
  //   options.push(opt)
  // }
  // if (thisYear > 2023) {
  //   for (let i = 12; i > 0; i--) {
  //     let opt = {
  //       label: namaBulan(i) + ' ' + thisYear - 1,
  //       value: (thisYear - 1).toString() + i.toString(),
  //     }
  //     options.push(opt)
  //   }
  // }
  //
  // let selected
  // if (thisMonth > 0) {
  //   selected = thisYear.toString() + date.getMonth().toString()
  // } else {
  //   selected = (thisYear - 1).toString() + '12'
  // }

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
