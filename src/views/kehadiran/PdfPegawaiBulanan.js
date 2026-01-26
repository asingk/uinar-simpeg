import React, { useContext, useEffect, useState } from 'react'
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { namaBulan } from 'src/utils'
import axios from 'axios'
import { KeycloakContext } from 'src/context'

// Create styles
const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    flexDirection: 'column',
  },
  section: {
    margin: 10,
    padding: 10,
    // flexGrow: 1,
  },
  viewer: {
    width: window.innerWidth, //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  author: {
    fontSize: 12,
  },
  source: {
    fontSize: 10,
    marginTop: 8,
  },
  signature: {
    marginTop: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    width: 60,
  },
  infoValue: {
    flex: 1,
  },
  table: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  header: {
    // textAlign: 'center',
    borderBottom: 2,
    paddingBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
    marginBottom: 2,
    borderBottom: 1,
  },
  cell: {
    paddingRight: 4,
  },
  tanggal: {
    width: '12%',
  },
  hari: {
    width: '8%',
  },
  jam: {
    width: '10%',
  },
  cepat: {
    width: '10%',
  },
  keterangan: {
    width: '20%',
  },
  dangerText: {
    color: 'red',
  },
})

// Create Document Component
function PdfPegawaiBulanan() {
  console.debug('rendering... PdfPegawaiBulanan')

  const { id, tahun, bulan } = useParams()
  const [items, setItems] = useState([])
  const [profil, setProfil] = useState()

  const keycloak = useContext(KeycloakContext)

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/pegawai/${id}/riwayat-kehadiran?bulan=${bulan}&tahun=${tahun}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      .then(
        (response) => {
          // setLoading(false)
          setItems(response.data.riwayatKehadiran)
          // console.log(data.riwayat)
        },
        // (error) => {
        //   // setLoading(false)
        //   // setError(error)
        // },
      )
    axios
      .get(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/pegawai/${id}/riwayat-profil?bulan=${bulan}&tahun=${tahun}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      .then((response) => {
        setProfil(response.data.riwayatProfil?.[0])
      })
  }, [bulan, id, tahun])

  let itemsTable = []
  if (items.length > 0) {
    items.forEach((row) => {
      const isTanpaKeterangan = row.keterangan === 'Tanpa Keterangan'
      const cellStyle = isTanpaKeterangan ? styles.dangerText : null
      const itemTable = (
        <View key={row.tanggal} style={styles.row}>
          <Text style={[styles.cell, styles.tanggal, cellStyle]}>
            {dayjs(row.tanggal).format('DD-MM-YYYY')}
          </Text>
          <Text style={[styles.cell, styles.hari, cellStyle]}>{row.hari || '-'}</Text>
          <Text style={[styles.cell, styles.jam, cellStyle]}>
            {row.jadwalDatang ? row.jadwalDatang.substr(0, 5) : '-'}
          </Text>
          <Text style={[styles.cell, styles.jam, cellStyle]}>
            {row.absenDatang ? row.absenDatang.substr(0, 5) : '-'}
          </Text>
          <Text style={[styles.cell, styles.cepat, cellStyle]}>
            {typeof row.cepatTelatDatang === 'number' ? row.cepatTelatDatang : '-'}
          </Text>
          <Text style={[styles.cell, styles.jam, cellStyle]}>
            {row.jadwalPulang ? row.jadwalPulang.substr(0, 5) : '-'}
          </Text>
          <Text style={[styles.cell, styles.jam, cellStyle]}>
            {row.absenPulang ? row.absenPulang.substr(0, 5) : '-'}
          </Text>
          <Text style={[styles.cell, styles.cepat, cellStyle]}>
            {typeof row.cepatTelatPulang === 'number' ? row.cepatTelatPulang : '-'}
          </Text>
          <Text style={[styles.cell, styles.keterangan, cellStyle]}>{row.keterangan || '-'}</Text>
        </View>
      )
      itemsTable.push(itemTable)
    })
  }

  return (
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document>
        {/*render a single page*/}
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>
              Data Kehadiran {namaBulan(Number(bulan))} {tahun}
            </Text>
            <View style={styles.infoRow}>
              <Text style={[styles.author, styles.infoLabel]}>Nama</Text>
              <Text style={[styles.author, styles.infoValue]}>: {profil?.nama || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.author, styles.infoLabel]}>NIP</Text>
              <Text style={[styles.author, styles.infoValue]}>: {profil?.nip || id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.author, styles.infoLabel]}>Jabatan</Text>
              <Text style={[styles.author, styles.infoValue]}>: {profil?.jabatan || '-'}</Text>
            </View>
            <View style={styles.table}>
              <View style={[styles.row, styles.header]}>
                <Text style={[styles.cell, styles.tanggal]}>Tanggal</Text>
                <Text style={[styles.cell, styles.hari]}>Hari</Text>
                <Text style={[styles.cell, styles.jam]}>Jadwal Datang</Text>
                <Text style={[styles.cell, styles.jam]}>Absen Datang</Text>
                <Text style={[styles.cell, styles.cepat]}>Cepat/Telat Datang</Text>
                <Text style={[styles.cell, styles.jam]}>Jadwal Pulang</Text>
                <Text style={[styles.cell, styles.jam]}>Absen Pulang</Text>
                <Text style={[styles.cell, styles.cepat]}>Cepat/Telat Pulang</Text>
                <Text style={[styles.cell, styles.keterangan]}>Keterangan</Text>
              </View>
              {itemsTable}
            </View>
            <Text style={styles.source}>
              Sumber: simpeg.ar-raniry.ac.id {dayjs().format('YYYY-MM-DD HH:mm:ss')}
            </Text>
            <View style={styles.signature}>
              <Text>Mengetahui,</Text>
              <Text>Atasan Langsung</Text>
              <Text> </Text>
              <Text> </Text>
              <Text> </Text>
              <Text> </Text>
              <Text>NIP.</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
}

export default PdfPegawaiBulanan
