import React, { useContext, useEffect, useState } from 'react'
import { CAlert, CButton, CCol, CRow, CTable } from '@coreui/react-pro'
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

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_KEHADIRAN_API_URL + '/pegawai/' + loginId + '/uang-makan', {
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
    navigate('/keuangan/uang-makan/' + id)
  }

  const columns = [
    {
      key: 'bulan',
      // label: '#',
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
      _cellProps: { id: { scope: 'row' }, bulan: { colSpan: 3 } },
    }
    items.push(item)
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
            tahun={tahun}
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
          <p>
            Note: Jumlah hari dihitung dari rekaman kehadiran{' '}
            <strong>DATANG sebelum pukul 12:00 WIB.</strong>
          </p>
        </>
      )}
    </>
  )
}

export default UangMakan
