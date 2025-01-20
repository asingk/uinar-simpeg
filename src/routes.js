import React from 'react'
import { Translation } from 'react-i18next'

const Profil = React.lazy(() => import('./views/profil/Profil'))
const Kehadiran = React.lazy(() => import('./views/kehadiran/Kehadiran'))
const UangMakan = React.lazy(() => import('./views/keuangan/UangMakan'))
const RincianUangMakan = React.lazy(() => import('./views/keuangan/RincianUangMakan'))
const RemunP1 = React.lazy(() => import('./views/keuangan/RemunP1'))
const RincianRemunP1 = React.lazy(() => import('./views/keuangan/RincianRemunP1'))
const Izin = React.lazy(() => import('./views/izin/Izin'))
const StrukturOrg = React.lazy(() => import('./views/struktur-org/StrukturSatker'))
const StrukturUker = React.lazy(() => import('./views/struktur-org/StrukturUker'))
const StrukturBag = React.lazy(() => import('./views/struktur-org/StrukturBag'))
const StrukturSubbag = React.lazy(() => import('./views/struktur-org/StrukturSubbag'))
const HariLibur = React.lazy(() => import('./views/kalender/HariLibur'))
const GantiHariKerja = React.lazy(() => import('./views/kalender/GantiHariKerja'))

const routes = [
  { path: '/', exact: true, name: <Translation>{(t) => t('home')}</Translation> },
  {
    path: '/profil',
    name: <Translation>{(t) => t('Profil')}</Translation>,
    element: Profil,
    exact: true,
  },
  {
    path: '/profil/:id',
    name: <Translation>{(t) => t('Profil Pegawai')}</Translation>,
    element: Profil,
    exact: true,
  },
  {
    path: '/kehadiran',
    name: <Translation>{(t) => t('Kehadiran')}</Translation>,
    element: Kehadiran,
  },
  {
    path: '/keuangan',
    name: <Translation>{(t) => t('Keuangan')}</Translation>,
    element: UangMakan,
    exact: true,
  },
  { path: '/keuangan/uang-makan', name: 'Uang Makan', element: UangMakan },
  {
    path: '/keuangan/uang-makan/:id',
    name: 'Rincian Uang Makan',
    element: RincianUangMakan,
    exact: true,
  },
  { path: '/keuangan/remun-p1', name: 'Remun P1', element: RemunP1 },
  {
    path: '/keuangan/remun-p1/:id',
    name: 'Rincian Remun P1',
    element: RincianRemunP1,
    exact: true,
  },
  {
    path: '/izin',
    name: <Translation>{(t) => t('Izin')}</Translation>,
    element: Izin,
  },
  {
    path: '/struktur-org',
    name: <Translation>{(t) => t('Struktur Organisasi')}</Translation>,
    element: StrukturOrg,
    exact: true,
  },
  { path: '/struktur-org/:id', name: 'Struktur Unit Kerja', element: StrukturUker, exact: true },
  {
    path: '/struktur-org/:id/:bagId',
    name: 'Struktur Bagian Unit Kerja',
    element: StrukturBag,
    exact: true,
  },
  {
    path: '/struktur-org/:id/:bagId/:subbagId',
    name: 'Struktur Subbagian Unit Kerja',
    element: StrukturSubbag,
    exact: true,
  },
  {
    path: '/kalender',
    name: <Translation>{(t) => t('Kalender')}</Translation>,
    element: HariLibur,
    exact: true,
  },
  { path: '/kalender/hari-libur', name: 'Hari Libur', element: HariLibur },
  { path: '/kalender/ganti-hari-kerja', name: 'Ganti Hari Kerja', element: GantiHariKerja },
]

export default routes
