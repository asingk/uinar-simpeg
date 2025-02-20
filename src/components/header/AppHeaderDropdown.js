import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CAvatar,
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormCheck,
  CModal,
  CModalBody,
  CModalFooter,
} from '@coreui/react-pro'
import { cilUser, cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar3 from './../../assets/images/avatars/3.jpg'
import { KeycloakContext } from 'src/context'
import { gql, useQuery } from '@apollo/client'
import axios from 'axios'

const GET_PEGAWAI_POPUP = gql`
  query PegawaiProfilHeaderDropDown($id: ID!) {
    pegawai(id: $id) {
      statusPegawai {
        id
        nama
      }
      jenisJabatan
    }
  }
`

const AppHeaderDropdown = () => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(true)
  const [welcome, setWelcome] = useState({})
  const [isStatusPegawai, setIsStatusPegawai] = useState(false)
  const [isJenisJabatan, setIsJenisJabatan] = useState(false)

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  const { data } = useQuery(GET_PEGAWAI_POPUP, {
    variables: { id: loginId },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/pengumuman/active`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then(function (response) {
        // handle success
        // console.log(response.data)
        if (response.data) {
          // setAppsItems(response?.data)
          // if (!response.data.some((app) => app.id === 'simpeg')) navigate('/500')
          // const simpegApp = response.data.find((app) => app.id === 'simpeg')
          // const welcomeSimpeg = simpegApp.welcome.find((row) => row.isActive)
          // if (response.data) {
          setWelcome(response.data)
          setIsStatusPegawai(
            response.data.statusPegawai.some((row) => row.id === data?.pegawai.statusPegawai.id),
          )
          setIsJenisJabatan(response.data.jenisJabatan.includes(data?.pegawai.jenisJabatan))
          // }
        }
      })
      .catch(function (error) {
        // handle error
        // console.log(error)
      })
      .finally(function () {
        // always executed
      })
  }, [data])

  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle className="py-0" caret={false}>
        <CAvatar src={avatar3} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold rounded-top mb-2">
          {t('account')}
        </CDropdownHeader>
        <CDropdownItem
          href={
            import.meta.env.VITE_KEYCLOAK_URL +
            '/realms/' +
            import.meta.env.VITE_KEYCLOAK_REALM +
            '/account/'
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <CIcon icon={cilUser} className="me-2" />
          {t('Akun SSO')}
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={() => keycloak.logout()}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          {t('logout')}
        </CDropdownItem>
      </CDropdownMenu>
      {welcome &&
        localStorage.getItem(welcome.id) !== 'true' &&
        isStatusPegawai &&
        isJenisJabatan && (
          <CModal
            alignment="center"
            size="xl"
            backdrop="static"
            visible={visible}
            onClose={() => setVisible(false)}
          >
            <CModalBody>
              <div dangerouslySetInnerHTML={{ __html: welcome.message }}></div>
              <CFormCheck
                className="mt-3"
                id="flexCheckDefault"
                label="Jangan tampilkan lagi"
                onClick={() => localStorage.setItem(welcome.id, 'true')}
              />
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Tutup
              </CButton>
            </CModalFooter>
          </CModal>
        )}
    </CDropdown>
  )
}

export default AppHeaderDropdown
