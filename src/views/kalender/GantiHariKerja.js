import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { CAlert, CCol, CRow, CSpinner, CTable } from '@coreui/react-pro'
import SelectTahun from '../../components/SelectTahun'

const GantiHariKerja = () => {
  console.debug('rendering... GantiHariKerja')

  const date = new Date()

  const [tahun, setTahun] = useState(date.getFullYear())
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [errorMessage, setErrorMessage] = useState()

  useEffect(() => {
    setTahun(new Date().getFullYear())
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(false)
    setErrorMessage()
    if (tahun) {
      fetch(import.meta.env.VITE_KEHADIRAN_API_URL + '/hari-libur-tapi-kerja?tahun=' + tahun)
        .then((response) => response.json())
        .then(
          (data) => {
            setLoading(false)
            setData(data)
          },
          (error) => {
            setLoading(false)
            setError(error)
          },
        )
    }
  }, [tahun])

  let table

  const columns = [
    {
      key: 'tanggal',
      label: 'Tanggal',
      _props: { scope: 'col' },
    },
  ]

  let items = []

  if (data.length > 0) {
    data.forEach((row) => {
      const item = {
        tanggal: dayjs(row.tanggal).format('D/M/YYYY'),
        _cellProps: { id: { scope: 'row' } },
      }
      items.push(item)
    })
  } else {
    const item = {
      tanggal: 'Tidak ada data',
      _cellProps: { id: { scope: 'row' }, tanggal: { colSpan: 1 } },
    }
    items.push(item)
  }

  if (loading) {
    table = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    table = (
      <CAlert show className="w-100" color="danger">
        Error: {error}
      </CAlert>
    )
  } else {
    table = <CTable striped columns={columns} items={items} className="mb-4 mt-2" />
  }

  return (
    <>
      <CRow className="justify-content-md-center">
        <CCol md="2" className="mb-4">
          <SelectTahun
            setSelect={(id) => setTahun(id)}
            end={2020}
            start={date.getFullYear() + 1}
            tahun={Number(tahun)}
          />
        </CCol>
      </CRow>
      <CRow className="justify-content-md-center">
        {errorMessage && (
          <CAlert show className="w-100 mt-4" color="danger">
            {errorMessage}
          </CAlert>
        )}
        {table}
      </CRow>
    </>
  )
}

export default GantiHariKerja
