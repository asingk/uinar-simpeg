import React, { useContext, useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCol,
  CFormLabel,
  CFormSelect,
  CPopover,
  CRow,
  CSmartPagination,
  CSpinner,
  CTable,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilFile, cilPlus } from '@coreui/icons'
import axios from 'axios'
import dayjs from 'dayjs'
import BatalkanIzinModal from '../../components/kehadiran/BatalkanIzinModal'
import TambahIzinModal from '../../components/kehadiran/TambahIzinModal'
import { KeycloakContext } from 'src/context'

const Izin = () => {
  console.debug('rendering... Izin')

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [size, setSize] = useState(10)
  const [data, setData] = useState([])
  const [toggle, setToggle] = useState(false)
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [isOpenBatalModal, setIsOpenbatalModal] = useState(false)
  const [id, setId] = useState()
  const [isAdd, setIsAdd] = useState(false)

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/usul-izin`, {
        params: {
          size: size,
          page: currentPage - 1,
          idPegawai: loginId,
        },
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then((response) => {
        setCurrentPage(response.data.page.number + 1)
        setTotalPages(response.data.page.totalPages)
        setTotalElements(response.data.page.totalElements)
        if (response.data.page.totalElements > 0) setData(response.data._embedded.usulIzinModelList)
      })
      .catch((error) => {
        setError(error)
      })
      .then(() => {
        setLoading(false)
      })
  }, [currentPage, loginId, size, toggle])

  const onBatal = (id) => {
    setId(id)
    setIsOpenbatalModal(true)
  }

  const getStatusAksi = (data) => {
    switch (data.status) {
      case 0:
        return (
          <>
            <div className="badge bg-warning text-wrap" style={{ width: '6rem' }}>
              Diproses
            </div>
            <br />
            <span
              className="text-secondary"
              style={{ cursor: 'pointer' }}
              onClick={() => onBatal(data.id)}
            >
              <small>
                <u>Batalkan?</u>
              </small>
            </span>
          </>
        )
      case 1:
        return (
          <div className="badge bg-success text-wrap" style={{ width: '6rem' }}>
            Disetujui
          </div>
        )
      case 2:
        return (
          <>
            <div className="badge bg-danger text-wrap" style={{ width: '6rem' }}>
              Ditolak
            </div>
            <br />
            <CPopover title="Alasan Ditolak" content={data.ket} placement="right">
              <span className="text-danger" style={{ cursor: 'pointer' }}>
                <small>
                  <u>Lihat Alasan</u>
                </small>
              </span>
            </CPopover>
          </>
        )
      default:
        return (
          <div className="badge bg-secondary text-wrap" style={{ width: '6rem' }}>
            Dibatalkan
          </div>
        )
    }
  }

  const columns = [
    {
      key: 'no',
      label: '#',
      _props: { scope: 'col' },
    },
    {
      key: 'jenis',
      label: 'Jenis Cuti/DL',
      _props: { scope: 'col' },
    },
    {
      key: 'tanggal',
      label: 'Tanggal',
      _props: { scope: 'col' },
    },
    {
      key: 'createdDate',
      label: 'Pengajuan',
      _props: { scope: 'col' },
    },
    {
      key: 'file',
      label: 'File',
      _props: { scope: 'col' },
    },
    {
      key: 'status',
      label: '',
      _props: { scope: 'col' },
    },
  ]
  let items = []
  if (totalElements > 0) {
    const startNo = (currentPage - 1) * size
    for (let i = 0; i < data.length; i++) {
      const item = {
        no: startNo + i + 1,
        jenis: data[i].izinCategoryDesc,
        tanggal:
          dayjs(data[i].startDate).format('D/M/YYYY') +
          (data[i].endDate ? ' - ' + dayjs(data[i].endDate).format('D/M/YYYY') : ''),
        createdDate: data[i].createdDate ? dayjs(data[i].createdDate).format('D/M/YYYY') : '',
        file: (
          <CButton
            color="info"
            variant="outline"
            size="sm"
            href={data[i].file}
            target="_blank"
            rel="noreferrer"
          >
            <CIcon icon={cilFile} />
          </CButton>
        ),
        status: getStatusAksi(data[i]),
        _cellProps: { id: { scope: 'row' } },
      }
      items.push(item)
    }
  } else {
    const item = {
      tanggal: 'Tidak ada data',
      _cellProps: { id: { scope: 'row' }, tanggal: { colSpan: 7 } },
    }
    items.push(item)
  }
  let table

  if (loading) {
    table = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    table = <CAlert color="danger">Error: {error}</CAlert>
  } else {
    table = <CTable columns={columns} items={items} responsive />
  }
  return (
    <div className="mb-3">
      <h1 className="text-center">Cuti/DL</h1>
      <CAlert color="warning">
        Pengajuan dan upload Surat Tugas (Dinas Luar) dan Formulir Cuti dan lampiran (sesuai dengan
        jenis cuti yang diajukan) pada Aplikasi simpeg.ar-raniry.ac.id paling lambat tanggal 5 bulan
        berikutnya. Karena setelah lewat tanggal tersebut, pengajuan tidak dapat diproses lebih
        lanjut.
      </CAlert>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
        <CButton color="primary" onClick={() => setIsAdd(true)}>
          <CIcon icon={cilPlus} /> Tambah Cuti/DL
        </CButton>
      </div>
      {table}
      <CRow className="justify-content-between">
        <CCol md={6}>
          <CSmartPagination
            activePage={currentPage}
            pages={totalPages}
            onActivePageChange={setCurrentPage}
          />
        </CCol>
        <CCol xs={6} md={4} lg={3}>
          <CRow>
            <CFormLabel
              htmlFor="colFormLabelSm"
              className="col-md-7 col-form-label col-form-label-sm"
            >
              Item per halaman:
            </CFormLabel>
            <CCol md={5}>
              <CFormSelect
                aria-label="Default select example"
                options={[
                  { label: '5', value: '5' },
                  { label: '10', value: '10' },
                  { label: '20', value: '20' },
                  { label: '50', value: '50' },
                ]}
                defaultValue={size}
                onChange={(e) => setSize(Number(e.target.value))}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <p className="mt-3">
        <a
          href={import.meta.env.VITE_CDN_URL + '/simpeg/form_baru_cuti.docx'}
          target="_blank"
          rel="noreferrer"
        >
          Download form cuti
        </a>
      </p>
      {isOpenBatalModal && (
        <BatalkanIzinModal
          id={id}
          visible={isOpenBatalModal}
          setVisible={setIsOpenbatalModal}
          done={() => {
            setToggle(!toggle)
            setIsOpenbatalModal(false)
          }}
        />
      )}
      {isAdd && (
        <TambahIzinModal
          setVisible={setIsAdd}
          visible={isAdd}
          done={() => {
            setToggle(!toggle)
            setIsAdd(false)
          }}
        />
      )}
    </div>
  )
}

export default Izin
