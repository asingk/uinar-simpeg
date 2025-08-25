import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilCarAlt, cilCash, cilFingerprint, cilSitemap, cilUser } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react-pro'
import { Translation } from 'react-i18next'

const _nav = [
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Profil')}</Translation>,
    to: '/profil',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Kehadiran')}</Translation>,
    to: '/kehadiran',
    icon: <CIcon icon={cilFingerprint} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Cuti/DL')}</Translation>,
    to: '/izin',
    icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Keuangan')}</Translation>,
    to: '/keuangan',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Gaji',
        to: '/keuangan/gaji',
      },
      {
        component: CNavItem,
        name: 'Uang Makan',
        to: '/keuangan/uang-makan',
      },
      {
        component: CNavItem,
        name: 'Remun P1',
        to: '/keuangan/remun-p1',
      },
    ],
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Struktur Organisasi')}</Translation>,
    to: '/struktur-org',
    icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Kalender')}</Translation>,
    to: '/kalender',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Hari Libur',
        to: '/kalender/hari-libur',
      },
      {
        component: CNavItem,
        name: 'Ganti Hari Kerja',
        to: '/kalender/ganti-hari-kerja',
      },
    ],
  },
]

export default _nav
