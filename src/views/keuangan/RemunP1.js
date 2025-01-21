import React, { useContext, useEffect, useState } from 'react'
import { CAlert, CButton, CCol, CRow, CTable } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilBug, cilPaw } from '@coreui/icons'
import SelectTahun from '../../components/SelectTahun'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { KeycloakContext } from 'src/context'

const RemunP1 = () => {
  console.debug('rendering... RemunP1')

  const date = new Date()
  const [tahun, setTahun] = useState(date.getFullYear())
  const [data, setData] = useState([])
  const [error, setError] = useState('')
  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_KEHADIRAN_API_URL + '/pegawai/' + loginId + '/remun', {
        params: {
          tahun: tahun,
        },
      })
      .then(function (response) {
        // handle success
        setData(response.data)
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
      .finally(function () {
        // always executed
      })
  }, [loginId, tahun])

  const onDetail = (id) => {
    navigate('/keuangan/remun-p1/' + id)
  }

  const columns = [
    {
      key: 'bulan',
      // label: '#',
      _props: { scope: 'col' },
    },
    {
      key: 'd1',
      label: 'TD-30',
      _props: { scope: 'col' },
    },
    {
      key: 'd2',
      label: 'TD-60',
      _props: { scope: 'col' },
    },
    {
      key: 'd3',
      label: 'TD-90',
      _props: { scope: 'col' },
    },
    {
      key: 'd4',
      label: 'TD',
      _props: { scope: 'col' },
    },
    {
      key: 'p1',
      label: 'CP-30',
      _props: { scope: 'col' },
    },
    {
      key: 'p2',
      label: 'CP-60',
      _props: { scope: 'col' },
    },
    {
      key: 'p3',
      label: 'CP-90',
      _props: { scope: 'col' },
    },
    {
      key: 'p4',
      label: 'TP',
      _props: { scope: 'col' },
    },
    {
      key: 'persenPotongan',
      label: 'Total Potongan (%)',
      _props: { scope: 'col' },
    },
    {
      key: 'aksi',
      label: '',
      _props: { scope: 'col' },
    },
  ]

  const items = []
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const item = {
        bulan: data[i].bulan,
        d1: data[i].d1,
        d2: data[i].d2,
        d3: data[i].d3,
        d4: data[i].d4,
        p1: data[i].p1,
        p2: data[i].p2,
        p3: data[i].p3,
        p4: data[i].p4,
        persenPotongan: data[i].persenPotongan,
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
      _cellProps: { id: { scope: 'row' }, bulan: { colSpan: 11 } },
    }
    items.push(item)
  }

  return (
    <>
      <h1 className="text-center mb-3">Remun P1</h1>
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
      {error ? (
        <CAlert color="danger" className="d-flex align-items-center">
          <CIcon icon={cilBug} className="flex-shrink-0 me-2" width={24} height={24} />
          <div>{error}</div>
        </CAlert>
      ) : (
        <>
          <CTable responsive columns={columns} items={items} className="mb-3" />
          <p>Note:</p>
          <ul className="list-unstyled">
            <li>TD-30: Telat datang hingga 30 menit, potongan sebesar 0,5%.</li>
            <li>TD-60: Telat datang hingga 60 menit, potongan sebesar 1%.</li>
            <li>TD-90: Telat datang hingga 90 menit, potongann sebesar 1,25%.</li>
            <li>TD: Tidak datang atau telat datang di atas 90 menit, potongan sebesar 1,5%.</li>
            <li>CP-30: Cepat pulang hingga 30 menit, potongan sebesar 0,5%.</li>
            <li>CP-60: Cepat pulang hingga 60 menit, potongan sebesar 1%.</li>
            <li>CP-90: Cepat pulang hingga 90 menit, potongann sebesar 1,25%.</li>
            <li>TP: Tidak pulang atau cepat pulang di atas 90 menit, potongan sebesar 1,5%.</li>
          </ul>
        </>
      )}
    </>
  )
}

export default RemunP1
