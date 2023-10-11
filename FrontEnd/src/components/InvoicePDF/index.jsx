import {
  StyleSheet,
  Document,
  Page,
  View,
  Text
} from '@react-pdf/renderer';

import { splitString, toProperDateTime, getCurrentDateTime } from '../../functions';



const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    padding: 32,
  },

  header: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'black',

    title: {
      fontSize: 20
    },
    info: {
      fontSize: 12
    },
    subInfo: {
      fontSize: 8
    }
  },

  info: {
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',

    propertyWrapper: {
      flexDirection: 'row'
    },
    text: {
      fontSize: 12
    },
    colon: {
      marginLeft: 16,
      marginRight: 8
    }
  },

  table: {
    marginTop: 8,
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: 'black',

    notNoteWrapper: {
      flex: 4
    },
    row: type => ({
      flexDirection: 'row',
      gap: 4,
      borderBottomWidth: (type === 'data-last') ? 0 : 1,
      borderBottomStyle: (type === 'head') ? 'solid' : 'dashed',
      borderColor: 'black'
    }),
    colType: type => ({
      flex:
        (type === 'no') ? 1 :
        (type === 'service') ? 7 :
        (type === 'price') ? 2 : null,
      justifyContent: 'center',
      borderRightWidth: (type === 'no') ? 1 : 0,
      borderLeftWidth: (type === 'price') ? 1 : 0,
      borderColor: 'black'
    }),
    cell: (horAlign='left', fontSize='sm') => ({
      fontSize:
        (fontSize === 'sm') ? 12 :
        (fontSize === 'lg') ? 14 : null,
      textAlign: horAlign
    }),
    note: {
      flex: 1,
      borderLeftWidth: 1,
      borderColor: 'black',

      head: {
        fontSize: 14,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderColor: 'black'
      },
      data: {
        fontSize: 12,
        paddingHorizontal: 4
      }
    },
    total: {
      paddingBottom: 8,
      width: '50%',
      alignSelf: 'flex-end',
      flexDirection: 'row',
      gap: 32,

      text: {
        fontSize: 14
      }
    }
  },

  footer: {
    paddingTop: 8,
    fontSize: 12,
    textAlign: 'right'
  }
});



export default function PDF({ invoice }) {
  console.log('invoice', invoice);
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.header.title}>Mitra Oto</Text>
          <Text style={styles.header.info}>Jl. Pingkan Matindas No. 48, Dendengan Dalam</Text>
          <Text style={styles.header.subInfo}>No. HP: 081356071990</Text>
        </View>

        <View style={styles.info}>
          <View>
            {[
              'Nama Customer',
              'Jenis Kendaraan',
              'Nomor Polisi',
              'Tanggal Masuk',
              'Tanggal Keluar',
              'Kilometer'
            ].map((key, index) => <Text key={index} style={styles.info.text}>{key}</Text>)}
          </View>
          <View>
            {[...new Array(6)].map(index => <Text key={index} style={[styles.info.text, styles.info.colon]}>:</Text>)}
          </View>
          <View>
            {[
              invoice.customerName,
              invoice.vehicleType,
              invoice.vehiclePlate,
              invoice.entryDate ? toProperDateTime(invoice.entryDate, true) : '',
              invoice.outDate ? toProperDateTime(invoice.outDate, true) : '',
              invoice.kilometer
            ].map((value, index) => <Text key={index} style={styles.info.text}>{value ? value : '-'}</Text>)}
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.table.notNoteWrapper}>
            <View style={styles.table.row('head')}>
              <View style={styles.table.colType('no')}>
                <Text style={styles.table.cell('center', 'lg')}>No.</Text>
              </View>
              <View style={styles.table.colType('service')}>
                <Text style={styles.table.cell('center', 'lg')}>Uraian Pekerjaan</Text>
              </View>
              <View style={styles.table.colType('price')}>
                <Text style={styles.table.cell('center', 'lg')}>Harga</Text>
              </View>
            </View>
            {invoice.services.map((service, index) => (
              <View key={index} style={styles.table.row(`data${(index === invoice.services.length-1) ? '-last' : ''}`)}>
                <View style={styles.table.colType('no')}>
                  <Text style={styles.table.cell('center')}>{index+1}</Text>
                </View>
                <View style={styles.table.colType('service')}>
                  {service.primary.map((primary, subIndex) => <Text key={subIndex} style={styles.table.cell()}>{primary}</Text>)}
                  {service.secondary.map((secondary, subIndex) => <Text key={subIndex} style={styles.table.cell()}>- {secondary}</Text>)}
                </View>
                <View style={styles.table.colType('price')}>
                  <Text style={styles.table.cell('right')}>Rp. {splitString(service.price, 3, '.')} </Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.table.note}>
            <Text style={styles.table.note.head}>Keterangan</Text>
            <Text style={styles.table.note.data}>{invoice.note}</Text>
          </View>
        </View>
        <View style={styles.table.total}>
          <Text style={styles.table.total.text}>Jumlah</Text>
          <Text style={styles.table.total.text}>: Rp. {splitString(invoice.totalPrice, 3, '.')}</Text>
        </View>

        <Text style={styles.footer}>Manado, {toProperDateTime(getCurrentDateTime(), true)}</Text>
      </Page>
    </Document>
  );
};
