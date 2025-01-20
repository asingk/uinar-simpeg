import React, { useEffect, useState } from 'react'
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'

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

  useEffect(() => {
    fetch(
      import.meta.env.VITE_KEHADIRAN_API_URL +
        '/pegawai/' +
        id +
        '/riwayat-hadir?bulan=' +
        bulan +
        '&tahun=' +
        tahun,
    )
      .then((res) => res.json())
      .then(
        (data) => {
          // setLoading(false)
          setItems(data)
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

  const namaBulan = (bulan) => {
    switch (parseInt(bulan)) {
      case 1:
        return 'Januari'
      case 2:
        return 'Februari'
      case 3:
        return 'Maret'
      case 4:
        return 'April'
      case 5:
        return 'Mei'
      case 6:
        return 'Juni'
      case 7:
        return 'Juli'
      case 8:
        return 'Agustus'
      case 9:
        return 'September'
      case 10:
        return 'Oktober'
      case 11:
        return 'November'
      case 12:
        return 'Desember'
      default:
        return ''
    }
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
