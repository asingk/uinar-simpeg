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
    paddingBottom: 1,
    borderBottom: 1,
  },
  tanggal: {
    width: '40%',
  },
  jam: {
    width: '30%',
  },
})

// Create Document Component
function PdfPegawaiBulanan() {
  console.debug('rendering... PdfPegawaiBulanan')

  const { id, tahun, bulan } = useParams()
  const [items, setItems] = useState([])

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
  }, [bulan, id, tahun])

  let itemsTable = []
  if (items.length > 0) {
    items.forEach((row) => {
      const itemTable = (
        <View key={row.tanggal} style={styles.row}>
          <Text style={styles.tanggal}>{dayjs(row.tanggal).format('DD/MM/YYYY')}</Text>
          <Text style={styles.jam}>
            {row.keteranganDatang || (row.jamDatang ? row.jamDatang.substr(0, 5) : '-')}
          </Text>
          <Text style={styles.jam}>
            {row.keteranganPulang || (row.jamPulang ? row.jamPulang.substr(0, 5) : '-')}
          </Text>
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
              Riwayat Kehadiran {namaBulan(bulan)} {tahun}
            </Text>
            <Text style={styles.author}>{items?.nama}</Text>
            <Text style={styles.author}>{id}</Text>
            <View style={styles.table}>
              <View style={[styles.row, styles.header]}>
                <Text style={styles.tanggal}>Tanggal</Text>
                <Text style={styles.jam}>Datang</Text>
                <Text style={styles.jam}>Pulang</Text>
              </View>
              {itemsTable}
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
}

export default PdfPegawaiBulanan
