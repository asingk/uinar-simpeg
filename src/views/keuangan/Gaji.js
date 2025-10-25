import React, { useContext, useEffect, useState } from 'react'
import { CAlert, CButton, CCol, CRow, CSpinner, CTable } from '@coreui/react-pro'
import SelectTahun from '../../components/SelectTahun'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilBug, cilPaw } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { KeycloakContext } from 'src/context'

const Gaji = () => {
  console.debug('rendering... Gaji')

  const date = new Date()

  const [tahun, setTahun] = useState(date.getFullYear())
  const [data, setData] = useState([])
  const [dataPotongan, setDataPotongan] = useState([])
  const [error, setError] = useState('')
  const [errorPotongan, setErrorPotongan] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingPotongan, setLoadingPotongan] = useState(false)

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/pegawai/${loginId}/gaji`, {
        params: {
          tahun: tahun,
        },
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then(function (response) {
        // handle success
        setData(response.data.gajiPegawai)
      })
      .catch(function (error) {
        // handle error
        // console.log(error)
        setError('Ooopsss... terjadi kesalahan!')
        if (error.response) {
          // console.log(error.response.data)
          setError(error.response.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [loginId, tahun])

  useEffect(() => {
    setLoadingPotongan(true)
    axios
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/pegawai/${loginId}/potongan-gaji`, {
        params: {
          tahun: tahun,
        },
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then(function (response) {
        // handle success
        setDataPotongan(response.data.potonganGajiPegawai)
      })
      .catch(function (error) {
        // handle error
        setErrorPotongan('Ooopsss... terjadi kesalahan!')
        if (error.response) {
          setErrorPotongan(error.response.data)
        }
      })
      .finally(() => {
        setLoadingPotongan(false)
      })
  }, [loginId, tahun])

  // Create our number formatter.
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  })

  const onDetail = (id) => {
    navigate('/keuangan/gaji/' + id)
  }

  const onDetailPotongan = (id) => {
    navigate('/keuangan/potongan-gaji-pegawai/' + id)
  }

  const columns = [
    {
      key: 'bulan',
      _props: { scope: 'col' },
    },
    {
      key: 'gajiPokok',
      label: 'Gaji Pokok',
      _props: { scope: 'col' },
    },
    {
      key: 'gajiBersih',
      label: 'Gaji Bersih',
      _props: { scope: 'col' },
    },
    {
      key: 'aksi',
      label: '',
      _props: { scope: 'col' },
    },
  ]

  const columnsPotongan = [
    {
      key: 'bulan',
      _props: { scope: 'col' },
    },
    {
      key: 'jumlahPotongan',
      label: 'Potongan',
      _props: { scope: 'col' },
    },
    {
      key: 'jumlahSetelahDipotong',
      label: 'Gaji yang Diterima',
      _props: { scope: 'col' },
    },
    {
      key: 'aksi',
      label: '',
      _props: { scope: 'col' },
    },
  ]

  let table
  let tablePotongan

  const items = []
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const item = {
        bulan: data[i].bulan,
        gajiPokok: formatter.format(data[i]?.gajiPokok),
        gajiBersih: formatter.format(data[i]?.netto),
        aksi: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton
              color="success"
              variant="outline"
              size="sm"
              onClick={() => onDetail(data[i].id)}
            >
              <CIcon icon={cilPaw} />
            </CButton>
          </div>
        ),
        _cellProps: { id: { scope: 'row' } },
      }
      items.push(item)
    }
  } else {
    const item = {
      bulan: 'Tidak ada data',
      _cellProps: { id: { scope: 'row' }, bulan: { colSpan: 3 } },
    }
    items.push(item)
  }

  const itemsPotongan = []
  if (dataPotongan.length > 0) {
    for (let i = 0; i < dataPotongan.length; i++) {
      const item = {
        bulan: dataPotongan[i].bulan,
        jumlahPotongan: formatter.format(dataPotongan[i]?.jumlahPotongan || 0),
        jumlahSetelahDipotong: formatter.format(dataPotongan[i]?.thp || 0),
        aksi: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton
              color="success"
              variant="outline"
              size="sm"
              onClick={() => onDetailPotongan(dataPotongan[i].id)}
            >
              <CIcon icon={cilPaw} />
            </CButton>
          </div>
        ),
        _cellProps: { id: { scope: 'row' } },
      }
      itemsPotongan.push(item)
    }
  } else {
    const item = {
      bulan: 'Tidak ada data',
      _cellProps: { id: { scope: 'row' }, bulan: { colSpan: 4 } },
    }
    itemsPotongan.push(item)
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
      <CAlert color="danger" className="d-flex align-items-center">
        <CIcon icon={cilBug} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>{error}</div>
      </CAlert>
    )
  } else {
    table = <CTable responsive striped columns={columns} items={items} className="mb-4 mt-2" />
  }

  if (loadingPotongan) {
    tablePotongan = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (errorPotongan) {
    tablePotongan = (
      <CAlert color="danger" className="d-flex align-items-center">
        <CIcon icon={cilBug} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>{errorPotongan}</div>
      </CAlert>
    )
  } else {
    tablePotongan = (
      <CTable
        responsive
        striped
        columns={columnsPotongan}
        items={itemsPotongan}
        className="mb-4 mt-2"
      />
    )
  }

  return (
    <>
      <h1 className="text-center mb-3">Gaji</h1>
      <CRow className="mb-4 justify-content-center">
        <CCol md="3">
          <SelectTahun
            setSelect={(id) => setTahun(id)}
            end={2025}
            start={date.getFullYear()}
            tahun={Number(tahun)}
          />
        </CCol>
      </CRow>
      {table}

      <h2 className="text-center mb-3 mt-5">Potongan Unit Gaji</h2>
      {tablePotongan}
    </>
  )
}

export default Gaji
