import React, { useContext, useEffect, useState } from 'react'
import { CAlert, CButton, CCol, CRow, CSpinner, CTable } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilBug, cilSearch } from '@coreui/icons'
import SelectTahun from '../../components/SelectTahun'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { KeycloakContext } from 'src/context'

const Remun = () => {
  console.debug('rendering... Remun')

  const date = new Date()
  const [tahun, setTahun] = useState(date.getFullYear())
  const [data, setData] = useState([])
  const [selisihData, setSelisihData] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    const config = {
      params: { tahun: tahun },
      headers: { Authorization: `Bearer ${keycloak.token}` },
    }

    const requestRemun = axios.get(
      `${import.meta.env.VITE_SIMPEG_REST_URL}/pegawai/${loginId}/remun`,
      config,
    )
    const requestSelisih = axios.get(
      `${import.meta.env.VITE_SIMPEG_REST_URL}/pegawai/${loginId}/selisih-remun`,
      config,
    )

    Promise.all([requestRemun, requestSelisih])
      .then(function (responses) {
        setData(responses[0].data.remun || [])
        setSelisihData(responses[1].data.selisihRemun || [])
      })
      .catch(function (error) {
        setError('Ooopsss... terjadi kesalahan!')
        if (error.response) {
          setError(error.response.data)
        }
      })
      .finally(function () {
        setLoading(false)
      })
  }, [loginId, tahun, keycloak.token])

  const onDetail = (id) => {
    navigate('/keuangan/remun/' + id)
  }

  const onDetailSelisih = (id) => {
    navigate('/keuangan/selisih-remun/' + id)
  }

  let table

  const columns = [
    {
      key: 'bulan',
      label: 'Bulan',
      _props: { scope: 'col' },
    },
    {
      key: 'p1',
      label: 'P1',
      _props: { scope: 'col' },
    },
    {
      key: 'p2',
      label: 'P2',
      _props: { scope: 'col' },
    },
    {
      key: 'bruto',
      label: 'Bruto',
      _props: { scope: 'col' },
    },
    {
      key: 'pphRupiah',
      label: 'PPh',
      _props: { scope: 'col' },
    },
    {
      key: 'netto',
      label: 'Netto',
      _props: { scope: 'col' },
    },
    {
      key: 'aksi',
      label: '',
      _props: { scope: 'col' },
    },
  ]

  const selisihColumns = [
    {
      key: 'bulan',
      label: 'Bulan',
      _props: { scope: 'col' },
    },
    {
      key: 'periode',
      label: 'Periode',
      _props: { scope: 'col' },
    },
    {
      key: 'volume',
      label: 'Volume',
      _props: { scope: 'col' },
    },
    {
      key: 'bruto',
      label: 'Bruto',
      _props: { scope: 'col' },
    },
    {
      key: 'pphRupiah',
      label: 'PPh',
      _props: { scope: 'col' },
    },
    {
      key: 'netto',
      label: 'Netto',
      _props: { scope: 'col' },
    },
    {
      key: 'aksi',
      label: '',
      _props: { scope: 'col' },
    },
  ]

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const items = []
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const item = {
        bulan: data[i].bulan,
        p1: formatCurrency(data[i].p1),
        p2: formatCurrency(data[i].p2),
        bruto: formatCurrency(data[i].bruto),
        pphRupiah: formatCurrency(data[i].pphRupiah),
        netto: formatCurrency(data[i].netto),
        aksi: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton color="info" variant="outline" size="sm" onClick={() => onDetail(data[i].id)}>
              <CIcon icon={cilSearch} />
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
      _cellProps: { id: { scope: 'row' }, bulan: { colSpan: 7 } },
    }
    items.push(item)
  }

  const selisihItems = []
  if (selisihData.length > 0) {
    for (let i = 0; i < selisihData.length; i++) {
      const item = {
        bulan: selisihData[i].bulan,
        periode: selisihData[i].periode,
        volume: selisihData[i].volume,
        bruto: formatCurrency(selisihData[i].bruto),
        pphRupiah: formatCurrency(selisihData[i].pphRupiah),
        netto: formatCurrency(selisihData[i].netto),
        aksi: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton
              color="info"
              variant="outline"
              size="sm"
              onClick={() => onDetailSelisih(selisihData[i].id)}
            >
              <CIcon icon={cilSearch} />
            </CButton>
          </div>
        ),
        _cellProps: { id: { scope: 'row' } },
      }
      selisihItems.push(item)
    }
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
    table = (
      <>
        <CTable responsive striped columns={columns} items={items} className="mb-4 mt-2" />
        {selisihData.length > 0 && (
          <>
            <h4 className="mt-5 mb-3">Selisih Remunerasi</h4>
            <CTable
              responsive
              striped
              columns={selisihColumns}
              items={selisihItems}
              className="mb-4 mt-2"
            />
          </>
        )}
      </>
    )
  }

  return (
    <>
      <h1 className="text-center mb-3">Remunerasi</h1>
      <CRow className="mb-4 justify-content-center">
        <CCol md="3">
          <SelectTahun
            setSelect={(id) => setTahun(id)}
            end={2024}
            start={date.getFullYear()}
            tahun={Number(tahun)}
          />
        </CCol>
      </CRow>
      {table}
    </>
  )
}

export default Remun
