import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react-pro'
import { cilUser, cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar3 from './../../assets/images/avatars/3.jpg'
import { KeycloakContext } from 'src/context'

const AppHeaderDropdown = () => {
  const { t } = useTranslation()
  const keycloak = useContext(KeycloakContext)
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
    </CDropdown>
  )
}

export default AppHeaderDropdown
