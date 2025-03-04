import React, { useContext, useEffect, useState } from 'react'
import { CAlert, CButton, CCol, CRow, CSpinner, CTable } from '@coreui/react-pro'
import SelectTahun from '../../components/SelectTahun'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilBug, cilPaw } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { KeycloakContext } from 'src/context'

const UangMakan = () => {
  console.debug('rendering... UangMakan')

  const date = new Date()

  const [tahun, setTahun] = useState(date.getFullYear())
  const [data, setData] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/pegawai/${loginId}/uang-makan`, {
        params: {
          tahun: tahun,
        },
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then(function (response) {
        // handle success
        setData(response.data.uangMakan)
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

  const onDetail = (id) => {
    navigate('/keuangan/uang-makan/' + id)
  }

  const columns = [
    {
      key: 'bulan',
      _props: { scope: 'col' },
    },
    {
      key: 'jumlahHari',
      _props: { scope: 'col' },
    },
    {
      key: 'aksi',
      label: '',
      _props: { scope: 'col' },
    },
  ]

  let table

  const items = []
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const item = {
        bulan: data[i].bulan,
        jumlahHari: data[i].jumlahHari,
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
      _cellProps: { id: { scope: 'row' }, bulan: { colSpan: 4 } },
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
      <CAlert color="danger" className="d-flex align-items-center">
        <CIcon icon={cilBug} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>{error}</div>
      </CAlert>
    )
  } else {
    table = <CTable responsive striped columns={columns} items={items} className="mb-4 mt-2" />
  }

  return (
    <>
      <h1 className="text-center mb-3">Uang Makan</h1>
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
      <p>
        Note: Jumlah hari dihitung dari rekaman kehadiran{' '}
        <strong>DATANG sebelum pukul 12:00 WIB.</strong>
      </p>
    </>
  )
}

export default UangMakan
