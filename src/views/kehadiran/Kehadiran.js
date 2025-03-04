import React, { useState, useContext, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import axios from 'axios'
import { CAlert, CCol, CRow } from '@coreui/react-pro'
import Laporan from '../../components/kehadiran/Laporan'
import Tombol from '../../components/kehadiran/Tombol'
import SelectBulanTahunKehadiran from '../../components/kehadiran/SelectBulanTahunKehadiran'
import { KeycloakContext } from 'src/context'

const GET_PEGAWAI_PROFIL = gql`
  query PegawaiProfil($id: ID!) {
    pegawai(id: $id) {
      id
      nama
      jabatanSaatIni {
        id
        level {
          id
          nama
          jabatan {
            id
            nama
          }
        }
        sublevel {
          id
          nama
        }
        grade {
          id
          remun
        }
      }
      unitKerjaSaatIni {
        id
        unitKerja {
          id
          nama
        }
        bagian {
          id
          nama
        }
        subbag {
          id
          nama
        }
        posisi {
          id
          nama
        }
        grade {
          id
          remun
        }
        isSecondary
      }
      jenisJabatan
    }
  }
`

const Kehadiran = () => {
  console.debug('rendering... Kehadiran')

  const date = new Date()
  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  const [bulan, setBulan] = useState(date.getMonth() + 1)
  const [tahun, setTahun] = useState(date.getFullYear())
  const [refreshLaporan, toggleRefreshLaporan] = useState(true)
  const [data, setData] = useState()
  const [seninKamis, setSeninKamis] = useState()
  const [jumat, setJumat] = useState()
  const [error, setError] = useState('')

  useEffect(() => {
    const getStatusSaatIni = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_SIMPEG_REST_URL + '/kehadiran/status-saat-ini',
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          },
        )
        // handle success
        setData(response.data)
        setError(null)
        getJamKerja(response.data)
      } catch (err) {
        setError(err.message)
        setData(null)
      }
    }
    const getJamKerja = async (data) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SIMPEG_REST_URL}/jam-kerja?isRamadhan=${data?.ramadhan}`,
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          },
        )
        // handle success
        response.data?.jamKerja.forEach((element) => {
          if (element.hari === 1) {
            setSeninKamis(element)
          } else if (element.hari === 5) {
            setJumat(element)
          }
        })
        setError(null)
      } catch (err) {
        setError(err.message)
        setData(null)
      }
    }
    if (!data) getStatusSaatIni()
  }, [data, keycloak.token])

  const { data: dataPeg } = useQuery(GET_PEGAWAI_PROFIL, {
    variables: { id: loginId },
  })

  const refreshAction = () => {
    toggleRefreshLaporan(!refreshLaporan)
  }

  const onChangeBulan = (bulan, tahun) => {
    setBulan(Number(bulan))
    setTahun(Number(tahun))
  }

  return (
    <>
      <CRow>
        <CCol className="mb-3">
          <Tombol clicked={refreshAction} status={data?.status} pegawai={dataPeg?.pegawai} />
          {error && <CAlert color="danger">Error: {error}</CAlert>}
        </CCol>
      </CRow>
      <CRow className="my-3 justify-content-center">
        <CCol md="6" lg="3">
          <SelectBulanTahunKehadiran setSelect={(bulan, tahun) => onChangeBulan(bulan, tahun)} />
        </CCol>
      </CRow>
      <CRow className="mb-3">
        <Laporan bulan={bulan} tahun={tahun} refresh={refreshLaporan} />
      </CRow>
      <CRow className="mb-3">
        <h5 className="text-center">Jadwal Kehadiran</h5>
        <CCol xs="6">
          <h6>Senin - Kamis</h6>
          <dl className="row">
            <dt className="col-sm-3">Datang</dt>
            <dd className="col-sm-9">
              {seninKamis?.jamDatangStart.substr(0, 5) +
                ' - ' +
                seninKamis?.jamDatangBatas.substr(0, 5)}
            </dd>
            <dt className="col-sm-3">Pulang</dt>
            <dd className="col-sm-9">
              {seninKamis?.jamPulangBatas.substr(0, 5) +
                ' - ' +
                seninKamis?.jamPulangEnd.substr(0, 5)}
            </dd>
          </dl>
        </CCol>
        <CCol xs="6">
          <h6>Jum&apos;at</h6>
          <dl className="row">
            <dt className="col-sm-3">Datang</dt>
            <dd className="col-sm-9">
              {jumat?.jamDatangStart.substr(0, 5) + ' - ' + jumat?.jamDatangBatas.substr(0, 5)}
            </dd>
            <dt className="col-sm-3">Pulang</dt>
            <dd className="col-sm-9">
              {jumat?.jamPulangBatas.substr(0, 5) + ' - ' + jumat?.jamPulangEnd.substr(0, 5)}
            </dd>
          </dl>
        </CCol>
        {!data?.ramadhan ? (
          <a
            href={import.meta.env.VITE_CDN_URL + '/kehadiran/SE_Jam_Kerja.pdf'}
            target="_blank"
            rel="noreferrer"
          >
            Klik untuk melihat surat edaran jam kerja UIN Ar-Raniry
          </a>
        ) : (
          <a
            href={import.meta.env.VITE_CDN_URL + '/kehadiran/SE_Jam_Kerja_Ramadhan.pdf'}
            target="_blank"
            rel="noreferrer"
          >
            Klik untuk melihat surat edaran jam kerja bulan Ramadhan UIN Ar-Raniry
          </a>
        )}
      </CRow>
    </>
  )
}

export default Kehadiran
