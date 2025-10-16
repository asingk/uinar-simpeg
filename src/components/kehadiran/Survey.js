import React, { useState, useContext, useEffect } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
  CCardText,
  CAlert,
  CLoadingButton,
  CSpinner,
  CFormCheck,
} from '@coreui/react-pro'
import axios from 'axios'
import { KeycloakContext } from 'src/context'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'

const Survey = ({ onSubmitSuccess, onNoSurvey }) => {
  const keycloak = useContext(KeycloakContext)
  const [selectedOption, setSelectedOption] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSurvey, setLoadingSurvey] = useState(true)
  const [error, setError] = useState('')
  const [surveyData, setSurveyData] = useState(null)

  const loginId = keycloak.idTokenParsed?.preferred_username

  useEffect(() => {
    const fetchTodaySurvey = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SIMPEG_REST_URL}/survey/findToday`,
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          },
        )
        setSurveyData(response.data)
        setError('')
      } catch (err) {
        if (err.response?.status === 404) {
          // Jika tidak ada survey, langsung panggil callback onNoSurvey
          if (onNoSurvey) {
            onNoSurvey()
          }
        } else {
          setError(err.response?.data?.message || 'Gagal memuat survey')
        }
        setSurveyData(null)
      } finally {
        setLoadingSurvey(false)
      }
    }

    fetchTodaySurvey()
  }, [keycloak.token, onNoSurvey])

  const handleSubmit = async () => {
    if (!selectedOption) {
      setError('Silakan pilih salah satu jawaban')
      return
    }

    if (!surveyData?.id) {
      setError('Survey tidak ditemukan')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new URLSearchParams()
      formData.append('answer', selectedOption)

      await axios.post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/pegawai/${loginId}/survey/${surveyData.id}/answer`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )

      setLoading(false)
      onSubmitSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim jawaban survey')
      setLoading(false)
    }
  }

  if (loadingSurvey) {
    return (
      <CCard className="text-center">
        <CCardBody>
          <CSpinner color="primary" />
          <p className="mt-2">Memuat survey...</p>
        </CCardBody>
      </CCard>
    )
  }

  if (!surveyData) {
    return null
  }

  return (
    <>
      <CAlert color="warning" className="d-flex align-items-center">
        <CIcon icon={cilInfo} className="flex-shrink-0 me-2" width={24} />
        <div>
          <strong>Perhatian!</strong> Anda wajib menjawab pernyataan di bawah ini sebelum melakukan
          absen pulang.
        </div>
      </CAlert>
      <CCard className="text-center">
        <CCardHeader className="bg-info text-white">Pernyataan</CCardHeader>
        <CCardBody>
          <CCardTitle className="mb-4">{surveyData.question}</CCardTitle>
          <CCardText className="text-muted small mb-4">
            Tanggal: {new Date(surveyData.tanggal).toLocaleDateString('id-ID')}
          </CCardText>

          <div className="mb-4 text-start">
            {surveyData.options?.map((option) => (
              <CFormCheck
                key={option.option}
                type="radio"
                name="surveyOption"
                id={`option-${option.option}`}
                label={
                  <span>
                    <strong>{option.option}.</strong> {option.text}
                  </span>
                }
                value={option.option}
                checked={selectedOption === option.option}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mb-3 p-3 border rounded"
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>

          <CLoadingButton
            color="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading || !selectedOption}
            className="px-4"
          >
            Kirim Jawaban
          </CLoadingButton>
        </CCardBody>
      </CCard>
      {error && (
        <CAlert className="mt-2" color="danger">
          {error}
        </CAlert>
      )}
    </>
  )
}

Survey.propTypes = {
  onSubmitSuccess: PropTypes.func.isRequired,
  onNoSurvey: PropTypes.func,
}

export default Survey
