import React, { useState, useEffect } from 'react'
import { CAlert, CCol, CListGroup, CListGroupItem, CRow, CSpinner } from '@coreui/react-pro'
import SelectTahun from '../../components/SelectTahun'

const HariLibur = () => {
  console.debug('rendering... HariLibur')

  const date = new Date()

  const [tahun, setTahun] = useState(date.getFullYear())
  const [januari, setJanuari] = useState([])
  const [februari, setFebruari] = useState([])
  const [maret, setMaret] = useState([])
  const [april, setApril] = useState([])
  const [mei, setMei] = useState([])
  const [juni, setJuni] = useState([])
  const [juli, setJuli] = useState([])
  const [agustus, setAgustus] = useState([])
  const [september, setSeptember] = useState([])
  const [oktober, setOktober] = useState([])
  const [november, setNovember] = useState([])
  const [desember, setDesember] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTahun(new Date().getFullYear())
  }, [])

  useEffect(() => {
    setLoading(true)
    if (tahun) {
      fetch(import.meta.env.VITE_KEHADIRAN_API_URL + '/hari-libur?tahun=' + tahun)
        .then((response) => response.json())
        .then(
          (data) => {
            setLoading(false)
            const jan = data.filter((row) => {
              return row.tanggal.split('-')[1] === '01'
            })
            setJanuari(jan)
            const feb = data.filter((row) => {
              return row.tanggal.split('-')[1] === '02'
            })
            setFebruari(feb)
            const mar = data.filter((row) => {
              return row.tanggal.split('-')[1] === '03'
            })
            setMaret(mar)
            const apr = data.filter((row) => {
              return row.tanggal.split('-')[1] === '04'
            })
            setApril(apr)
            const mei = data.filter((row) => {
              return row.tanggal.split('-')[1] === '05'
            })
            setMei(mei)
            const jun = data.filter((row) => {
              return row.tanggal.split('-')[1] === '06'
            })
            setJuni(jun)
            const jul = data.filter((row) => {
              return row.tanggal.split('-')[1] === '07'
            })
            setJuli(jul)
            const agu = data.filter((row) => {
              return row.tanggal.split('-')[1] === '08'
            })
            setAgustus(agu)
            const sep = data.filter((row) => {
              return row.tanggal.split('-')[1] === '09'
            })
            setSeptember(sep)
            const okt = data.filter((row) => {
              return row.tanggal.split('-')[1] === '10'
            })
            setOktober(okt)
            const nov = data.filter((row) => {
              return row.tanggal.split('-')[1] === '11'
            })
            setNovember(nov)
            const des = data.filter((row) => {
              return row.tanggal.split('-')[1] === '12'
            })
            setDesember(des)
          },
          (error) => {
            setLoading(false)
            setError(error)
          },
        )
    }
  }, [tahun])

  const formatTanggal = (tanggal) => {
    const spltted = tanggal.split('-')
    return parseInt(spltted[2])
  }

  let liburList

  if (loading) {
    liburList = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    liburList = (
      <CAlert show className="w-100" color="danger">
        Error: {error.message}
      </CAlert>
    )
  } else {
    const janList = januari.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
      </CListGroupItem>
    ))
    const febList = februari.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
      </CListGroupItem>
    ))
    const marList = maret.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
      </CListGroupItem>
    ))
    const aprList = april.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
      </CListGroupItem>
    ))
    const meiList = mei.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
      </CListGroupItem>
    ))
    const junList = juni.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
      </CListGroupItem>
    ))
    const julList = juli.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
      </CListGroupItem>
    ))
    const aguList = agustus.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
      </CListGroupItem>
    ))
    const sepList = september.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
      </CListGroupItem>
    ))
    const oktList = oktober.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
      </CListGroupItem>
    ))
    const novList = november.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
      </CListGroupItem>
    ))
    const desList = desember.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
      </CListGroupItem>
    ))
    liburList = (
      <CRow>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Januari
            </CListGroupItem>
            {janList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Februari
            </CListGroupItem>
            {febList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Maret
            </CListGroupItem>
            {marList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              April
            </CListGroupItem>
            {aprList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Mei
            </CListGroupItem>
            {meiList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Juni
            </CListGroupItem>
            {junList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Juli
            </CListGroupItem>
            {julList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Agustus
            </CListGroupItem>
            {aguList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              September
            </CListGroupItem>
            {sepList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Oktober
            </CListGroupItem>
            {oktList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              November
            </CListGroupItem>
            {novList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Desember
            </CListGroupItem>
            {desList}
          </CListGroup>
        </CCol>
      </CRow>
    )
  }

  return (
    <>
      <h1 className="text-center mb-3">Hari Libur</h1>
      <div className="row justify-content-md-center">
        <CCol lg="2" md="4" className="mb-4">
          <SelectTahun
            setSelect={(id) => setTahun(id)}
            end={2020}
            start={date.getFullYear() + 1}
            tahun={Number(tahun)}
          />
        </CCol>
      </div>
      {liburList}
    </>
  )
}

export default HariLibur
