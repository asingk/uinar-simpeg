import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { CAlert, CButton, CSpinner } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilArrowThickLeft, cilWarning } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { KeycloakContext } from 'src/context'
import { namaBulan } from 'src/utils'
import dayjs from 'dayjs'

const RincianGaji = () => {
  console.debug('rendering... RincianGaji')

  const [dataGaji, setDataGaji] = useState()
  const [errorGaji, setErrorGaji] = useState('')
  const [loading, setLoading] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()
  const keycloak = useContext(KeycloakContext)

  useEffect(() => {
    setLoading(true)
    setErrorGaji('')
    axios
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/gaji-pegawai/${id}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then(function (response) {
        // handle success
        setDataGaji(response.data)
      })
      .catch(function (error) {
        // handle error
        // console.log(error)
        if (error.response) {
          // console.log(error.response.data)
          setErrorGaji(error.response.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  // Create our number formatter.
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  })

  let gaji
  if (loading) {
    gaji = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (errorGaji) {
    gaji = (
      <CAlert color="warning" className="d-flex align-items-center">
        <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>{errorGaji.message}</div>
      </CAlert>
    )
  } else {
    gaji = (
      <>
        <hr />
        <h4>Penghasilan</h4>
        <dl className="row">
          <dt className="col-sm-3">Gaji Pokok</dt>
          <dd className="col-sm-9">{formatter.format(dataGaji?.gajiPokok)}</dd>

          {dataGaji?.tunjanganIstri > 0 && (
            <>
              <dt className="col-sm-3">Tunjangan Istri</dt>
              <dd className="col-sm-9">{formatter.format(dataGaji.tunjanganIstri)}</dd>
            </>
          )}

          {dataGaji?.tunjanganAnak > 0 && (
            <>
              <dt className="col-sm-3">Tunjangan Anak</dt>
              <dd className="col-sm-9">{formatter.format(dataGaji.tunjanganAnak)}</dd>
            </>
          )}

          {dataGaji?.tunjanganUmum > 0 && (
            <>
              <dt className="col-sm-3">Tunjangan Umum</dt>
              <dd className="col-sm-9">{formatter.format(dataGaji.tunjanganUmum)}</dd>
            </>
          )}

          {dataGaji?.tunjanganStruktural > 0 && (
            <>
              <dt className="col-sm-3">Tunjangan Struktural</dt>
              <dd className="col-sm-9">{formatter.format(dataGaji.tunjanganStruktural)}</dd>
            </>
          )}

          {dataGaji?.tunjanganFungsional > 0 && (
            <>
              <dt className="col-sm-3">Tunjangan Fungsional</dt>
              <dd className="col-sm-9">{formatter.format(dataGaji.tunjanganFungsional)}</dd>
            </>
          )}

          <dt className="col-sm-3">Tunjangan Beras</dt>
          <dd className="col-sm-9">{formatter.format(dataGaji?.tunjanganBeras)}</dd>

          {dataGaji?.tunjanganPajak > 0 && (
            <>
              <dt className="col-sm-3">Tunjangan Pajak</dt>
              <dd className="col-sm-9">{formatter.format(dataGaji.tunjanganPajak)}</dd>
            </>
          )}

          {dataGaji?.pembulatan > 0 && (
            <>
              <dt className="col-sm-3">Pembulatan</dt>
              <dd className="col-sm-9">{formatter.format(dataGaji.pembulatan)}</dd>
            </>
          )}
        </dl>
        <hr />
        <h4>Potongan</h4>
        <dl className="row">
          {dataGaji?.iwp > 0 && (
            <>
              <dt className="col-sm-3">IWP</dt>
              <dd className="col-sm-9">{formatter.format(dataGaji?.iwp)}</dd>
            </>
          )}

          {dataGaji?.pph > 0 && (
            <>
              <dt className="col-sm-3">PPH</dt>
              <dd className="col-sm-9">{formatter.format(dataGaji.pph)}</dd>
            </>
          )}

          <dt className="col-sm-3">BPJS</dt>
          <dd className="col-sm-9">{formatter.format(dataGaji?.bpjs)}</dd>
        </dl>
        <hr />
        <dl className="row">
          <dt className="col-sm-3 text-truncate">Gaji Bersih</dt>
          <dt className="col-sm-9">{formatter.format(dataGaji?.netto)}</dt>
        </dl>
        <hr />
      </>
    )
  }
  return (
    <>
      <h1 className="display-6 text-center">
        Gaji {namaBulan(dataGaji?.bulan)} {dataGaji?.tahun}
      </h1>
      <CButton className="mb-3" color="secondary" onClick={() => navigate('/keuangan/gaji')}>
        <CIcon icon={cilArrowThickLeft} />
      </CButton>
      {gaji}
      {dataGaji?.createdDate && (
        <div className="text-center mt-3 text-muted">
          <small>
            Diunggah oleh {dataGaji.createdBy} pada{' '}
            {dayjs(dataGaji.createdDate).format('DD/MM/YYYY HH:mm')}
          </small>
        </div>
      )}
      <p className="text-center">Jika terdapat perbedaan data, silahkan hubungi bagian keuangan.</p>
    </>
  )
}

export default RincianGaji
